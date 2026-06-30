import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import LoanIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentIcon from "@mui/icons-material/ReceiptLong";
import CustomerIcon from "@mui/icons-material/People";
import BankLoanIcon from "@mui/icons-material/AccountBalance";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleIcon from "@mui/icons-material/Circle";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PageHeader from "../../components/common/PageHeader";
import {
  useAllNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useUnreadCount,
} from "../../hooks/useNotifications";
import type { NotificationItem, NotificationType } from "../../types/notification";

dayjs.extend(relativeTime);

const typeIconMap: Record<NotificationType, React.ReactNode> = {
  LOAN_CREATED: <LoanIcon color="primary" fontSize="small" />,
  LOAN_STATUS_CHANGED: <LoanIcon color="warning" fontSize="small" />,
  LOAN_RENEWED: <LoanIcon color="info" fontSize="small" />,
  LOAN_CLOSED: <CheckCircleIcon color="success" fontSize="small" />,
  LOAN_OVERDUE: <WarningIcon color="error" fontSize="small" />,
  LOAN_DEFAULTED: <ErrorOutlineIcon color="error" fontSize="small" />,
  PAYMENT_RECEIVED: <PaymentIcon color="success" fontSize="small" />,
  PAYMENT_OVERDUE: <WarningIcon color="warning" fontSize="small" />,
  BANK_LOAN_RENEWAL_DUE: <BankLoanIcon color="warning" fontSize="small" />,
  BANK_LOAN_EXPIRED: <BankLoanIcon color="error" fontSize="small" />,
  CUSTOMER_CREATED: <CustomerIcon color="primary" fontSize="small" />,
  CUSTOMER_UPDATED: <CustomerIcon color="info" fontSize="small" />,
  BANK_LOAN_CREATED: <BankLoanIcon color="primary" fontSize="small" />,
  SYSTEM_ALERT: <ErrorOutlineIcon color="error" fontSize="small" />,
};

function getEntityLink(n: NotificationItem): string | null {
  if (n.referenceUrl) return n.referenceUrl;
  const type = n.referenceEntityType;
  const id = n.referenceEntityId;
  if (!type || !id) return null;
  const map: Record<string, string> = {
    Loan: `/loans/${id}`,
    Customer: `/customers/${id}`,
    BankLoan: `/bank-loans/${id}`,
    Payment: `/payments/${id}/receipt`,
  };
  return map[type] ?? null;
}

const PAGE_SIZE = 20;

export default function NotificationPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: pageData, isLoading, isError } = useAllNotifications(page, PAGE_SIZE);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications: NotificationItem[] = pageData?.content ?? [];
  const totalPages = pageData?.totalPages ?? 1;

  const handleClick = (n: NotificationItem) => {
    if (!n.read) markAsRead.mutate(n.id);
    const link = getEntityLink(n);
    if (link) navigate(link);
  };

  return (
    <Box>
      <PageHeader title="Notifications" subtitle="All your system notifications" />

      {unreadCount > 0 && (
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <Chip label={`${unreadCount} unread`} color="error" size="small" />
          <Button
            size="small"
            variant="outlined"
            startIcon={<DoneAllIcon />}
            onClick={() => markAllAsRead.mutate(undefined)}
            disabled={markAllAsRead.isPending}
            sx={{ textTransform: "none" }}
          >
            Mark All as Read
          </Button>
        </Box>
      )}

      <Card sx={{ borderRadius: 2 }}>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <ErrorOutlineIcon sx={{ fontSize: 48, color: "error.main", mb: 1 }} />
            <Typography color="error">Failed to load notifications</Typography>
          </Box>
        )}

        {!isLoading && !isError && notifications.length === 0 && (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <NotificationsOffIcon sx={{ fontSize: 64, color: "text.disabled", mb: 1 }} />
            <Typography color="text.secondary">No notifications yet</Typography>
          </Box>
        )}

        {!isLoading && !isError && notifications.length > 0 && (
          <>
            <List disablePadding>
              {notifications.map((n, i) => (
                <ListItemButton
                  key={n.id}
                  onClick={() => handleClick(n)}
                  sx={{
                    py: 2,
                    px: 3,
                    borderBottom: i < notifications.length - 1 ? "1px solid" : "none",
                    borderColor: "divider",
                    bgcolor: n.read ? "transparent" : "action.hover",
                    "&:hover": { bgcolor: "action.selected" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {typeIconMap[n.type] ?? <InfoIcon fontSize="small" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body1" fontWeight={n.read ? 400 : 600} sx={{ flex: 1 }}>
                          {n.title}
                        </Typography>
                        {!n.read && (
                          <CircleIcon sx={{ fontSize: 10, color: "primary.main" }} />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ display: "block" }}>
                        {n.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {n.description}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.disabled">
                          {dayjs(n.createdAt).format("MMM D, YYYY h:mm A")} · {dayjs(n.createdAt).fromNow()}
                        </Typography>
                      </Box>
                    }
                    secondaryTypographyProps={{ component: "div" }}
                  />
                </ListItemButton>
              ))}
            </List>

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={(_, p) => setPage(p - 1)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}
          </>
        )}
      </Card>
    </Box>
  );
}
