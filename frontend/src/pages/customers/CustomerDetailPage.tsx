import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import BadgeIcon from "@mui/icons-material/Badge";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusChip from "../../components/common/StatusChip";
import { customerService } from "../../services/customerService";

function InfoRow({ label, value, icon }: { label: string; value?: string; icon?: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "flex-start" }}>
      {icon && <Box sx={{ color: "text.secondary", mt: 0.2 }}>{icon}</Box>}
      <Box>
        <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing="0.05em" fontWeight={600}>
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={500} sx={{ mt: 0.2 }}>
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  );
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customerId = Number(id);

  const { data: customer, isLoading: loadingCustomer } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => customerService.getById(customerId).then((r) => r.data),
    enabled: !!customerId,
  });

  const { data: loans = [], isLoading: loadingLoans } = useQuery({
    queryKey: ["customer-loans", customerId],
    queryFn: () => customerService.getLoans(customerId).then((r) => r.data as any[]),
    enabled: !!customerId,
  });

  if (loadingCustomer) return <LoadingSpinner message="Loading customer…" />;
  if (!customer) return <Box sx={{ p: 3 }}>Customer not found.</Box>;

  return (
    <Box>
      <PageHeader
        title={customer.name}
        crumbs={[{ label: "Customers", to: "/customers" }, { label: customer.name }]}
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/customers")}
            >
              Back
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/customers/${id}/edit`)}
              data-testid="button-edit-customer"
            >
              Edit
            </Button>
          </Box>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>Customer Details</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <InfoRow label="Full Name" value={customer.name} icon={<PersonIcon fontSize="small" />} />
              <InfoRow label="Phone Number" value={customer.phoneNumber} icon={<PhoneIcon fontSize="small" />} />
              {customer.alternativePhone && (
                <InfoRow label="Alternative Phone" value={customer.alternativePhone} icon={<PhoneIcon fontSize="small" />} />
              )}
              <InfoRow label="Government ID" value={customer.governmentIdNumber} icon={<BadgeIcon fontSize="small" />} />
              <InfoRow label="Address" value={customer.address} icon={<HomeIcon fontSize="small" />} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccountBalanceWalletIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>Loans</Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate("/loans/new")}
                  data-testid="button-new-loan-from-customer"
                >
                  New Loan
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {loadingLoans ? (
                <LoadingSpinner minHeight={120} />
              ) : loans.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                  <Typography color="text.secondary" variant="body2">No loans found for this customer</Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {loans.map((loan: any) => (
                    <Box
                      key={loan.id}
                      onClick={() => navigate(`/loans/${loan.id}`)}
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        cursor: "pointer",
                        "&:hover": { bgcolor: "#F0F4FF", borderColor: "primary.main" },
                      }}
                      data-testid={`loan-card-${loan.id}`}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {loan.loanNumber ?? `Loan #${loan.id}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ₹{Number(loan.principalAmount).toLocaleString("en-IN")}
                          </Typography>
                        </Box>
                        <StatusChip status={loan.status} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
