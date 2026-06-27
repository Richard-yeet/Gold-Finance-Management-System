import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DiamondIcon from "@mui/icons-material/Diamond";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { loanService } from "../../services/loanService";

export default function ReceiptPage() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();

  const { data: text, isLoading, isError } = useQuery({
    queryKey: ["receipt", paymentId],
    queryFn: () => loanService.getReceipt(Number(paymentId)).then((r) => r.data as string),
    enabled: !!paymentId,
  });

  if (isLoading) return <LoadingSpinner message="Loading receipt…" />;

  return (
    <Box>
      <PageHeader
        title="Payment Receipt"
        crumbs={[{ label: "Loans", to: "/loans" }, { label: "Receipt" }]}
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>
            <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}>Print</Button>
          </Box>
        }
      />

      <Card sx={{ maxWidth: 640, mx: "auto" }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
              <DiamondIcon sx={{ color: "primary.main", fontSize: 32 }} />
              <Typography variant="h5" fontWeight={800}>Gold Finance</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">Payment Receipt #{paymentId}</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {isError ? (
            <Alert severity="error">Failed to load receipt from server.</Alert>
          ) : text ? (
            <Box
              component="pre"
              sx={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.9rem",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                bgcolor: "#F8F9FA",
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                lineHeight: 1.8,
              }}
            >
              {text}
            </Box>
          ) : (
            <Alert severity="info">Receipt content is empty.</Alert>
          )}

          <Divider sx={{ mt: 3, mb: 2 }} />
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", display: "block" }}>
            Thank you for your payment. This is a computer-generated receipt.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
