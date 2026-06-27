package com.goldfinance.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "customers")
public class Customer extends BaseAuditableEntity {

    @Column(nullable = false, unique = true, length = 40)
    private String customerCode;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false, length = 20)
    private String phoneNumber;

    @Column(length = 20)
    private String alternativePhone;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(nullable = false, length = 80)
    private String governmentIdNumber;

    @Builder.Default
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Loan> loans = new ArrayList<>();
}

