package com.goldfinance.service;

import com.goldfinance.dto.NotificationResponse;
import com.goldfinance.entity.Notification;
import com.goldfinance.entity.NotificationType;
import com.goldfinance.mapper.NotificationMapper;
import com.goldfinance.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final NotificationWebSocketService notificationWebSocketService;

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        return notificationRepository.countByReadFalse();
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getLatestNotifications(int limit) {
        return notificationRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .limit(limit)
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getAllNotifications(Pageable pageable) {
        return notificationRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(notificationMapper::toResponse);
    }

    @Transactional
    public NotificationResponse markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new com.goldfinance.exception.ResourceNotFoundException("Notification not found with id: " + id));
        notification.setRead(true);
        notification.setUpdatedAt(Instant.now());
        notification.setUpdatedBy("system");
        NotificationResponse response = notificationMapper.toResponse(notificationRepository.save(notification));
        notificationWebSocketService.notifyReadNotification(id, notificationRepository.countByReadFalse());
        return response;
    }

    @Transactional
    public void markAllAsRead() {
        List<Notification> unread = notificationRepository.findAllByReadFalse();
        unread.forEach(n -> {
            n.setRead(true);
            n.setUpdatedAt(Instant.now());
            n.setUpdatedBy("system");
        });
        notificationRepository.saveAll(unread);
        notificationWebSocketService.notifyReadAll(0);
    }

    @Transactional
    public NotificationResponse createNotification(NotificationType type, String title, String description,
                                                    String referenceEntityType, Long referenceEntityId, String referenceUrl) {
        Notification notification = Notification.builder()
                .type(type)
                .title(title)
                .description(description)
                .read(false)
                .referenceEntityType(referenceEntityType)
                .referenceEntityId(referenceEntityId)
                .referenceUrl(referenceUrl)
                .createdBy("system")
                .updatedBy("system")
                .build();
        Notification saved = notificationRepository.save(notification);
        NotificationResponse response = notificationMapper.toResponse(saved);
        notificationWebSocketService.notifyNewNotification(saved);
        return response;
    }
}