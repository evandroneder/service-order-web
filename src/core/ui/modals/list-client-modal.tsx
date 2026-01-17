import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ClientService } from '../../api/client.service';
import { type DialogProps } from '../../contexts/dialog.context';
import type { Client } from '../../models/client.interface';
import { formatCPF, formatPhone } from '../../utils/string.util';

/* =========================
   MODAL
========================= */

interface Props extends DialogProps {
  name: string;
}

export function ListClientModal({ onConfirm, name: clientName }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [name, setName] = useState(clientName);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD
  ========================= */

  async function loadClients() {
    setLoading(true);

    const { data } = await ClientService.getAll({ name });

    setClients(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadClients();
  }, []);

  /* =========================
     HANDLERS
  ========================= */

  function handleSelect(client: Client) {
    onConfirm(client);
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <Dialog open fullScreen={isMobile} maxWidth="md" fullWidth>
      <DialogTitle
        display="flex"
        alignItems="center"
        justifyContent="space-between">
        <Typography>
          <strong>Selecionar Cliente</strong>
        </Typography>

        <IconButton onClick={() => onConfirm(null)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* SEARCH */}
        <Stack direction={isMobile ? 'column' : 'row'} spacing={2} mb={3}>
          <TextField
            fullWidth
            label="Buscar por nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadClients()}
          />

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={loadClients}>
            Buscar
          </Button>
        </Stack>

        {/* DESKTOP TABLE */}
        {!isMobile && (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell align="center">Ação</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {!loading && clients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
                )}

                {clients.map((client) => (
                  <TableRow
                    key={client.id_client}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleSelect(client as Client)}>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{formatCPF(client.document)}</TableCell>
                    <TableCell>{formatPhone(client.phone)}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(client as Client);
                        }}>
                        Selecionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        {/* MOBILE LIST */}
        {isMobile && (
          <Stack spacing={2}>
            {!loading && clients.length === 0 && (
              <Typography align="center">Nenhum cliente encontrado</Typography>
            )}

            {clients.map((client) => (
              <Paper
                key={client.id_client}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}>
                <Typography fontWeight={600}>{client.name}</Typography>

                <Typography variant="body2">
                  <strong>Documento:</strong> {client.document}
                </Typography>

                <Typography variant="body2">
                  <strong>Telefone:</strong> {client.phone}
                </Typography>

                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => handleSelect(client as Client)}>
                  Selecionar
                </Button>
              </Paper>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
