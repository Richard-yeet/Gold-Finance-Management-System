package com.goldfinance.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bank_loans")
public class BankLoan extends BaseAuditableEntity {

    @Column(nullable = false, length = 160)
    private String bankName;

    @Column(nullable = false, length = 160)
    private String branch;

    @Column(nullable = false, unique = true, length = 80)
    private String loanNumber;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal loanAmount;

    @Column(nullable = false, precision = 8, scale = 4)
    private BigDecimal interestRate;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate renewalDate;

    @Column(nullable = false)
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private BankLoanStatus status;

    @Column(length = 1000)
    private String notes;
}

