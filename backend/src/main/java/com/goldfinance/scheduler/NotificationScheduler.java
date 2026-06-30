package com.goldfinance.scheduler;

import com.goldfinance.entity.Loan;
import com.goldfinance.entity.LoanStatus;
import com.goldfinance.entity.NotificationType;
import com.goldfinance.repository.LoanRepository;
import com.goldfinance.repository.BankLoanRepository;
import com.goldfinance.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class NotificationScheduler {

    private final LoanRepository loanRepository;
    private final BankLoanRepository bankLoanRepository;
    private final NotificationService notificationService;

    /**
     * Runs daily at 08:00 to check for overdue loans
     */
    @Scheduled(cron = "0 0 8 * * *")
    @Transactional
    public void checkOverdueLoans() {
        log.info("Running scheduled overdue loan check...");
        
        List<Loan> overdueLoans = loanRepository.findByStatusAndLoanDateBefore(
                LoanStatus.ACTIVE, LocalDate.now());

        for (Loan loan : overdueLoans) {
            // Check if already notified for overdue
            // For now, we'll create a notification each run - in production you might want to track this
            notificationService.createNotification(
                    NotificationType.LOAN_OVERDUE,
                    "Loan Overdue",
                    "Loan " + loan.getLoanNumber() + " for customer " + loan.getCustomer().getName() + " is overdue.",
                    "LOAN",
                    loan.getId(),
                    "/loans/" + loan.getId()
            );
            
            // Optionally mark as DEFAULTED after a certain period
            // loan.setStatus(LoanStatus.DEFAULTED);
            // loanRepository.save(loan);
        }
        
        log.info("Overdue loan check complete. Found {} overdue loans.", overdueLoans.size());
    }

    /**
     * Runs daily at 09:00 to check for bank loan renewals due within 7 days
     */
    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void checkBankLoanRenewals() {
        log.info("Running scheduled bank loan renewal check...");
        
        var dueBankLoans = bankLoanRepository.findByStatusAndRenewalDateBetweenOrderByRenewalDateAsc(
                com.goldfinance.entity.BankLoanStatus.ACTIVE,
                LocalDate.now(),
                LocalDate.now().plusDays(7)
        );

        for (var bankLoan : dueBankLoans) {
            long daysUntilRenewal = java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), bankLoan.getRenewalDate());
            
            notificationService.createNotification(
                    NotificationType.BANK_LOAN_RENEWAL_DUE,
                    "Bank Loan Renewal Due",
                    "Bank loan " + bankLoan.getLoanNumber() + " from " + bankLoan.getBankName() + 
                    " renewal is due in " + daysUntilRenewal + " day(s) (" + bankLoan.getRenewalDate() + ")",
                    "BANK_LOAN",
                    bankLoan.getId(),
                    "/bank-loans/" + bankLoan.getId()
            );
        }
        
        log.info("Bank loan renewal check complete. Found {} loans due for renewal.", dueBankLoans.size());
    }
}