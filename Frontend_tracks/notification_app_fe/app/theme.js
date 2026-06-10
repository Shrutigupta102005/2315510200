"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#176D7A",
      dark: "#0D4E57",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#7B4E2D",
    },
    background: {
      default: "#F5F7F8",
      paper: "#FFFFFF",
    },
    success: {
      main: "#2E7D32",
    },
    warning: {
      main: "#B06000",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    h5: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    h6: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #DDE5E7",
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});
