import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
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
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  loanService,
  type LoanCreateRequest,
  type LoanUpdateRequest,
  type JewelleryItemRequest,
  type InterestType,
  type InterestPaymentFrequency,
  type LoanStatus,
  type JewelleryItemType,
} from "../../services/loanService";
import { customerService, type Customer } from "../../services/customerService";
import { useSnackbar } from "../../context/SnackbarContext";
import dayjs from "dayjs";

const INTEREST_TYPES: { value: InterestType; label: string }[] = [
  { value: "MONTHLY_SIMPLE", label: "Monthly Simple" },
  { value: "ANNUAL_SIMPLE", label: "Annual Simple" },
  { value: "COMPOUND", label: "Compound" },
];

const FREQUENCIES: { value: InterestPaymentFrequency; label: string }[] = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
];

const STATUSES: { value: LoanStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "CLOSED", label: "Closed" },
  { value: "DEFAULTED", label: "Defaulted" },
];

const JEWELLERY_TYPES: JewelleryItemType[] = [
  "CHAIN", "RING", "NECKLACE", "BRACELET", "COIN", "BANGLE", "EARRINGS", "OTHER",
];

const emptyItem = (): JewelleryItemRequest => ({
  itemType: "OTHER",
  description: "",
  weightGrams: 0,
  estimatedPurity: "",
  estimatedValue: 0,
  lockerNumber: "",
  remarks: "",
});

