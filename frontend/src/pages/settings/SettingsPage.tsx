import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import SecurityIcon from "@mui/icons-material/Security";
import ApiIcon from "@mui/icons-material/Api";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <Box>
      <PageHeader
        title="Settings"
        subtitle="System configuration and account information"
        crumbs={[{ label: "Settings" }]}
      />

      <Grid container spacing={3}>
        {/* Profile */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>Account</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main", fontSize: "1.4rem" }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>{user?.username}</Typography>
                  <Chip label="Administrator" color="primary" size="small" />
                </Box>
              </Box>
              <List disablePadding>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}><SecurityIcon fontSize="small" color="success" /></ListItemIcon>
                  <ListItemText primary="JWT Authentication Active" secondary="Your session is secured with JWT tokens" primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }} secondaryTypographyProps={{ fontSize: "0.78rem" }} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* API Config */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <ApiIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>API Configuration</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <List disablePadding>
                {[
                  { label: "Backend URL", value: "http://localhost:8053/api" },
                  { label: "API Version", value: "v1" },
                  { label: "Authentication", value: "Bearer JWT" },
                  { label: "Timeout", value: "30 seconds" },
                ].map((item) => (
                  <ListItem key={item.label} disablePadding sx={{ mb: 1.5 }}>
                    <ListItemText
                      primary={item.label}
                      secondary={item.value}
                      primaryTypographyProps={{ fontSize: "0.78rem", fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}
                      secondaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500, color: "text.primary" }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* About */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <InfoIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>About Gold Finance</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                {[
                  { label: "Application", value: "Gold Finance Management System" },
                  { label: "Version", value: "1.0.0" },
                  { label: "Frontend", value: "React 19 + MUI + Vite" },
                  { label: "Backend", value: "Spring Boot (Java)" },
                ].map((item) => (
                  <Grid key={item.label} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.05em">{item.label}</Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ mt: 0.3 }}>{item.value}</Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
