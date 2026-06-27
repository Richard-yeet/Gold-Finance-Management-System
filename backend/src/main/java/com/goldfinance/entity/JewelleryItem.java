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
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "jewellery_items")
public class JewelleryItem extends BaseAuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "loan_id", nullable = false)
    private Loan loan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private JewelleryItemType itemType;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal weightGrams;

    @Column(nullable = false, length = 40)
    private String estimatedPurity;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal estimatedValue;

    @Column(nullable = false, length = 80)
    private String lockerNumber;

    @Column(length = 1000)
    private String remarks;

    @Builder.Default
    @OneToMany(mappedBy = "jewelleryItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JewelleryPhoto> photos = new ArrayList<>();

    public void addPhoto(JewelleryPhoto photo) {
        photos.add(photo);
        photo.setJewelleryItem(this);
    }
}

