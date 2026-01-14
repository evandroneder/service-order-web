import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../core/auth/auth.context';

export function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    await login(username, password);
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh">
      <Paper sx={{ p: 4, width: 320 }}>
        <Typography variant="h6" mb={2}>
          Login
        </Typography>

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={!username || !password}>
          Entrar
        </Button>
      </Paper>
    </Box>
  );
}
