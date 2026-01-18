import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  shape: {
    borderRadius: 8,
  },

  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',

          '& fieldset': {
            borderColor: '#d0d5dd',
          },

          '&:hover fieldset': {
            borderColor: '#667085',
          },

          '&.Mui-focused fieldset': {
            borderColor: '#1976d2',
            borderWidth: 2,
          },

          '&.Mui-error fieldset': {
            borderColor: '#d32f2f',
          },
        },

        input: {
          padding: '10px 12px',
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: 14,
          color: '#475467',

          '&.Mui-focused': {
            color: '#1976d2',
          },
        },
      },
    },
  },
});
