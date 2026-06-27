import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1565C0",
      light: "#1976D2",
      dark: "#0D47A1",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#455A64",
      light: "#607D8B",
      dark: "#263238",
      contrastText: "#ffffff",
    },
    success: {
      main: "#2E7D32",
      light: "#4CAF50",
      dark: "#1B5E20",
    },
    error: {
      main: "#C62828",
      light: "#EF5350",
      dark: "#B71C1C",
    },
    warning: {
      main: "#F57F17",
      light: "#FFA726",
      dark: "#E65100",
    },
    info: {
      main: "#0277BD",
      light: "#29B6F6",
      dark: "#01579B",
    },
    background: {
      default: "#F4F6F8",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A2138",
      secondary: "#546E7A",
    },
    divider: "#E0E7EF",
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#1A2138",
          boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0D47A1",
          color: "#FFFFFF",
          borderRight: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 20px",
          fontWeight: 600,
        },
        containedPrimary: {
          boxShadow: "0 2px 8px rgba(21, 101, 192, 0.3)",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(21, 101, 192, 0.4)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          border: "1px solid #E0E7EF",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: "#F4F6F8",
          color: "#546E7A",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: "0.75rem",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "2px 8px",
          color: "rgba(255,255,255,0.8)",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.12)",
            color: "#FFFFFF",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(255,255,255,0.18)",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.22)",
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit",
          minWidth: 40,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E0E7EF",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;
