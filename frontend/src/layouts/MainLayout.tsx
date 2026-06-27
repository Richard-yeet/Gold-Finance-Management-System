import { useState } from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Sidebar from "../components/layout/Sidebar";
import TopAppBar from "../components/layout/TopAppBar";

const DRAWER_WIDTH = 240;

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <TopAppBar
        drawerWidth={DRAWER_WIDTH}
        onMenuClick={handleDrawerToggle}
      />
      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isMobile={isMobile}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
