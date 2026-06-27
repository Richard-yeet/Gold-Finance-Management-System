import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import PageHeader from "../../components/common/PageHeader";
import StatusChip from "../../components/common/StatusChip";
import { loanService, type Loan } from "../../services/loanService";
import dayjs from "dayjs";

export default function LoanListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: loans = [], isLoading } = useQuery({
    queryKey: ["loans", searchQuery],
    queryFn: () => loanService.getAll(searchQuery || undefined).then((r) => r.data),
  });

  const columns: GridColDef<Loan>[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "loanNumber",
      headerName: "Loan #",
      width: 140,
      renderCell: (p) => (
        <Typography variant="body2" fontWeight={600} color="primary.main">
          {p.value || `#${p.row.id}`}
        </Typography>
      ),
    },
    { field: "customerName", headerName: "Customer", flex: 1, minWidth: 150 },
    {
      field: "principalAmount",
      headerName: "Principal",
      width: 140,
      renderCell: (p) => `₹${Number(p.value).toLocaleString("en-IN")}`,
    },
    {
      field: "interestRate",
      headerName: "Rate",
      width: 90,
      renderCell: (p) => `${p.value}%`,
    },
    {
      field: "interestType",
      headerName: "Type",
      width: 140,
      renderCell: (p) => String(p.value ?? "").replace(/_/g, " "),
    },
    {
      field: "loanDate",
      headerName: "Date",
      width: 120,
      renderCell: (p) => p.value ? dayjs(p.value).format("DD MMM YYYY") : "—",
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      renderCell: (p) => <StatusChip status={p.value} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton size="small" onClick={() => navigate(`/loans/${params.row.id}`)} data-testid={`btn-view-${params.row.id}`}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => navigate(`/loans/${params.row.id}/edit`)} data-testid={`btn-edit-${params.row.id}`}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Loans"
        subtitle={`${loans.length} total loans`}
        crumbs={[{ label: "Loans" }]}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/loans/new")} data-testid="button-add-loan">
            New Loan
          </Button>
        }
      />

      <Card sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1, maxWidth: 480 }}>
          <TextField
            fullWidth
            placeholder="Search by loan number, customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSearchQuery(search)}
            slotProps={{
              input: {
                startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />,
              },
            }}
            data-testid="input-loan-search"
          />
          <Button variant="outlined" onClick={() => setSearchQuery(search)}>Search</Button>
        </Box>
      </Card>

      <Card>
        <DataGrid
          rows={loans}
          columns={columns}
          loading={isLoading}
          autoHeight
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          sx={{ border: "none", "& .MuiDataGrid-columnHeaders": { bgcolor: "#F4F6F8" }, "& .MuiDataGrid-row:hover": { bgcolor: "#F0F4FF" } }}
        />
      </Card>
    </Box>
  );
}
