import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';

export function DefaultLayout() {
  const navigate = useNavigate();

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      {/* HEADER */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sistema OS
          </Typography>

          <Button color="inherit" onClick={() => navigate('/')}>
            Ordens de Serviço
          </Button>

          <Button
            color="inherit"
            onClick={() => navigate('/service-orders/new')}>
            Nova OS
          </Button>
        </Toolbar>
      </AppBar>

      {/* CONTENT */}
      <Box flex={1} p={3}>
        <Outlet />
      </Box>
    </Box>
  );
}
