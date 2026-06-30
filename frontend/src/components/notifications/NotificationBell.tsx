import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LoanIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentIcon from "@mui/icons-material/ReceiptLong";
import CustomerIcon from "@mui/icons-material/People";
import BankLoanIcon from "@mui/icons-material/AccountBalance";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleIcon from "@mui/icons-material/Circle";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  useUnreadCount,
  useLatestNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
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

function getEntityLink(notification: NotificationItem): string | null {
  if (notification.referenceUrl) return notification.referenceUrl;
  const type = notification.referenceEntityType;
  const id = notification.referenceEntityId;
  if (!type || !id) return null;
  const map: Record<string, string> = {
    Loan: `/loans/${id}`,
    Customer: `/customers/${id}`,
    BankLoan: `/bank-loans/${id}`,
    Payment: `/payments/${id}/receipt`,
  };
  return map[type] ?? null;
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);

  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: notifications, isLoading, isError } = useLatestNotifications(5);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const handleToggle = () => setOpen((v) => !v);
  const handleClose = () => setOpen(false);

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.read) {
      markAsRead.mutate(notification.id);
    }
    const link = getEntityLink(notification);
    if (link) {
      navigate(link);
    }
    handleClose();
  };

  const handleMarkAllRead = () => {
    markAllAsRead.mutate(undefined);
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          ref={bellRef}
          color="inherit"
          onClick={handleToggle}
          data-testid="button-notifications"
          aria-label={`${unreadCount} unread notifications`}
        >
          <Badge badgeContent={unreadCount > 99 ? "99+" : unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={bellRef.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              width: 380,
              maxHeight: 480,
              display: "flex",
              flexDirection: "column",
              mt: 1,
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            },
          },
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllRead}
              disabled={markAllAsRead.isPending}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Mark all as read
            </Button>
          )}
        </Box>
        <Divider />

        {/* Body */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={28} />
            </Box>
          )}

          {isError && (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <ErrorOutlineIcon sx={{ fontSize: 40, color: "error.main", mb: 1 }} />
              <Typography variant="body2" color="error">
                Failed to load notifications
              </Typography>
            </Box>
          )}

          {!isLoading && !isError && (!notifications || notifications.length === 0) && (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <NotificationsOffIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No notifications yet
              </Typography>
            </Box>
          )}

          {!isLoading && !isError && notifications && notifications.length > 0 && (
            <List disablePadding>
              {notifications.map((n) => (
                <ListItemButton
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    bgcolor: n.read ? "transparent" : "action.hover",
                    "&:hover": { bgcolor: "action.selected" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {typeIconMap[n.type] ?? <InfoIcon fontSize="small" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Typography
                          variant="body2"
                          fontWeight={n.read ? 400 : 600}
                          sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        >
                          {n.title}
                        </Typography>
                        {!n.read && (
                          <CircleIcon sx={{ fontSize: 8, color: "primary.main", flexShrink: 0 }} />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        {n.description && (
                          <Typography variant="caption" color="text.secondary" display="block" noWrap>
                            {n.description}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.disabled">
                          {dayjs(n.createdAt).fromNow()}
                        </Typography>
                      </>
                    }
                    secondaryTypographyProps={{ component: "div" }}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>

        <Divider />
        {/* Footer */}
        <Box sx={{ px: 2, py: 1, textAlign: "center" }}>
          <Button
            size="small"
            fullWidth
            onClick={() => {
              handleClose();
              navigate("/notifications");
            }}
            sx={{ textTransform: "none" }}
          >
            View All Notifications
          </Button>
        </Box>
      </Popover>
    </>
  );
}
