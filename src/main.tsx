import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import App from "./App";
import { AuthProvider } from "./auth/auth.context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
      <App />

      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
