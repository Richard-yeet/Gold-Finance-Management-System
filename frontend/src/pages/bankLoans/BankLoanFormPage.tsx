import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { bankLoanService, type BankLoanInput, type BankLoanStatus } from "../../services/bankLoanService";
import { useSnackbar } from "../../context/SnackbarContext";
import dayjs from "dayjs";

const STATUSES: { value: BankLoanStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "RENEWED", label: "Renewed" },
  { value: "CLOSED", label: "Closed" },
];

export default function BankLoanFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();
  const isEdit = !!id;
  const loanId = Number(id);

  const { data: existing, isLoading } = useQuery({
    queryKey: ["bank-loan", loanId],
    queryFn: () => bankLoanService.getById(loanId).then((r) => r.data),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<BankLoanInput>({
    defaultValues: {
      bankName: "",
      branch: "",
      loanNumber: "",
      loanAmount: 0,
      interestRate: 0,
      startDate: dayjs().format("YYYY-MM-DD"),
      renewalDate: dayjs().add(1, "month").format("YYYY-MM-DD"),
      expiryDate: dayjs().add(1, "year").format("YYYY-MM-DD"),
      status: "ACTIVE",
      notes: "",
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        bankName: existing.bankName,
        branch: existing.branch,
        loanNumber: existing.loanNumber,
        loanAmount: existing.loanAmount,
        interestRate: existing.interestRate,
        startDate: existing.startDate,
        renewalDate: existing.renewalDate,
        expiryDate: existing.expiryDate,
        status: existing.status,
        notes: existing.notes ?? "",
      });
    }
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (data: BankLoanInput) =>
      isEdit ? bankLoanService.update(loanId, data) : bankLoanService.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["bank-loans"] });
      if (isEdit) queryClient.invalidateQueries({ queryKey: ["bank-loan", loanId] });
      showSuccess(`Bank loan ${isEdit ? "updated" : "created"} successfully`);
      navigate(`/bank-loans/${res.data.id}`);
    },
    onError: () => showError(`Failed to ${isEdit ? "update" : "create"} bank loan`),
  });

  if (isLoading) return <LoadingSpinner message="Loading bank loan…" />;

  return (
    <Box>
      <PageHeader
        title={isEdit ? "Edit Bank Loan" : "New Bank Loan"}
        crumbs={[{ label: "Bank Loans", to: "/bank-loans" }, { label: isEdit ? "Edit" : "New" }]}
        action={<Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>}
      />

      <Card sx={{ maxWidth: 760 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>Bank Loan Details</Typography>
          <Divider sx={{ mb: 3 }} />
          <Box component="form" onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Bank Name" {...register("bankName", { required: "Required" })} error={!!errors.bankName} helperText={errors.bankName?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Branch" {...register("branch", { required: "Required" })} error={!!errors.branch} helperText={errors.branch?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Loan Number" {...register("loanNumber", { required: "Required" })} error={!!errors.loanNumber} helperText={errors.loanNumber?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth select label="Status" value={watch("status")} onChange={(e) => setValue("status", e.target.value as BankLoanStatus)}>
                  {STATUSES.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Loan Amount (₹)" type="number"
                  {...register("loanAmount", { required: "Required", min: { value: 0.01, message: "Must be > 0" }, valueAsNumber: true })}
                  error={!!errors.loanAmount} helperText={errors.loanAmount?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Interest Rate (%)" type="number" inputProps={{ step: "0.0001" }}
                  {...register("interestRate", { required: "Required", min: { value: 0.0001, message: "Must be > 0" }, valueAsNumber: true })}
                  error={!!errors.interestRate} helperText={errors.interestRate?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Start Date" type="date"
                  {...register("startDate", { required: "Required" })}
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={!!errors.startDate} helperText={errors.startDate?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Renewal Date" type="date"
                  {...register("renewalDate", { required: "Required" })}
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={!!errors.renewalDate} helperText={errors.renewalDate?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Expiry Date" type="date"
                  {...register("expiryDate", { required: "Required" })}
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={!!errors.expiryDate} helperText={errors.expiryDate?.message} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Notes (optional)" multiline rows={3} {...register("notes")} />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => navigate(-1)} disabled={mutation.isPending}>Cancel</Button>
              <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={mutation.isPending}>
                {mutation.isPending ? "Saving…" : isEdit ? "Update" : "Create Bank Loan"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
