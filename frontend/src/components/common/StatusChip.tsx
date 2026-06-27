import Chip from "@mui/material/Chip";

interface StatusChipProps {
  status: string;
}

const STATUS_MAP: Record<string, { label: string; color: "success" | "error" | "warning" | "info" | "default" }> = {
  ACTIVE: { label: "Active", color: "success" },
  CLOSED: { label: "Closed", color: "default" },
  DEFAULTED: { label: "Defaulted", color: "error" },
  RENEWED: { label: "Renewed", color: "info" },
};

export default function StatusChip({ status }: StatusChipProps) {
  const cfg = STATUS_MAP[status] ?? { label: status, color: "default" };
  return (
    <Chip
      label={cfg.label}
      color={cfg.color}
      size="small"
      sx={{ fontWeight: 600, fontSize: "0.72rem" }}
    />
  );
}
