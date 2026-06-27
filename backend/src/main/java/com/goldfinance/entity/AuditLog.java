package com.goldfinance.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "audit_logs")
public class AuditLog extends BaseAuditableEntity {

    @Column(nullable = false, length = 80)
    private String action;

    @Column(nullable = false, length = 120)
    private String entityName;

    @Column(length = 80)
    private String entityId;

    @Column(nullable = false, length = 2000)
    private String details;
}

