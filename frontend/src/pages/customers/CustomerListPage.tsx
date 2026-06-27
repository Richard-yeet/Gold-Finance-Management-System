import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import PageHeader from "../../components/common/PageHeader";
import { customerService, type Customer } from "../../services/customerService";

export default function CustomerListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers", searchQuery],
    queryFn: () => customerService.getAll(searchQuery || undefined).then((r) => r.data),
  });

  const columns: GridColDef<Customer>[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 160, renderCell: (p) => (
      <Typography variant="body2" fontWeight={600}>{p.value}</Typography>
    )},
    { field: "phoneNumber", headerName: "Phone", width: 150 },
    { field: "alternativePhone", headerName: "Alt. Phone", width: 140 },
    { field: "governmentIdNumber", headerName: "Govt. ID", width: 160 },
    { field: "address", headerName: "Address", flex: 1, minWidth: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => navigate(`/customers/${params.row.id}`)}
            data-testid={`button-view-customer-${params.row.id}`}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => navigate(`/customers/${params.row.id}/edit`)}
            data-testid={`button-edit-customer-${params.row.id}`}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleSearch = () => setSearchQuery(search);

  return (
    <Box>
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} registered customers`}
        crumbs={[{ label: "Customers" }]}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/customers/new")}
            data-testid="button-add-customer"
          >
            Add Customer
          </Button>
        }
      />

      <Card sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1, maxWidth: 480 }}>
          <TextField
            fullWidth
            placeholder="Search by name, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            data-testid="input-customer-search"
          />
          <Button variant="outlined" onClick={handleSearch} data-testid="button-search-customers">
            Search
          </Button>
        </Box>
      </Card>

      <Card>
        <DataGrid
          rows={customers}
          columns={columns}
          loading={isLoading}
          autoHeight
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": { bgcolor: "#F4F6F8" },
            "& .MuiDataGrid-row:hover": { bgcolor: "#F0F4FF" },
          }}
        />
      </Card>
    </Box>
  );
}
