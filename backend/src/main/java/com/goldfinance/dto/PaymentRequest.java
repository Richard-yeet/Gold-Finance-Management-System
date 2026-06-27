package com.goldfinance.dto;

import com.goldfinance.entity.PaymentType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PaymentRequest(
        @NotNull PaymentType paymentType,
        @NotNull @DecimalMin(value = "0.01") BigDecimal amount,
        @NotNull LocalDate paymentDate,
        @Size(max = 1000) String notes
) {
}

