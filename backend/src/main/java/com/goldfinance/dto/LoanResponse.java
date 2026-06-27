package com.goldfinance.dto;

import com.goldfinance.entity.InterestPaymentFrequency;
import com.goldfinance.entity.InterestType;
import com.goldfinance.entity.LoanStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record LoanResponse(
        Long id,
        String loanNumber,
        Long customerId,
        String customerName,
        BigDecimal principalAmount,
        BigDecimal interestRate,
        InterestType interestType,
        InterestPaymentFrequency interestPaymentFrequency,
        LocalDate loanDate,
        LocalDate closedDate,
        LoanStatus status,
        BigDecimal outstandingPrincipal,
        BigDecimal outstandingInterest,
        BigDecimal outstandingAmount,
        String notes,
        List<JewelleryItemResponse> jewelleryItems,
        List<PaymentResponse> payments
) {
}

