import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import App from './App';
import { AuthProvider } from './core/auth/auth.context';
import { DialogProvider } from './core/contexts/dialog.context';
import { SnackbarProvider } from './core/contexts/snackbar.context';
import { CompanyProvider } from './core/contexts/compnay.context';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <AuthProvider>
          <CompanyProvider>
            <DialogProvider>
              <App />
            </DialogProvider>
          </CompanyProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
