package com.goldfinance.dto;

import com.goldfinance.entity.InterestPaymentFrequency;
import com.goldfinance.entity.InterestType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record LoanCreateRequest(
        @NotNull Long customerId,
        @NotEmpty List<@Valid JewelleryItemRequest> jewelleryItems,
        @NotNull @DecimalMin(value = "0.01") BigDecimal principalAmount,
        @NotNull @DecimalMin(value = "0.0001") BigDecimal interestRate,
        @NotNull InterestType interestType,
        @NotNull InterestPaymentFrequency interestPaymentFrequency,
        @NotNull LocalDate loanDate,
        @Size(max = 1000) String notes
) {
}

