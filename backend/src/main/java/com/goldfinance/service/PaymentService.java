package com.goldfinance.service;

import com.goldfinance.dto.PaymentRequest;
import com.goldfinance.dto.PaymentResponse;
import com.goldfinance.entity.LoanStatus;
import com.goldfinance.entity.Payment;
import com.goldfinance.entity.PaymentType;
import com.goldfinance.exception.BusinessException;
import com.goldfinance.mapper.PaymentMapper;
import com.goldfinance.repository.LoanRepository;
import com.goldfinance.repository.PaymentRepository;
import com.goldfinance.util.LoanNumberGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final LoanService loanService;
    private final LoanRepository loanRepository;
    private final PaymentRepository paymentRepository;
    private final LoanAccountingService accountingService;
    private final LoanNumberGenerator numberGenerator;
    private final PaymentMapper paymentMapper;
    private final AuditService auditService;

    @Transactional
    public PaymentResponse record(Long loanId, PaymentRequest request) {
        var loan = loanService.findDetailedLoan(loanId);
        if (loan.getStatus() != LoanStatus.ACTIVE) {
            throw new BusinessException("Payments can only be recorded against active loans");
        }
        if (request.paymentDate().isBefore(loan.getLoanDate())) {
            throw new BusinessException("Payment date cannot be before loan date");
        }

        if (PaymentType.INTEREST_ONLY.equals(request.paymentType()) && request.amount().compareTo(loan.getOutstandingInterest()) > 0) {
            throw new BusinessException("Interest payment exceeds outstanding interest");
        }

        var due = accountingService.refreshOutstanding(loan, request.paymentDate());

        if (request.amount() == null || request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Payment amount must be greater than zero");
        }
        BigDecimal principalComponent = BigDecimal.ZERO;
        BigDecimal interestComponent = BigDecimal.ZERO;

        switch (request.paymentType()) {

            case INTEREST_ONLY -> {

                interestComponent = request.amount();
            }

            case PRINCIPAL -> {

                if (request.amount().compareTo(due.remainingPrincipal()) > 0) {
                    throw new BusinessException("Principal payment exceeds outstanding principal");
                }

                principalComponent = request.amount();
            }

            case FULL_SETTLEMENT -> {

                if (request.amount().compareTo(due.totalPayable()) != 0) {
                    throw new BusinessException("Full settlement amount must exactly match outstanding balance");
                }

                principalComponent = due.remainingPrincipal();
                interestComponent = due.remainingInterest();
            }

            default -> throw new BusinessException("Unsupported payment type");
        }

        var payment = Payment.builder().loan(loan).receiptNumber(numberGenerator.nextReceiptNumber()).paymentType(request.paymentType()).amount(request.amount()).principalComponent(principalComponent).interestComponent(interestComponent).paymentDate(request.paymentDate()).notes(request.notes()).build();
        loan.addPayment(payment);
        paymentRepository.save(payment);
        accountingService.refreshOutstanding(loan, LocalDate.now());
        if (loan.getOutstandingAmount().compareTo(BigDecimal.ZERO) == 0) {
            loan.setStatus(LoanStatus.CLOSED);
            loan.setClosedDate(request.paymentDate());
            loan.setOutstandingPrincipal(BigDecimal.ZERO);
            loan.setOutstandingInterest(BigDecimal.ZERO);
            loan.setOutstandingAmount(BigDecimal.ZERO);
        }

        loanRepository.save(loan);
        auditService.record("PAYMENT", "Loan", loanId, "Recorded receipt " + payment.getReceiptNumber());
        return paymentMapper.toResponse(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> history(Long loanId) {
        return paymentRepository.findByLoanIdOrderByPaymentDateAsc(loanId).stream().map(paymentMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public String receipt(Long paymentId) {
        var payment = paymentRepository.findById(paymentId).orElseThrow(() -> new com.goldfinance.exception.ResourceNotFoundException("Payment not found"));
        return """
                GOLD FINANCE PAYMENT RECEIPT
                Receipt: %s
                Loan: %s
                Date: %s
                Type: %s
                Amount: %s
                Principal: %s
                Interest: %s
                """.formatted(payment.getReceiptNumber(), payment.getLoan().getLoanNumber(), payment.getPaymentDate(), payment.getPaymentType(), payment.getAmount(), payment.getPrincipalComponent(), payment.getInterestComponent());
    }
}
