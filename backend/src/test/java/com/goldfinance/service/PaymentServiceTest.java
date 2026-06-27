package com.goldfinance.service;

import com.goldfinance.dto.PaymentRequest;
import com.goldfinance.dto.PaymentResponse;
import com.goldfinance.entity.InterestPaymentFrequency;
import com.goldfinance.entity.InterestType;
import com.goldfinance.entity.Loan;
import com.goldfinance.entity.LoanStatus;
import com.goldfinance.entity.Payment;
import com.goldfinance.entity.PaymentType;
import com.goldfinance.mapper.PaymentMapper;
import com.goldfinance.repository.LoanRepository;
import com.goldfinance.repository.PaymentRepository;
import com.goldfinance.util.InterestCalculator;
import com.goldfinance.util.LoanNumberGenerator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Test
    void recordsPrincipalPaymentAndRefreshesOutstandingBalance() {
        var loanService = mock(LoanService.class);
        var loanRepository = mock(LoanRepository.class);
        var paymentRepository = mock(PaymentRepository.class);
        var numberGenerator = mock(LoanNumberGenerator.class);
        var auditService = mock(AuditService.class);
        var accountingService = new LoanAccountingService(new InterestCalculator());
        PaymentMapper mapper = payment -> new PaymentResponse(
                payment.getId(),
                1L,
                payment.getLoan().getLoanNumber(),
                payment.getReceiptNumber(),
                payment.getPaymentType(),
                payment.getAmount(),
                payment.getPrincipalComponent(),
                payment.getInterestComponent(),
                payment.getPaymentDate(),
                payment.getNotes()
        );
        var service = new PaymentService(
                loanService,
                loanRepository,
                paymentRepository,
                accountingService,
                numberGenerator,
                mapper,
                auditService
        );
        var loan = Loan.builder()
                .loanNumber("GFL-2026-000001")
                .principalAmount(new BigDecimal("10000.00"))
                .interestRate(new BigDecimal("3.00"))
                .interestType(InterestType.MONTHLY_SIMPLE)
                .interestPaymentFrequency(InterestPaymentFrequency.MONTHLY)
                .loanDate(LocalDate.of(2026, 1, 1))
                .status(LoanStatus.ACTIVE)
                .outstandingPrincipal(new BigDecimal("10000.00"))
                .outstandingInterest(BigDecimal.ZERO)
                .outstandingAmount(new BigDecimal("10000.00"))
                .build();

        when(loanService.findDetailedLoan(1L)).thenReturn(loan);
        when(numberGenerator.nextReceiptNumber()).thenReturn("RCP-2026-000001");
        when(loanRepository.save(any(Loan.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.record(1L, new PaymentRequest(
                PaymentType.PRINCIPAL,
                new BigDecimal("2500.00"),
                LocalDate.of(2026, 1, 31),
                "Part payment"
        ));

        var captor = ArgumentCaptor.forClass(Loan.class);
        verify(loanRepository).save(captor.capture());
        assertThat(response.principalComponent()).isEqualByComparingTo("2500.00");
        assertThat(response.interestComponent()).isEqualByComparingTo("0");
        assertThat(captor.getValue().getOutstandingPrincipal()).isEqualByComparingTo("7500.00");
        assertThat(captor.getValue().getOutstandingInterest()).isGreaterThan(BigDecimal.ZERO);
    }
}
