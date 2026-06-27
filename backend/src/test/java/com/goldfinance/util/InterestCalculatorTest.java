package com.goldfinance.util;

import com.goldfinance.entity.InterestPaymentFrequency;
import com.goldfinance.entity.InterestType;
import com.goldfinance.entity.Loan;
import com.goldfinance.entity.LoanStatus;
import com.goldfinance.entity.Payment;
import com.goldfinance.entity.PaymentType;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class InterestCalculatorTest {

    private final InterestCalculator calculator = new InterestCalculator();

    @Test
    void calculatesMonthlyInterestAcrossPrincipalReduction() {
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

        loan.addPayment(Payment.builder()
                .receiptNumber("RCP-2026-000001")
                .paymentType(PaymentType.PRINCIPAL)
                .amount(new BigDecimal("5000.00"))
                .principalComponent(new BigDecimal("5000.00"))
                .interestComponent(BigDecimal.ZERO)
                .paymentDate(LocalDate.of(2026, 1, 31))
                .build());

        var breakdown = calculator.calculate(loan, LocalDate.of(2026, 3, 2));

        assertThat(breakdown.remainingPrincipal()).isEqualByComparingTo("5000.00");
        assertThat(breakdown.remainingInterest()).isEqualByComparingTo("450.00");
        assertThat(breakdown.totalPayable()).isEqualByComparingTo("5450.00");
    }
}

