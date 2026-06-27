import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

interface ErrorAlertProps {
  message?: string;
}

export default function ErrorAlert({ message = "Something went wrong. Please try again." }: ErrorAlertProps) {
  return (
    <Box sx={{ p: 2 }}>
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {message}
      </Alert>
    </Box>
  );
}
