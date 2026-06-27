package com.goldfinance.service;

import com.goldfinance.dto.DashboardResponse;
import com.goldfinance.entity.BankLoanStatus;
import com.goldfinance.entity.InterestPaymentFrequency;
import com.goldfinance.entity.Loan;
import com.goldfinance.entity.LoanStatus;
import com.goldfinance.mapper.PaymentMapper;
import com.goldfinance.repository.BankLoanRepository;
import com.goldfinance.repository.CustomerRepository;
import com.goldfinance.repository.LoanRepository;
import com.goldfinance.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final LoanRepository loanRepository;
    private final CustomerRepository customerRepository;
    private final PaymentRepository paymentRepository;
    private final BankLoanRepository bankLoanRepository;
    private final PaymentMapper paymentMapper;

    @Transactional(readOnly = true)
    public DashboardResponse dashboard() {
        LocalDate today = LocalDate.now();
        var activeLoans = loanRepository.findAll().stream()
                .filter(loan -> loan.getStatus() == LoanStatus.ACTIVE)
                .toList();
        long dueThisWeek = activeLoans.stream().filter(loan -> {
            LocalDate dueDate = nextDueDate(loan, today);
            return !dueDate.isBefore(today) && !dueDate.isAfter(today.plusDays(7));
        }).count();
        long overdue = activeLoans.stream().filter(loan -> nextDueDate(loan, today).isBefore(today)).count();
        long bankRenewals = bankLoanRepository.findByStatusAndRenewalDateBetweenOrderByRenewalDateAsc(
                BankLoanStatus.ACTIVE,
                today,
                today.plusDays(90)
        ).size();
        var notifications = new ArrayList<String>();
        if (overdue > 0) {
            notifications.add(overdue + " customer loans have overdue interest payments");
        }
        if (bankRenewals > 0) {
            notifications.add(bankRenewals + " bank loans need renewal within 90 days");
        }
        activeLoans.stream()
                .filter(loan -> loan.getOutstandingAmount().compareTo(new BigDecimal("100000")) >= 0)
                .limit(5)
                .forEach(loan -> notifications.add("Large unpaid balance on loan " + loan.getLoanNumber()));

        var principal = loanRepository.sumOutstandingPrincipal(LoanStatus.ACTIVE);
        var interest = loanRepository.sumOutstandingInterest(LoanStatus.ACTIVE);
        return new DashboardResponse(
                loanRepository.countByStatus(LoanStatus.ACTIVE),
                customerRepository.count(),
                principal,
                interest,
                principal.add(interest),
                paymentRepository.sumCollectionsOn(today),
                dueThisWeek,
                bankRenewals,
                overdue,
                paymentRepository.findTop8ByOrderByCreatedAtDesc().stream().map(paymentMapper::toResponse).toList(),
                notifications
        );
    }

    private LocalDate nextDueDate(Loan loan, LocalDate today) {
        int periodMonths = loan.getInterestPaymentFrequency() == InterestPaymentFrequency.QUARTERLY ? 3 : 1;
        LocalDate due = loan.getLoanDate().plusMonths(periodMonths);
        while (due.isBefore(today.minusDays(1))) {
            due = due.plusMonths(periodMonths);
        }
        return due;
    }
}

