package com.goldfinance.dto;

import com.goldfinance.entity.JewelleryItemType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record JewelleryItemRequest(
        @NotNull JewelleryItemType itemType,
        @NotBlank @Size(max = 500) String description,
        @NotNull @DecimalMin(value = "0.001") BigDecimal weightGrams,
        @NotBlank @Size(max = 40) String estimatedPurity,
        @NotNull @DecimalMin(value = "0.01") BigDecimal estimatedValue,
        @NotBlank @Size(max = 80) String lockerNumber,
        @Size(max = 1000) String remarks
) {
}

