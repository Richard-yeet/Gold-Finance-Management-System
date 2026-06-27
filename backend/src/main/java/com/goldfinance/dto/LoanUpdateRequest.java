package com.goldfinance.dto;

import com.goldfinance.entity.InterestPaymentFrequency;
import com.goldfinance.entity.InterestType;
import com.goldfinance.entity.LoanStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record LoanUpdateRequest(
        @NotNull @DecimalMin(value = "0.0001") BigDecimal interestRate,
        @NotNull InterestType interestType,
        @NotNull InterestPaymentFrequency interestPaymentFrequency,
        @NotNull LoanStatus status,
        @Size(max = 1000) String notes
) {
}

