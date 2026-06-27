import { useLocation, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DiamondIcon from "@mui/icons-material/Diamond";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { label: "Customers", icon: <PeopleIcon />, path: "/customers" },
  { label: "Loans", icon: <AccountBalanceWalletIcon />, path: "/loans" },
  { label: "Bank Loans", icon: <AccountBalanceIcon />, path: "/bank-loans" },
  { label: "Reports", icon: <AssessmentIcon />, path: "/reports" },
  { label: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export default function Sidebar({ drawerWidth, mobileOpen, onClose, isMobile }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <DiamondIcon sx={{ color: "#FFD700", fontSize: 28 }} />
        <Box>
          <Typography variant="subtitle1" fontWeight={700} color="#FFFFFF" lineHeight={1.2}>
            Gold Finance
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
            Management System
          </Typography>
        </Box>
      </Toolbar>

      <List sx={{ px: 1, pt: 2, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.path === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) onClose();
                }}
                data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  "&.Mui-selected": {
                    bgcolor: "rgba(255,255,255,0.18)",
                    "& .MuiListItemIcon-root": { color: "#FFD700" },
                    "& .MuiListItemText-primary": { fontWeight: 700, color: "#FFFFFF" },
                  },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.10)" },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "#FFD700" : "rgba(255,255,255,0.7)", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.8)",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
      <List sx={{ px: 1, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={logout}
            data-testid="nav-logout"
            sx={{
              borderRadius: 2,
              py: 1.2,
              color: "rgba(255,255,255,0.7)",
              "&:hover": { bgcolor: "rgba(255,100,100,0.15)", color: "#ff8a80" },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: "0.9rem" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              position: "fixed",
              height: "100vh",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
}
