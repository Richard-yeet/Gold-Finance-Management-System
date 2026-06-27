package com.goldfinance.dto;

import com.goldfinance.entity.UserRole;

public record AuthResponse(
        String token,
        String tokenType,
        String username,
        UserRole role,
        long expiresInMinutes
) {
}

