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

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "app_users")
public class AppUser extends BaseAuditableEntity {

    @Column(nullable = false, unique = true, length = 80)
    private String username;

    @Column(nullable = false, name = "password_hash")
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private UserRole role;

    @Builder.Default
    @Column(nullable = false)
    private boolean enabled = true;
}

