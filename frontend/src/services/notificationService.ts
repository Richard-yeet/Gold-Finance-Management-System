import axiosInstance from "../api/axiosInstance";
import type { NotificationItem, NotificationPageData } from "../types/notification";

export const notificationService = {
  getUnreadCount: () =>
    axiosInstance.get<number>("/notifications/unread-count"),

  getLatest: (limit = 5) =>
    axiosInstance.get<NotificationItem[]>("/notifications/latest", {
      params: { limit },
    }),

  getAll: (page = 0, size = 20) =>
    // Use a custom header so the interceptor knows to preserve pagination metadata
    axiosInstance.get<NotificationPageData>("/notifications", {
      params: { page, size },
      headers: { "X-Preserve-Page": "true" },
    }),

  markAsRead: (id: number) =>
    axiosInstance.post<NotificationItem>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    axiosInstance.post("/notifications/read-all"),
};
