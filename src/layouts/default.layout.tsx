import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function DefaultLayout() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  function handleNavigate(path: string) {
    navigate(path);
    setOpen(false);
  }

  const menuItems = [
    { label: 'Ordens de Serviço', path: '/' },
    { label: 'Nova OS', path: '/service-orders/new' },
  ];

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      {/* HEADER */}
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setOpen(true)}
              sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sistema OS
          </Typography>

          {!isMobile &&
            menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}>
                {item.label}
              </Button>
            ))}
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250 }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Menu
          </Typography>

          <List>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton onClick={() => handleNavigate(item.path)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* CONTENT */}
      <Box flex={1} p={3}>
        <Outlet />
      </Box>
    </Box>
  );
}
