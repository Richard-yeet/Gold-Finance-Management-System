package com.goldfinance.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "jewellery_photos")
public class JewelleryPhoto extends BaseAuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "jewellery_item_id", nullable = false)
    private JewelleryItem jewelleryItem;

    @Column(nullable = false, length = 500)
    private String path;

    @Column(nullable = false, length = 160)
    private String originalFileName;

    @Column(nullable = false, length = 80)
    private String contentType;
}

