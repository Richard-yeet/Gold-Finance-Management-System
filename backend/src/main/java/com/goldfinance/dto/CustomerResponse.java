package com.goldfinance.dto;

import java.time.Instant;

public record CustomerResponse(
        Long id,
        String customerCode,
        String name,
        String phoneNumber,
        String alternativePhone,
        String address,
        String governmentIdNumber,
        Instant createdAt
) {
}

