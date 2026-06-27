package com.goldfinance.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        long totalActiveLoans,
        long totalCustomers,
        BigDecimal totalOutstandingPrincipal,
        BigDecimal totalOutstandingInterest,
        BigDecimal totalAmountReceivable,
        BigDecimal todaysCollections,
        long loansDueThisWeek,
        long bankLoansNearingRenewal,
        long loansOverdue,
        List<PaymentResponse> recentTransactions,
        List<String> notifications
) {
}

