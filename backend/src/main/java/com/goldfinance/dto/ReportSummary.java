package com.goldfinance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ReportSummary(
        LocalDate fromDate,
        LocalDate toDate,
        BigDecimal totalCollections,
        BigDecimal interestCollected,
        long activeLoans,
        long closedLoans,
        long bankLoans
) {
}

