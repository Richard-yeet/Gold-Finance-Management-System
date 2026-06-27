package com.goldfinance.dto;

import com.goldfinance.entity.BankLoanStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BankLoanResponse(
        Long id,
        String bankName,
        String branch,
        String loanNumber,
        BigDecimal loanAmount,
        BigDecimal interestRate,
        LocalDate startDate,
        LocalDate renewalDate,
        LocalDate expiryDate,
        BankLoanStatus status,
        String notes,
        long daysUntilRenewal
) {
}

