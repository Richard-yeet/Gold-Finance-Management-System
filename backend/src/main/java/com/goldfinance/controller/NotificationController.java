package com.goldfinance.controller;

import com.goldfinance.dto.ApiResponse;
import com.goldfinance.dto.NotificationResponse;
import com.goldfinance.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/unread-count")
    public ApiResponse<Long> getUnreadCount() {
        return ApiResponse.ok("Unread count fetched", notificationService.getUnreadCount());
    }

    @GetMapping("/latest")
    public ApiResponse<List<NotificationResponse>> getLatestNotifications(@RequestParam(defaultValue = "5") int limit) {
        return ApiResponse.ok("Latest notifications fetched", notificationService.getLatestNotifications(limit));
    }

    @GetMapping
    public ApiResponse<Page<NotificationResponse>> getAllNotifications(@PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.ok("Notifications fetched", notificationService.getAllNotifications(pageable));
    }

    @PostMapping("/{id}/read")
    public ApiResponse<NotificationResponse> markAsRead(@PathVariable Long id) {
        return ApiResponse.ok("Notification marked as read", notificationService.markAsRead(id));
    }

    @PostMapping("/read-all")
    public ApiResponse<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return ApiResponse.ok("All notifications marked as read", null);
    }
}