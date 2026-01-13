import { Alert, type AlertColor, Snackbar } from '@mui/material';
import { AxiosError } from 'axios';
import React, { createContext, useCallback, useContext, useState } from 'react';

type SnackbarContextData = {
  success: (message: AxiosError | string) => void;
  error: (message: AxiosError | string) => void;
  warning: (message: AxiosError | string) => void;
  info: (message: AxiosError | string) => void;
};

const SnackbarContext = createContext<SnackbarContextData | undefined>(
  undefined,
);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  const showSnackbar = useCallback((type: AlertColor, msg: string) => {
    setSeverity(type);
    setMessage(msg);
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const processMessage = (err) => {
    if (err instanceof AxiosError) {
      return err.response?.data?.message || err.message || 'Erro inesperado';
    }

    if (err.message) {
      return err.message;
    }

    return err || 'Erro inesperado';
  };

  return (
    <SnackbarContext.Provider
      value={{
        success: (msg) => showSnackbar('success', processMessage(msg)),
        error: (msg) => showSnackbar('error', processMessage(msg)),
        warning: (msg) => showSnackbar('warning', processMessage(msg)),
        info: (msg) => showSnackbar('info', processMessage(msg)),
      }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSnackbar(): SnackbarContextData {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }

  return context;
}
