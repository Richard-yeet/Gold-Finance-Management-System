import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AuthProvider } from "./context/AuthContext";
import { SnackbarProvider } from "./context/SnackbarContext";
import AppRoutes from "./routes/AppRoutes";
import theme from "./theme/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <BrowserRouter basename={basePath}>
            <AuthProvider>
              <SnackbarProvider>
                <AppRoutes />
              </SnackbarProvider>
            </AuthProvider>
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
