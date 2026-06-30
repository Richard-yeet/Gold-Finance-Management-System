import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
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
  useLatestNotifications,
  useMarkAsRead,
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

export default function DashboardNotificationWidget() {
  const navigate = useNavigate();
  const { data: notifications, isLoading, isError } = useLatestNotifications(5);
  const markAsRead = useMarkAsRead();

  const handleClick = (n: NotificationItem) => {
    if (!n.read) markAsRead.mutate(n.id);
    const link = getEntityLink(n);
    if (link) navigate(link);
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <NotificationsActiveIcon color="warning" />
          <Typography variant="h6" fontWeight={700}>Notifications</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        )}

        {isError && (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <ErrorOutlineIcon sx={{ fontSize: 48, color: "error.main", mb: 1 }} />
            <Typography color="error" variant="body2">Failed to load notifications</Typography>
          </Box>
        )}

        {!isLoading && !isError && (!notifications || notifications.length === 0) && (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <NotificationsOffIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography color="text.secondary" variant="body2">No notifications</Typography>
          </Box>
        )}

        {!isLoading && !isError && notifications && notifications.length > 0 && (
          <List disablePadding>
            {notifications.map((n, i) => (
              <ListItemButton
                key={n.id}
                onClick={() => handleClick(n)}
                sx={{
                  py: 1.5,
                  borderBottom: i < notifications.length - 1 ? "1px solid" : "none",
                  borderColor: "divider",
                  bgcolor: n.read ? "transparent" : "action.hover",
                  borderRadius: 1,
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
                  secondary={dayjs(n.createdAt).fromNow()}
                  secondaryTypographyProps={{ variant: "caption", color: "text.disabled" }}
                />
              </ListItemButton>
            ))}
          </List>
        )}

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            size="small"
            onClick={() => navigate("/notifications")}
            sx={{ textTransform: "none" }}
          >
            View All
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}