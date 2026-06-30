package com.goldfinance.dto;

import com.goldfinance.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPayload {
    private Long id;
    private NotificationType type;
    private String title;
    private String description;
    private Boolean read;
    private String referenceEntityType;
    private Long referenceEntityId;
    private String referenceUrl;
    private Long unreadCount;
    private Instant createdAt;
    private String action;
}