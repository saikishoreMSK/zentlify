"use client";
import { createTheme } from "@mui/material/styles";

// Zentlify brand theme — "Charcoal & Amber".
// Charcoal #1e1e1e for chrome/text, Amazon-amber #FF9900 as the accent/CTA.
export const BRAND = {
  charcoal: "#1e1e1e",
  charcoalSoft: "#2a2a2a",
  amber: "#FF9900",
  amberDark: "#e08600",
  cream: "#FAFAF8",
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: BRAND.amber,
      dark: BRAND.amberDark,
      contrastText: BRAND.charcoal, // dark text on amber for readability
    },
    secondary: {
      main: BRAND.charcoal,
      contrastText: "#ffffff",
    },
    background: {
      default: BRAND.cream,
      paper: "#ffffff",
    },
    text: {
      primary: BRAND.charcoal,
      secondary: "#5f5f5f",
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily:
      'var(--font-poppins), system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    button: { fontWeight: 700, textTransform: "none" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
  },
});

export default theme;
