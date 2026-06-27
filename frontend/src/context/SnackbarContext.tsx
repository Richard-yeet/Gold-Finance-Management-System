import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type Severity = "success" | "error" | "warning" | "info";

interface SnackbarContextType {
  showMessage: (message: string, severity?: Severity) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<Severity>("info");

  const showMessage = useCallback((msg: string, sev: Severity = "info") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  const showSuccess = useCallback((msg: string) => showMessage(msg, "success"), [showMessage]);
  const showError = useCallback((msg: string) => showMessage(msg, "error"), [showMessage]);

  return (
    <SnackbarContext.Provider value={{ showMessage, showSuccess, showError }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setOpen(false)} severity={severity} variant="filled" sx={{ borderRadius: 2 }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error("useSnackbar must be used within SnackbarProvider");
  return ctx;
}
