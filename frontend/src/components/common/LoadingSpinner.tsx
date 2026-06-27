import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

interface LoadingSpinnerProps {
  message?: string;
  minHeight?: number | string;
}

export default function LoadingSpinner({ message, minHeight = 300 }: LoadingSpinnerProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight,
        gap: 2,
      }}
    >
      <CircularProgress size={40} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}
