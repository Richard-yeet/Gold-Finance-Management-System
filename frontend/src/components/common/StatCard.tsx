import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: string;
  trend?: { value: number; label: string };
}

export default function StatCard({ title, value, subtitle, icon, color = "#1565C0" }: StatCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.08em">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: "text.primary" }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              bgcolor: `${color}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
