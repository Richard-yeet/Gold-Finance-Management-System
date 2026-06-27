import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import type { ReactNode } from "react";

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, crumbs, action }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      {crumbs && crumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 1 }}
        >
          {crumbs.map((c, i) =>
            c.to ? (
              <Link key={i} to={c.to} style={{ color: "#546E7A", fontSize: "0.8rem", textDecoration: "none" }}>
                {c.label}
              </Link>
            ) : (
              <Typography key={i} variant="caption" color="text.primary" fontWeight={500}>
                {c.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Box>
    </Box>
  );
}
