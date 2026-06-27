package com.goldfinance.service;

import com.goldfinance.entity.Loan;
import com.goldfinance.util.InterestCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class LoanAccountingService {

    private final InterestCalculator interestCalculator;

    public InterestCalculator.InterestBreakdown refreshOutstanding(Loan loan, LocalDate asOf) {
        var breakdown = interestCalculator.calculate(loan, asOf);
        loan.setOutstandingPrincipal(breakdown.remainingPrincipal());
        loan.setOutstandingInterest(breakdown.remainingInterest());
        loan.setOutstandingAmount(breakdown.totalPayable());
        return breakdown;
    }
}

