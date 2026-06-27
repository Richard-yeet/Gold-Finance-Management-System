import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { reportService } from "../../services/reportService";
import { useSnackbar } from "../../context/SnackbarContext";
import dayjs from "dayjs";

export default function ReportsPage() {
  const { showError, showSuccess } = useSnackbar();
  const [from, setFrom] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [to, setTo] = useState(dayjs().format("YYYY-MM-DD"));
  const [exporting, setExporting] = useState(false);

  const { data: summary, isLoading } = useQuery({
    queryKey: ["report-summary", from, to],
    queryFn: () => reportService.getSummary(from, to).then((r) => r.data),
    enabled: !!from && !!to,
  });

  const handleExport = async (format: "csv" | "pdf") => {
    setExporting(true);
    try {
      const res = await reportService.exportCollections(format, from, to);
      const blob = new Blob([res.data], { type: format === "pdf" ? "application/pdf" : "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `collections-${from}-to-${to}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      showSuccess(`Report exported as ${format.toUpperCase()}`);
    } catch {
      showError("Failed to export report");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Box>
      <PageHeader title="Reports" subtitle="Financial overview and data exports" crumbs={[{ label: "Reports" }]} />

      {/* Date range */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end", flexWrap: "wrap" }}>
          <TextField
            label="From Date" type="date" value={from}
            onChange={(e) => setFrom(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            size="small"
          />
          <TextField
            label="To Date" type="date" value={to}
            onChange={(e) => setTo(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            size="small"
          />
        </Box>
      </Card>

      {isLoading ? <LoadingSpinner message="Loading summary…" /> : (
        <>
          {/* Summary cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard title="Active Loans" value={summary?.activeLoans ?? "—"} icon={<AccountBalanceWalletIcon />} color="#1565C0" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard title="Closed Loans" value={summary?.closedLoans ?? "—"} icon={<AccountBalanceWalletIcon />} color="#2E7D32" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard title="Total Collections" value={`₹${Number(summary?.totalCollections ?? 0).toLocaleString("en-IN")}`} icon={<TrendingUpIcon />} color="#F57F17" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard title="Interest Collected" value={`₹${Number(summary?.interestCollected ?? 0).toLocaleString("en-IN")}`} icon={<AccountBalanceIcon />} color="#4527A0" />
            </Grid>
          </Grid>

          {/* Date period shown */}
          {summary && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Report period: <strong>{dayjs(summary.fromDate).format("DD MMM YYYY")}</strong> to <strong>{dayjs(summary.toDate).format("DD MMM YYYY")}</strong> · Bank loans: {summary.bankLoans}
            </Alert>
          )}
        </>
      )}

      {/* Export section */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>Export Collections</Typography>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained" color="success" startIcon={<TableChartIcon />}
              onClick={() => handleExport("csv")} disabled={exporting}
            >
              {exporting ? "Exporting…" : "Export CSV"}
            </Button>
            <Button
              variant="contained" color="error" startIcon={<PictureAsPdfIcon />}
              onClick={() => handleExport("pdf")} disabled={exporting}
            >
              {exporting ? "Exporting…" : "Export PDF"}
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
            Exports all collections for the selected date range above.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
