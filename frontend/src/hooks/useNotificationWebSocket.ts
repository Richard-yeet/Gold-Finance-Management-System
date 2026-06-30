import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Client, type IMessage } from "@stomp/stompjs";
import { useAuth } from "../context/AuthContext";
import type { NotificationPayload } from "../types/notification";

// Raw WebSocket (no SockJS) — endpoint path matches backend's registerStompEndpoints exactly
const WS_BASE = "ws://localhost:8053/ws/notifications";
const TOPIC = "/topic/notifications";

export function useNotificationWebSocket() {
  const { isAuthenticated } = useAuth();
  const qc = useQueryClient();
  const stompRef = useRef<Client | null>(null);

  const handleMessage = useCallback(
    (message: IMessage) => {
      try {
        const payload: NotificationPayload = JSON.parse(message.body);

        // Invalidate all notification queries so React Query refetches
        qc.invalidateQueries({ queryKey: ["notifications"] });

        // Also do an immediate optimistic update for the unread count
        if (payload.unreadCount !== undefined) {
          qc.setQueryData(["notifications", "unread-count"], payload.unreadCount);
        }
      } catch {
        // Silently ignore parse errors
      }
    },
    [qc],
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem("gf_token");
    if (!token) return;

    const client = new Client({
      brokerURL: `${WS_BASE}?token=${encodeURIComponent(token)}`,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        client.subscribe(TOPIC, handleMessage);
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"], frame.body);
      },
      onWebSocketError: (evt) => {
        console.warn("WebSocket connection error — will auto-retry", evt);
      },
      onWebSocketClose: (evt) => {
        if (!evt.wasClean) {
          console.warn("WebSocket closed unexpectedly, STOMP will auto-reconnect");
        }
      },
    });

    client.activate();
    stompRef.current = client;

    return () => {
      if (stompRef.current?.active) {
        stompRef.current.deactivate();
      }
      stompRef.current = null;
    };
  }, [isAuthenticated, handleMessage]);
}
