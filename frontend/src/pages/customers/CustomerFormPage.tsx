import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { customerService, type CustomerInput } from "../../services/customerService";
import { useSnackbar } from "../../context/SnackbarContext";

export default function CustomerFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();
  const isEdit = !!id;
  const customerId = Number(id);

  const { data: existing, isLoading } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => customerService.getById(customerId).then((r) => r.data),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerInput>({
    defaultValues: { name: "", phoneNumber: "", alternativePhone: "", address: "", governmentIdNumber: "" },
  });

  useEffect(() => {
    if (existing) reset(existing);
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (data: CustomerInput) =>
      isEdit ? customerService.update(customerId, data) : customerService.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      if (isEdit) queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      showSuccess(`Customer ${isEdit ? "updated" : "created"} successfully`);
      navigate(`/customers/${res.data.id}`);
    },
    onError: () => showError(`Failed to ${isEdit ? "update" : "create"} customer`),
  });

  if (isLoading) return <LoadingSpinner message="Loading customer…" />;

  return (
    <Box>
      <PageHeader
        title={isEdit ? "Edit Customer" : "New Customer"}
        crumbs={[
          { label: "Customers", to: "/customers" },
          { label: isEdit ? "Edit" : "New" },
        ]}
        action={
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Back
          </Button>
        }
      />

      <Card sx={{ maxWidth: 700 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>Customer Information</Typography>
          <Divider sx={{ mb: 3 }} />
          <Box component="form" onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  {...register("name", { required: "Name is required" })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  data-testid="input-customer-name"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  {...register("phoneNumber", {
                    required: "Phone is required",
                    pattern: { value: /^[0-9+\-\s]{7,15}$/, message: "Enter a valid phone number" },
                  })}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  data-testid="input-customer-phone"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Alternative Phone"
                  {...register("alternativePhone", {
                    pattern: { value: /^[0-9+\-\s]{7,15}$/, message: "Enter a valid phone number" },
                  })}
                  error={!!errors.alternativePhone}
                  helperText={errors.alternativePhone?.message}
                  data-testid="input-customer-alt-phone"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Government ID Number"
                  {...register("governmentIdNumber", { required: "Government ID is required" })}
                  error={!!errors.governmentIdNumber}
                  helperText={errors.governmentIdNumber?.message}
                  data-testid="input-customer-govt-id"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={3}
                  {...register("address", { required: "Address is required" })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  data-testid="input-customer-address"
                />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => navigate(-1)} disabled={mutation.isPending}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={mutation.isPending}
                data-testid="button-save-customer"
              >
                {mutation.isPending ? "Saving…" : isEdit ? "Update Customer" : "Create Customer"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
