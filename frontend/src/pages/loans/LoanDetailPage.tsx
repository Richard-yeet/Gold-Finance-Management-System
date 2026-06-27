import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PaymentIcon from "@mui/icons-material/Payment";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusChip from "../../components/common/StatusChip";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import {
  loanService,
  type PaymentRequest,
  type PaymentType,
} from "../../services/loanService";
import { useSnackbar } from "../../context/SnackbarContext";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

const PAYMENT_TYPES: { value: PaymentType; label: string }[] = [
  { value: "INTEREST_ONLY", label: "Interest Only" },
  { value: "PRINCIPAL", label: "Principal" },
  { value: "FULL_SETTLEMENT", label: "Full Settlement" },
];

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600} letterSpacing="0.05em">{label}</Typography>
      <Typography variant="body1" fontWeight={500} sx={{ mt: 0.2 }}>{value ?? "—"}</Typography>
    </Box>
  );
}

export default function LoanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();
  const loanId = Number(id);
  const [tab, setTab] = useState(0);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [renewOpen, setRenewOpen] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const { data: loan, isLoading } = useQuery({
    queryKey: ["loan", loanId],
    queryFn: () => loanService.getById(loanId).then((r) => r.data),
    enabled: !!loanId,
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["payments", loanId],
    queryFn: () => loanService.getPayments(loanId).then((r) => r.data),
    enabled: !!loanId,
  });

  const paymentForm = useForm<PaymentRequest>({
    defaultValues: { amount: 0, paymentDate: dayjs().format("YYYY-MM-DD"), paymentType: "INTEREST_ONLY", notes: "" },
  });

  const paymentMutation = useMutation({
    mutationFn: (data: PaymentRequest) => loanService.recordPayment(loanId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", loanId] });
      queryClient.invalidateQueries({ queryKey: ["loan", loanId] });
      showSuccess("Payment recorded successfully");
      setPaymentOpen(false);
      paymentForm.reset();
    },
    onError: () => showError("Failed to record payment"),
  });

  const closeMutation = useMutation({
    mutationFn: () => loanService.close(loanId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["loan", loanId] }); showSuccess("Loan closed"); setCloseOpen(false); },
    onError: () => showError("Failed to close loan"),
  });

  const renewMutation = useMutation({
    mutationFn: () => loanService.renew(loanId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["loan", loanId] }); showSuccess("Loan renewed"); setRenewOpen(false); },
    onError: () => showError("Failed to renew loan"),
  });

  const photoMutation = useMutation({
    mutationFn: ({ itemId, form }: { itemId: number; form: FormData }) => loanService.uploadPhoto(itemId, form),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["loan", loanId] }); showSuccess("Photo uploaded"); },
    onError: () => showError("Failed to upload photo"),
  });

  if (isLoading) return <LoadingSpinner message="Loading loan…" />;
  if (!loan) return <Alert severity="error" sx={{ m: 3 }}>Loan not found.</Alert>;

  const isActive = loan.status === "ACTIVE";

  return (
    <Box>
      <PageHeader
        title={loan.loanNumber ?? `Loan #${loan.id}`}
        crumbs={[{ label: "Loans", to: "/loans" }, { label: loan.loanNumber ?? `Loan #${loan.id}` }]}
        action={
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/loans")}>Back</Button>
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/loans/${id}/edit`)}>Edit</Button>
            {isActive && (
              <>
                <Button variant="contained" color="success" startIcon={<PaymentIcon />} onClick={() => setPaymentOpen(true)}>Payment</Button>
                <Button variant="outlined" color="warning" startIcon={<RefreshIcon />} onClick={() => setRenewOpen(true)}>Renew</Button>
                <Button variant="outlined" color="error" startIcon={<CloseIcon />} onClick={() => setCloseOpen(true)}>Close</Button>
              </>
            )}
          </Box>
        }
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Loan details */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Loan Details</Typography>
                <StatusChip status={loan.status} />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <InfoRow label="Customer" value={loan.customerName} />
              <InfoRow label="Principal Amount" value={`₹${Number(loan.principalAmount).toLocaleString("en-IN")}`} />
              <InfoRow label="Interest Rate" value={`${loan.interestRate}%`} />
              <InfoRow label="Interest Type" value={loan.interestType?.replace(/_/g, " ")} />
              <InfoRow label="Payment Frequency" value={loan.interestPaymentFrequency} />
              <InfoRow label="Loan Date" value={loan.loanDate ? dayjs(loan.loanDate).format("DD MMM YYYY") : "—"} />
              {loan.closedDate && <InfoRow label="Closed Date" value={dayjs(loan.closedDate).format("DD MMM YYYY")} />}
              {loan.notes && <InfoRow label="Notes" value={loan.notes} />}
            </CardContent>
          </Card>
        </Grid>

        {/* Outstanding */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%", border: "1px solid", borderColor: "warning.light" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Outstanding Balance</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Outstanding Principal</Typography>
                <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>₹{Number(loan.outstandingPrincipal ?? loan.principalAmount).toLocaleString("en-IN")}</Typography>
              </Box>
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Outstanding Interest</Typography>
                <Typography variant="h5" fontWeight={700} color="error.main" sx={{ mt: 0.5 }}>₹{Number(loan.outstandingInterest ?? 0).toLocaleString("en-IN")}</Typography>
              </Box>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Total Outstanding</Typography>
                <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mt: 0.5 }}>₹{Number(loan.outstandingAmount ?? 0).toLocaleString("en-IN")}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Jewellery items */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Jewellery Items ({loan.jewelleryItems?.length ?? 0})</Typography>
              <Divider sx={{ mb: 2 }} />
              {loan.jewelleryItems && loan.jewelleryItems.length > 0 ? (
                <List disablePadding>
                  {loan.jewelleryItems.map((item) => (
                    <ListItem key={item.id} disablePadding sx={{ mb: 1.5 }}>
                      <Box sx={{ width: "100%", p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>{item.itemType} — {item.description}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.weightGrams}g · {item.estimatedPurity} · Locker: {item.lockerNumber}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                              Est. Value: ₹{Number(item.estimatedValue).toLocaleString("en-IN")}
                            </Typography>
                            {item.remarks && <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontStyle: "italic" }}>{item.remarks}</Typography>}
                          </Box>
                          <Tooltip title="Upload photos">
                            <IconButton size="small" onClick={() => { setSelectedItemId(item.id!); photoInputRef.current?.click(); }}>
                              <PhotoCameraIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        {item.photos && item.photos.length > 0 && (
                          <Typography variant="caption" color="primary.main" sx={{ mt: 0.5, display: "block" }}>
                            {item.photos.length} photo{item.photos.length > 1 ? "s" : ""}
                          </Typography>
                        )}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" variant="body2">No jewellery items recorded</Typography>
              )}
              <input ref={photoInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => {
                const files = e.target.files;
                if (!files || !selectedItemId) return;
                const fd = new FormData();
                Array.from(files).forEach((f) => fd.append("files", f));
                photoMutation.mutate({ itemId: selectedItemId, form: fd });
                e.target.value = "";
              }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: "1px solid", borderColor: "divider", px: 2 }}>
            <Tab label={`Payments (${payments.length})`} />
          </Tabs>
          <Box sx={{ p: 3 }}>
            {payments.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <PaymentIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                <Typography color="text.secondary" variant="body2">No payments recorded yet</Typography>
              </Box>
            ) : (
              <List disablePadding>
                {payments.map((p, i) => (
                  <ListItem key={p.id} disablePadding sx={{ py: 1.5, borderBottom: i < payments.length - 1 ? "1px solid" : "none", borderColor: "divider" }}>
                    <ListItemText
                      primary={`₹${Number(p.amount).toLocaleString("en-IN")} — ${p.paymentType.replace(/_/g, " ")}`}
                      secondary={`${dayjs(p.paymentDate).format("DD MMM YYYY")} · Receipt: ${p.receiptNumber ?? "—"}${p.notes ? ` · ${p.notes}` : ""}`}
                    />
                    <Box sx={{ textAlign: "right" }}>
                      {p.principalComponent != null && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                          P: ₹{Number(p.principalComponent).toLocaleString("en-IN")} · I: ₹{Number(p.interestComponent ?? 0).toLocaleString("en-IN")}
                        </Typography>
                      )}
                      <Tooltip title="View Receipt">
                        <IconButton size="small" onClick={() => navigate(`/payments/${p.id}/receipt`)}>
                          <ReceiptIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentOpen} onClose={() => setPaymentOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Record Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField fullWidth select label="Payment Type"
              value={paymentForm.watch("paymentType")}
              onChange={(e) => paymentForm.setValue("paymentType", e.target.value as PaymentType)}>
              {PAYMENT_TYPES.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
            </TextField>
            <TextField fullWidth label="Amount (₹)" type="number"
              {...paymentForm.register("amount", { required: true, min: 0.01, valueAsNumber: true })}
              error={!!paymentForm.formState.errors.amount} helperText={paymentForm.formState.errors.amount ? "Enter a valid amount" : ""} />
            <TextField fullWidth label="Payment Date" type="date"
              {...paymentForm.register("paymentDate", { required: true })}
              slotProps={{ inputLabel: { shrink: true } }} />
            <TextField fullWidth label="Notes (optional)" {...paymentForm.register("notes")} multiline rows={2} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setPaymentOpen(false)} variant="outlined">Cancel</Button>
          <Button variant="contained" color="success" disabled={paymentMutation.isPending}
            onClick={paymentForm.handleSubmit((d) => paymentMutation.mutate(d))}>
            {paymentMutation.isPending ? "Saving…" : "Record Payment"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={closeOpen} title="Close Loan" message="Are you sure you want to close this loan?" confirmLabel="Close Loan" onConfirm={() => closeMutation.mutate()} onCancel={() => setCloseOpen(false)} loading={closeMutation.isPending} severity="warning" />
      <ConfirmDialog open={renewOpen} title="Renew Loan" message="Do you want to renew this loan?" confirmLabel="Renew Loan" onConfirm={() => renewMutation.mutate()} onCancel={() => setRenewOpen(false)} loading={renewMutation.isPending} severity="info" />
    </Box>
  );
}
