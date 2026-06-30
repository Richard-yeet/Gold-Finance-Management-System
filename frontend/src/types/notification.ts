export type NotificationType =
  | "LOAN_CREATED"
  | "LOAN_STATUS_CHANGED"
  | "LOAN_RENEWED"
  | "LOAN_CLOSED"
  | "LOAN_OVERDUE"
  | "LOAN_DEFAULTED"
  | "PAYMENT_RECEIVED"
  | "PAYMENT_OVERDUE"
  | "CUSTOMER_CREATED"
  | "CUSTOMER_UPDATED"
  | "BANK_LOAN_CREATED"
  | "BANK_LOAN_RENEWAL_DUE"
  | "BANK_LOAN_EXPIRED"
  | "SYSTEM_ALERT";

export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  description: string | null;
  read: boolean;
  referenceEntityType: string | null;
  referenceEntityId: number | null;
  referenceUrl: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface NotificationPayload {
  id?: number;
  type?: NotificationType;
  title?: string;
  description?: string | null;
  read?: boolean;
  referenceEntityType?: string | null;
  referenceEntityId?: number | null;
  referenceUrl?: string | null;
  unreadCount?: number;
  createdAt?: string;
  action?: "CREATE" | "READ" | "READ_ALL";
}

export interface NotificationPageData {
  content: NotificationItem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}