package com.goldfinance.dto;

import com.goldfinance.entity.BankLoanStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BankLoanRequest(
        @NotBlank @Size(max = 160) String bankName,
        @NotBlank @Size(max = 160) String branch,
        @NotBlank @Size(max = 80) String loanNumber,
        @NotNull @DecimalMin(value = "0.01") BigDecimal loanAmount,
        @NotNull @DecimalMin(value = "0.0001") BigDecimal interestRate,
        @NotNull LocalDate startDate,
        @NotNull LocalDate renewalDate,
        @NotNull LocalDate expiryDate,
        @NotNull BankLoanStatus status,
        @Size(max = 1000) String notes
) {
}

