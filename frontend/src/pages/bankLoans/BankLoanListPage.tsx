import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PageHeader from "../../components/common/PageHeader";
import StatusChip from "../../components/common/StatusChip";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { bankLoanService, type BankLoan } from "../../services/bankLoanService";
import dayjs from "dayjs";

export default function BankLoanListPage() {
  const navigate = useNavigate();

  const { data: loans = [], isLoading } = useQuery({
    queryKey: ["bank-loans"],
    queryFn: () => bankLoanService.getAll().then((r) => r.data),
  });

  const { data: renewals = [] } = useQuery({
    queryKey: ["bank-loan-renewals"],
    queryFn: () => bankLoanService.getRenewals(30).then((r) => r.data),
  });

  const columns: GridColDef<BankLoan>[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "bankName", headerName: "Bank", flex: 1, minWidth: 160,
      renderCell: (p) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountBalanceIcon fontSize="small" color="primary" />
          <Typography variant="body2" fontWeight={600}>{p.value}</Typography>
        </Box>
      ),
    },
    { field: "branch", headerName: "Branch", width: 130 },
    { field: "loanNumber", headerName: "Loan Number", width: 150 },
    { field: "loanAmount", headerName: "Amount", width: 150, renderCell: (p) => `₹${Number(p.value).toLocaleString("en-IN")}` },
    { field: "interestRate", headerName: "Rate %", width: 90, renderCell: (p) => `${p.value}%` },
    { field: "renewalDate", headerName: "Renewal Date", width: 130, renderCell: (p) => dayjs(p.value).format("DD MMM YYYY") },
    {
      field: "daysUntilRenewal", headerName: "Days Left", width: 110,
      renderCell: (p) => {
        const days = p.value as number;
        const color = days <= 7 ? "error" : days <= 30 ? "warning" : "success";
        return <Chip label={`${days}d`} color={color} size="small" />;
      },
    },
    {
      field: "status", headerName: "Status", width: 100,
      renderCell: (p) => <StatusChip status={p.value} />,
    },
    {
      field: "actions", headerName: "Actions", width: 100, sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton size="small" onClick={() => navigate(`/bank-loans/${params.row.id}`)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => navigate(`/bank-loans/${params.row.id}/edit`)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner message="Loading bank loans…" />;

  return (
    <Box>
      <PageHeader
        title="Bank Loans"
        subtitle="Manage bank borrowings and renewal schedules"
        crumbs={[{ label: "Bank Loans" }]}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/bank-loans/new")}>
            Add Bank Loan
          </Button>
        }
      />

      {renewals.length > 0 && (
        <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 3, borderRadius: 2 }}>
          <strong>{renewals.length} bank loan{renewals.length > 1 ? "s" : ""}</strong> due for renewal within 30 days.
        </Alert>
      )}

      {renewals.length > 0 && (
        <Card sx={{ mb: 3, border: "1px solid", borderColor: "warning.light" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Renewals Due Soon</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {renewals.slice(0, 6).map((loan) => (
                <Grid key={loan.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box
                    onClick={() => navigate(`/bank-loans/${loan.id}`)}
                    sx={{ p: 2, border: "1px solid", borderColor: "warning.main", borderRadius: 2, cursor: "pointer", "&:hover": { bgcolor: "#FFF8E1" } }}
                  >
                    <Typography variant="body2" fontWeight={700}>{loan.bankName}</Typography>
                    <Typography variant="caption" color="text.secondary">{loan.branch} · {loan.loanNumber}</Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                      <Typography variant="body2">₹{Number(loan.loanAmount).toLocaleString("en-IN")}</Typography>
                      <Chip label={`${loan.daysUntilRenewal}d left`} color="warning" size="small" />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      <Card>
        <DataGrid
          rows={loans}
          columns={columns}
          autoHeight
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          sx={{ border: "none", "& .MuiDataGrid-columnHeaders": { bgcolor: "#F4F6F8" }, "& .MuiDataGrid-row:hover": { bgcolor: "#F0F4FF" } }}
        />
      </Card>
    </Box>
  );
}
