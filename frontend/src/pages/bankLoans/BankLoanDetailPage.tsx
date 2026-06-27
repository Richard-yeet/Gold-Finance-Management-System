import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PageHeader from "../../components/common/PageHeader";
import StatusChip from "../../components/common/StatusChip";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { bankLoanService } from "../../services/bankLoanService";
import dayjs from "dayjs";

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600} letterSpacing="0.05em">{label}</Typography>
      <Typography variant="body1" fontWeight={500} sx={{ mt: 0.3 }}>{value ?? "—"}</Typography>
    </Box>
  );
}

export default function BankLoanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const loanId = Number(id);

  const { data: loan, isLoading } = useQuery({
    queryKey: ["bank-loan", loanId],
    queryFn: () => bankLoanService.getById(loanId).then((r) => r.data),
    enabled: !!loanId,
  });

  if (isLoading) return <LoadingSpinner message="Loading bank loan…" />;
  if (!loan) return <Box sx={{ p: 3 }}>Bank loan not found.</Box>;

  const days = loan.daysUntilRenewal ?? 0;
  const daysColor = days <= 7 ? "error" : days <= 30 ? "warning" : "success";

  return (
    <Box>
      <PageHeader
        title={`${loan.bankName} — ${loan.loanNumber}`}
        crumbs={[{ label: "Bank Loans", to: "/bank-loans" }, { label: loan.loanNumber }]}
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/bank-loans")}>Back</Button>
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/bank-loans/${id}/edit`)}>Edit</Button>
          </Box>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccountBalanceIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>Loan Details</Typography>
                </Box>
                <StatusChip status={loan.status} />
              </Box>
              <Divider sx={{ mb: 3 }} />
              <InfoRow label="Bank Name" value={loan.bankName} />
              <InfoRow label="Branch" value={loan.branch} />
              <InfoRow label="Loan Number" value={loan.loanNumber} />
              <InfoRow label="Loan Amount" value={`₹${Number(loan.loanAmount).toLocaleString("en-IN")}`} />
              <InfoRow label="Interest Rate" value={`${loan.interestRate}%`} />
              <InfoRow label="Start Date" value={dayjs(loan.startDate).format("DD MMMM YYYY")} />
              <InfoRow label="Renewal Date" value={dayjs(loan.renewalDate).format("DD MMMM YYYY")} />
              <InfoRow label="Expiry Date" value={dayjs(loan.expiryDate).format("DD MMMM YYYY")} />
              {loan.notes && <InfoRow label="Notes" value={loan.notes} />}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ border: "1px solid", borderColor: `${daysColor}.light`, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Renewal Status</Typography>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="h2" fontWeight={800} color={`${daysColor}.main`}>{days}</Typography>
                <Typography variant="h6" color="text.secondary" fontWeight={500}>days until renewal</Typography>
                <Chip
                  label={days <= 7 ? "Critical — Renew Immediately" : days <= 30 ? "Due Soon" : "On Track"}
                  color={daysColor}
                  sx={{ mt: 2, fontWeight: 600 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                  Renewal: {dayjs(loan.renewalDate).format("DD MMMM YYYY")} · Expiry: {dayjs(loan.expiryDate).format("DD MMMM YYYY")}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
