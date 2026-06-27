package com.goldfinance.util;

import com.goldfinance.entity.InterestType;
import com.goldfinance.entity.Loan;
import com.goldfinance.entity.Payment;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;

@Component
public class InterestCalculator {

    private static final BigDecimal ONE_HUNDRED = new BigDecimal("100");
    private static final BigDecimal DAYS_IN_MONTH = new BigDecimal("30");
    private static final BigDecimal DAYS_IN_YEAR = new BigDecimal("365");

    public InterestBreakdown calculate(Loan loan, LocalDate asOf) {
        BigDecimal principal = loan.getPrincipalAmount();
        BigDecimal accruedInterest = BigDecimal.ZERO;
        BigDecimal paidInterest = BigDecimal.ZERO;
        LocalDate segmentStart = loan.getLoanDate();

        var payments = loan.getPayments().stream()
                .filter(payment -> !payment.getPaymentDate().isAfter(asOf))
                .sorted(Comparator.comparing(Payment::getPaymentDate))
                .toList();

        for (Payment payment : payments) {
            accruedInterest = accruedInterest.add(interestFor(principal, loan.getInterestRate(), loan.getInterestType(), segmentStart, payment.getPaymentDate()));
            paidInterest = paidInterest.add(payment.getInterestComponent());
            principal = principal.subtract(payment.getPrincipalComponent()).max(BigDecimal.ZERO);
            segmentStart = payment.getPaymentDate();
        }

        accruedInterest = accruedInterest.add(interestFor(principal, loan.getInterestRate(), loan.getInterestType(), segmentStart, asOf));
        BigDecimal remainingInterest = accruedInterest.subtract(paidInterest).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
        BigDecimal remainingPrincipal = principal.max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
        return new InterestBreakdown(
                remainingPrincipal,
                remainingInterest,
                remainingPrincipal.add(remainingInterest).setScale(2, RoundingMode.HALF_UP),
                accruedInterest.setScale(2, RoundingMode.HALF_UP),
                paidInterest.setScale(2, RoundingMode.HALF_UP)
        );
    }

    private BigDecimal interestFor(BigDecimal principal, BigDecimal rate, InterestType type, LocalDate from, LocalDate to) {
        if (principal.signum() <= 0 || !to.isAfter(from)) {
            return BigDecimal.ZERO;
        }
        BigDecimal days = BigDecimal.valueOf(ChronoUnit.DAYS.between(from, to));
        BigDecimal rateFraction = rate.divide(ONE_HUNDRED, 10, RoundingMode.HALF_UP);
        BigDecimal period = switch (type) {
            case MONTHLY_SIMPLE, COMPOUND -> days.divide(DAYS_IN_MONTH, 10, RoundingMode.HALF_UP);
            case ANNUAL_SIMPLE -> days.divide(DAYS_IN_YEAR, 10, RoundingMode.HALF_UP);
        };
        return principal.multiply(rateFraction).multiply(period);
    }

    public record InterestBreakdown(
            BigDecimal remainingPrincipal,
            BigDecimal remainingInterest,
            BigDecimal totalPayable,
            BigDecimal accruedInterest,
            BigDecimal paidInterest
    ) {
    }
}

