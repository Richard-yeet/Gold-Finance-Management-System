import { useState } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import DiamondIcon from "@mui/icons-material/Diamond";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import { useAuth } from "../../context/AuthContext";

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    setError("");
    setLoading(true);
    try {
      await login(data.username, data.password);
    } catch {
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #0D47A1 0%, #1565C0 40%, #1976D2 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        },
      }}
    >
      {/* Left branding panel */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 6,
          color: "#fff",
          zIndex: 1,
        }}
      >
        <DiamondIcon sx={{ fontSize: 72, color: "#FFD700", mb: 3 }} />
        <Typography variant="h3" fontWeight={800} gutterBottom>
          Gold Finance
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.8, textAlign: "center", maxWidth: 360 }}>
          Professional loan management for gold-backed lending businesses
        </Typography>
        <Box sx={{ mt: 6, display: "flex", gap: 4 }}>
          {[
            { label: "Secure", desc: "JWT Authentication" },
            { label: "Fast", desc: "Real-time Updates" },
            { label: "Smart", desc: "Advanced Reporting" },
          ].map((f) => (
            <Box key={f.label} sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight={700}>{f.label}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>{f.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right login panel */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: { xs: 1, md: 0 },
          minWidth: { md: 460 },
          p: { xs: 2, md: 6 },
          zIndex: 1,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 4,
            boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
            border: "none",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
              <DiamondIcon sx={{ color: "primary.main", fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight={700}>Gold Finance</Typography>
                <Typography variant="caption" color="text.secondary">Sign in to your account</Typography>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                fullWidth
                label="Username"
                autoComplete="username"
                autoFocus
                {...register("username", { required: "Username is required" })}
                error={!!errors.username}
                helperText={errors.username?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ mb: 2.5 }}
                data-testid="input-username"
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                {...register("password", { required: "Password is required" })}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ mb: 3 }}
                data-testid="input-password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                data-testid="button-login"
                sx={{ py: 1.5, fontSize: "1rem", borderRadius: 2 }}
              >
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: "block", textAlign: "center" }}>
              Gold Finance Management System v1.0
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
