package com.goldfinance.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "loans")
public class Loan extends BaseAuditableEntity {

    @Column(nullable = false, unique = true, length = 40)
    private String loanNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal principalAmount;

    @Column(nullable = false, precision = 8, scale = 4)
    private BigDecimal interestRate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private InterestType interestType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private InterestPaymentFrequency interestPaymentFrequency;

    @Column(nullable = false)
    private LocalDate loanDate;

    private LocalDate closedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private LoanStatus status;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal outstandingPrincipal;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal outstandingInterest;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal outstandingAmount;

    @Column(length = 1000)
    private String notes;

    @Builder.Default
    @OneToMany(mappedBy = "loan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JewelleryItem> jewelleryItems = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "loan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments = new ArrayList<>();

    public void addJewelleryItem(JewelleryItem item) {
        jewelleryItems.add(item);
        item.setLoan(this);
    }

    public void addPayment(Payment payment) {
        payments.add(payment);
        payment.setLoan(this);
    }
}