export default function LoanFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();
  const isEdit = !!id;
  const loanId = Number(id);

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customerService.getAll().then((r) => r.data),
  });

  const { data: existing, isLoading } = useQuery({
    queryKey: ["loan", loanId],
    queryFn: () => loanService.getById(loanId).then((r) => r.data),
    enabled: isEdit,
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  /* ---------- create form ---------- */
  const createForm = useForm<LoanCreateRequest>({
    defaultValues: {
      customerId: 0,
      principalAmount: 0,
      interestRate: 0,
      interestType: "MONTHLY_SIMPLE",
      interestPaymentFrequency: "MONTHLY",
      loanDate: dayjs().format("YYYY-MM-DD"),
      notes: "",
      jewelleryItems: [emptyItem()],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: createForm.control, name: "jewelleryItems" });

  /* ---------- update form ---------- */
  const updateForm = useForm<LoanUpdateRequest>({
    defaultValues: {
      interestRate: 0,
      interestType: "MONTHLY_SIMPLE",
      interestPaymentFrequency: "MONTHLY",
      status: "ACTIVE",
      notes: "",
    },
  });

  useEffect(() => {
    if (existing && isEdit) {
      updateForm.reset({
        interestRate: existing.interestRate,
        interestType: existing.interestType,
        interestPaymentFrequency: existing.interestPaymentFrequency,
        status: existing.status,
        notes: existing.notes ?? "",
      });
      const c = customers.find((cu) => cu.id === existing.customerId);
      if (c) setSelectedCustomer(c);
    }
  }, [existing, customers, isEdit, updateForm]);

  const createMutation = useMutation({
    mutationFn: (data: LoanCreateRequest) => loanService.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      showSuccess("Loan created successfully");
      navigate(`/loans/${res.data.id}`);
    },
    onError: () => showError("Failed to create loan"),
  });

  const updateMutation = useMutation({
    mutationFn: (data: LoanUpdateRequest) => loanService.update(loanId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["loan", loanId] });
      showSuccess("Loan updated successfully");
      navigate(`/loans/${loanId}`);
    },
    onError: () => showError("Failed to update loan"),
  });

  if (isLoading) return <LoadingSpinner message="Loading loan…" />;

  /* -------- EDIT MODE -------- */
  if (isEdit) {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = updateForm;
    return (
      <Box>
        <PageHeader
          title="Edit Loan"
          crumbs={[{ label: "Loans", to: "/loans" }, { label: "Edit" }]}
          action={<Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>}
        />
        <Card sx={{ maxWidth: 600 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Update Loan</Typography>
            <Divider sx={{ mb: 3 }} />
            <Box component="form" onSubmit={handleSubmit((d) => updateMutation.mutate(d))} noValidate>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Interest Rate (%)" type="number" inputProps={{ step: "0.0001" }}
                    {...register("interestRate", { required: "Required", min: { value: 0.0001, message: "Must be > 0" }, valueAsNumber: true })}
                    error={!!errors.interestRate} helperText={errors.interestRate?.message} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth select label="Interest Type" value={watch("interestType")} onChange={(e) => setValue("interestType", e.target.value as InterestType)}>
                    {INTEREST_TYPES.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth select label="Payment Frequency" value={watch("interestPaymentFrequency")} onChange={(e) => setValue("interestPaymentFrequency", e.target.value as InterestPaymentFrequency)}>
                    {FREQUENCIES.map((f) => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth select label="Status" value={watch("status")} onChange={(e) => setValue("status", e.target.value as LoanStatus)}>
                    {STATUSES.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Notes (optional)" multiline rows={3} {...register("notes")} />
                </Grid>
              </Grid>
              <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={() => navigate(-1)} disabled={updateMutation.isPending}>Cancel</Button>
                <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving…" : "Update Loan"}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  /* -------- CREATE MODE -------- */
  const { register, handleSubmit, watch, setValue, formState: { errors } } = createForm;
  return (
    <Box>
      <PageHeader
        title="New Loan"
        crumbs={[{ label: "Loans", to: "/loans" }, { label: "New" }]}
        action={<Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>}
      />
      <Box component="form" onSubmit={handleSubmit((d) => createMutation.mutate(d))} noValidate>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>Loan Information</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12 }}>
                    <Autocomplete
                      options={customers}
                      getOptionLabel={(c) => `${c.name} — ${c.phoneNumber}`}
                      value={selectedCustomer}
                      onChange={(_, c) => { setSelectedCustomer(c); setValue("customerId", c?.id ?? 0); }}
                      renderInput={(params) => (
                        <TextField {...params} label="Customer" error={!!errors.customerId} helperText={errors.customerId ? "Select a customer" : ""} />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Principal Amount (₹)" type="number"
                      {...register("principalAmount", { required: "Required", min: { value: 0.01, message: "Must be > 0" }, valueAsNumber: true })}
                      error={!!errors.principalAmount} helperText={errors.principalAmount?.message} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Interest Rate (%)" type="number" inputProps={{ step: "0.0001" }}
                      {...register("interestRate", { required: "Required", min: { value: 0.0001, message: "Must be > 0" }, valueAsNumber: true })}
                      error={!!errors.interestRate} helperText={errors.interestRate?.message} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth select label="Interest Type" value={watch("interestType")} onChange={(e) => setValue("interestType", e.target.value as InterestType)}>
                      {INTEREST_TYPES.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth select label="Payment Frequency" value={watch("interestPaymentFrequency")} onChange={(e) => setValue("interestPaymentFrequency", e.target.value as InterestPaymentFrequency)}>
                      {FREQUENCIES.map((f) => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Loan Date" type="date"
                      {...register("loanDate", { required: "Required" })}
                      slotProps={{ inputLabel: { shrink: true } }}
                      error={!!errors.loanDate} helperText={errors.loanDate?.message} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Notes (optional)" multiline rows={2} {...register("notes")} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700}>Jewellery Items</Typography>
                  <Button size="small" startIcon={<AddIcon />} onClick={() => append(emptyItem())}>Add Item</Button>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {fields.map((field, idx) => (
                    <Box key={field.id} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                        <Typography variant="caption" fontWeight={600} color="text.secondary">Item {idx + 1}</Typography>
                        <IconButton size="small" onClick={() => remove(idx)} disabled={fields.length === 1}>
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Box>
                      <Grid container spacing={1.5}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth select size="small" label="Item Type" value={watch(`jewelleryItems.${idx}.itemType`)} onChange={(e) => setValue(`jewelleryItems.${idx}.itemType`, e.target.value as JewelleryItemType)}>
                            {JEWELLERY_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                          </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth size="small" label="Description"
                            {...register(`jewelleryItems.${idx}.description`, { required: "Required" })}
                            error={!!errors.jewelleryItems?.[idx]?.description} />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <TextField fullWidth size="small" label="Weight (g)" type="number"
                            {...register(`jewelleryItems.${idx}.weightGrams`, { required: "Required", min: 0.001, valueAsNumber: true })} />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <TextField fullWidth size="small" label="Purity (e.g. 22K)"
                            {...register(`jewelleryItems.${idx}.estimatedPurity`, { required: "Required" })} />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <TextField fullWidth size="small" label="Est. Value (₹)" type="number"
                            {...register(`jewelleryItems.${idx}.estimatedValue`, { required: "Required", min: 0.01, valueAsNumber: true })} />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <TextField fullWidth size="small" label="Locker Number"
                            {...register(`jewelleryItems.${idx}.lockerNumber`, { required: "Required" })} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField fullWidth size="small" label="Remarks (optional)"
                            {...register(`jewelleryItems.${idx}.remarks`)} />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={() => navigate(-1)} disabled={createMutation.isPending}>Cancel</Button>
          <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={createMutation.isPending}>
            {createMutation.isPending ? "Saving…" : "Create Loan"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
