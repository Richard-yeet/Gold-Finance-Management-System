package com.goldfinance.service;

import com.goldfinance.dto.NotificationPayload;
import com.goldfinance.entity.NotificationType;
import com.goldfinance.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationWebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;

    public void sendNotificationToAll(NotificationPayload payload) {
        try {
            messagingTemplate.convertAndSend("/topic/notifications", payload);
            log.debug("Sent WebSocket notification to /topic/notifications: {}", payload);
        } catch (Exception e) {
            log.error("Error sending WebSocket notification: {}", e.getMessage(), e);
        }
    }

    public void notifyNewNotification(com.goldfinance.entity.Notification notification) {
        long unreadCount = notificationRepository.countByReadFalse() + 1;
        NotificationPayload payload = NotificationPayload.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .description(notification.getDescription())
                .read(notification.getRead())
                .referenceEntityType(notification.getReferenceEntityType())
                .referenceEntityId(notification.getReferenceEntityId())
                .referenceUrl(notification.getReferenceUrl())
                .unreadCount(unreadCount)
                .createdAt(notification.getCreatedAt())
                .action("CREATE")
                .build();
        sendNotificationToAll(payload);
    }

    public void notifyReadNotification(Long notificationId, long newUnreadCount) {
        NotificationPayload payload = NotificationPayload.builder()
                .id(notificationId)
                .read(true)
                .unreadCount(newUnreadCount)
                .action("READ")
                .build();
        sendNotificationToAll(payload);
    }

    public void notifyReadAll(long newUnreadCount) {
        NotificationPayload payload = NotificationPayload.builder()
                .read(true)
                .unreadCount(newUnreadCount)
                .action("READ_ALL")
                .build();
        sendNotificationToAll(payload);
    }
}