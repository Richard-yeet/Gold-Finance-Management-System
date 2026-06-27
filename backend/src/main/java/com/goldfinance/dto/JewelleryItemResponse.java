package com.goldfinance.dto;

import com.goldfinance.entity.JewelleryItemType;

import java.math.BigDecimal;
import java.util.List;

public record JewelleryItemResponse(
        Long id,
        JewelleryItemType itemType,
        String description,
        BigDecimal weightGrams,
        String estimatedPurity,
        BigDecimal estimatedValue,
        String lockerNumber,
        String remarks,
        List<JewelleryPhotoResponse> photos
) {
}

