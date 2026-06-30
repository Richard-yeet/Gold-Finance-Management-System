package com.goldfinance.service;

import com.goldfinance.dto.BankLoanRequest;
import com.goldfinance.dto.BankLoanResponse;
import com.goldfinance.dto.PageResponse;
import com.goldfinance.entity.BankLoanStatus;
import com.goldfinance.exception.ResourceNotFoundException;
import com.goldfinance.mapper.BankLoanMapper;
import com.goldfinance.repository.BankLoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BankLoanService {

    private final BankLoanRepository bankLoanRepository;
    private final BankLoanMapper bankLoanMapper;
    private final AuditService auditService;
    private final NotificationService notificationService;

    @Transactional
    public BankLoanResponse create(BankLoanRequest request) {
        var saved = bankLoanRepository.save(bankLoanMapper.toEntity(request));

        // Notify: Bank Loan Created
        notificationService.createNotification(
                com.goldfinance.entity.NotificationType.BANK_LOAN_CREATED,
                "Bank Loan Created",
                "New bank loan " + saved.getLoanNumber() + " from " + saved.getBankName() + " for " + saved.getLoanAmount().toPlainString(),
                "BANK_LOAN",
                saved.getId(),
                "/bank-loans/" + saved.getId()
        );

        auditService.record("CREATE", "BankLoan", saved.getId(), "Created bank loan " + saved.getLoanNumber());
        return bankLoanMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public BankLoanResponse get(Long id) {
        return bankLoanMapper.toResponse(find(id));
    }

    @Transactional(readOnly = true)
    public PageResponse<BankLoanResponse> list(Pageable pageable) {
        return PageResponse.from(bankLoanRepository.findAll(pageable).map(bankLoanMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public List<BankLoanResponse> renewalsWithin(int days) {
        return bankLoanRepository.findByStatusAndRenewalDateBetweenOrderByRenewalDateAsc(
                        BankLoanStatus.ACTIVE,
                        LocalDate.now(),
                        LocalDate.now().plusDays(days))
                .stream()
                .map(bankLoanMapper::toResponse)
                .toList();
    }

    @Transactional
    public BankLoanResponse update(Long id, BankLoanRequest request) {
        var bankLoan = find(id);
        bankLoanMapper.update(request, bankLoan);

        // Notify: Bank Loan Updated (renewal date change could trigger renewal due)
        if (bankLoan.getRenewalDate().isBefore(LocalDate.now().plusDays(30))) {
            notificationService.createNotification(
                    com.goldfinance.entity.NotificationType.BANK_LOAN_RENEWAL_DUE,
                    "Bank Loan Renewal Due",
                    "Bank loan " + bankLoan.getLoanNumber() + " from " + bankLoan.getBankName() + " renewal is due on " + bankLoan.getRenewalDate(),
                    "BANK_LOAN",
                    id,
                    "/bank-loans/" + id
            );
        }

        auditService.record("UPDATE", "BankLoan", id, "Updated bank loan " + bankLoan.getLoanNumber());
        return bankLoanMapper.toResponse(bankLoan);
    }

    private com.goldfinance.entity.BankLoan find(Long id) {
        return bankLoanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bank loan not found"));
    }
}