import { useQuery } from "@tanstack/react-query";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TodayIcon from "@mui/icons-material/Today";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { dashboardService } from "../../services/dashboardService";
import dayjs from "dayjs";

function fmt(val?: number) {
  if (val == null) return "₹0";
  return `₹${Number(val).toLocaleString("en-IN")}`;
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.getData().then((r) => r.data),
    refetchInterval: 60000,
  });

  if (isLoading) return <LoadingSpinner message="Loading dashboard…" />;

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle={`Overview as of ${dayjs().format("MMMM D, YYYY")}`}
      />

      {isError && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          Could not connect to the server. Check your Spring Boot backend is running on port 8053.
        </Alert>
      )}

      {/* Primary stat cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Active Loans" value={data?.totalActiveLoans ?? "—"} icon={<AccountBalanceWalletIcon />} color="#1565C0" subtitle={`${data?.loansOverdue ?? 0} overdue`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Total Customers" value={data?.totalCustomers ?? "—"} icon={<PeopleIcon />} color="#2E7D32" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Total Receivable" value={fmt(data?.totalAmountReceivable)} icon={<TrendingUpIcon />} color="#F57F17" subtitle="Principal + Interest" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Today's Collections" value={fmt(data?.todaysCollections)} icon={<TodayIcon />} color="#2E7D32" />
        </Grid>
      </Grid>

      {/* Secondary stat cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Outstanding Principal" value={fmt(data?.totalOutstandingPrincipal)} icon={<TrendingUpIcon />} color="#1565C0" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Outstanding Interest" value={fmt(data?.totalOutstandingInterest)} icon={<TrendingUpIcon />} color="#C62828" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Due This Week" value={data?.loansDueThisWeek ?? "—"} icon={<WarningAmberIcon />} color="#E65100" subtitle="Loans due in 7 days" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Bank Renewals" value={data?.bankLoansNearingRenewal ?? "—"} icon={<AccountBalanceIcon />} color="#4527A0" subtitle="Nearing renewal" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Transactions */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <ReceiptLongIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>Recent Transactions</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {data?.recentTransactions && data.recentTransactions.length > 0 ? (
                <List disablePadding>
                  {data.recentTransactions.map((tx, i) => (
                    <ListItem
                      key={tx.id}
                      disablePadding
                      sx={{ py: 1.5, borderBottom: i < data.recentTransactions.length - 1 ? "1px solid" : "none", borderColor: "divider" }}
                    >
                      <ListItemText
                        primary={`${tx.loanNumber ?? `Loan #${tx.loanId}`} — ${tx.paymentType.replace(/_/g, " ")}`}
                        secondary={`${dayjs(tx.paymentDate).format("MMM D, YYYY")}${tx.receiptNumber ? ` · ${tx.receiptNumber}` : ""}`}
                        primaryTypographyProps={{ fontWeight: 500, fontSize: "0.875rem" }}
                        secondaryTypographyProps={{ fontSize: "0.78rem" }}
                      />
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" fontWeight={700} color="success.main">
                          {fmt(tx.amount)}
                        </Typography>
                        <Chip label={tx.paymentType.replace(/_/g, " ")} size="small" sx={{ fontSize: "0.68rem", height: 18, mt: 0.5 }} />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <ReceiptLongIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                  <Typography color="text.secondary" variant="body2">No recent transactions</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <NotificationsActiveIcon color="warning" />
                <Typography variant="h6" fontWeight={700}>Notifications</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {data?.notifications && data.notifications.length > 0 ? (
                <List disablePadding>
                  {data.notifications.map((msg, i) => (
                    <ListItem
                      key={i}
                      disablePadding
                      sx={{ py: 1.5, borderBottom: i < data.notifications.length - 1 ? "1px solid" : "none", borderColor: "divider" }}
                    >
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "warning.main", mr: 1.5, flexShrink: 0, mt: 0.5 }} />
                      <Typography variant="body2">{msg}</Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <NotificationsActiveIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                  <Typography color="text.secondary" variant="body2">No notifications</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
