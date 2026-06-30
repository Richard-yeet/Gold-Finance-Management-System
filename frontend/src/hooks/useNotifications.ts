import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notificationService";
import type { NotificationItem, NotificationPageData } from "../types/notification";

const NOTIFICATION_KEYS = {
  unreadCount: ["notifications", "unread-count"] as const,
  latest: ["notifications", "latest"] as const,
  all: (page: number, size: number) =>
    ["notifications", "all", page, size] as const,
};

export function useUnreadCount() {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.unreadCount,
    queryFn: () =>
      notificationService.getUnreadCount().then((r) => r.data),
    refetchInterval: 30000,
  });
}

export function useLatestNotifications(limit = 5) {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.latest,
    queryFn: async () => {
      const res = await notificationService.getLatest(limit);
      return res.data as NotificationItem[];
    },
    refetchInterval: 30000,
  });
}

export function useAllNotifications(page = 0, size = 20) {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.all(page, size),
    queryFn: async () => {
      const res = await notificationService.getAll(page, size);
      return res.data as NotificationPageData;
    },
  });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export { NOTIFICATION_KEYS };
