package com.goldfinance.dto;

public record JewelleryPhotoResponse(
        Long id,
        String path,
        String originalFileName,
        String contentType
) {
}

