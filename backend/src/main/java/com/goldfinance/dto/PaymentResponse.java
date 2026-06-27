package com.goldfinance.dto;

import com.goldfinance.entity.PaymentType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PaymentResponse(
        Long id,
        Long loanId,
        String loanNumber,
        String receiptNumber,
        PaymentType paymentType,
        BigDecimal amount,
        BigDecimal principalComponent,
        BigDecimal interestComponent,
        LocalDate paymentDate,
        String notes
) {
}

