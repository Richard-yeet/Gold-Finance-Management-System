package com.goldfinance.dto;

public record SearchResult(
        String type,
        Long id,
        String title,
        String subtitle
) {
}

