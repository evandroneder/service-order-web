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
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/auth.context';

export function DefaultLayout() {
  const auth = useAuth();
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
    { label: 'Logout', path: '/login', execute: () => auth.logout() },
  ];

  const handleClickItem = async (item) => {
    if (item.execute) {
      await item.execute();
    }
    handleNavigate(item.url);
  };

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
                onClick={() => handleClickItem(item)}>
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
                <ListItemButton onClick={() => handleClickItem(item)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* CONTENT */}
      <Box flex={1} p={isMobile ? 1 : 3}>
        <Outlet />
      </Box>
    </Box>
  );
}
