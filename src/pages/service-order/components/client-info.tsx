/* eslint-disable react-hooks/set-state-in-effect */
import { AddCircleOutline } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ClientService } from '../../../core/api/client.service';
import { useDialog } from '../../../core/contexts/dialog.context';
import { useSnackbar } from '../../../core/contexts/snackbar.context';
import type { Client } from '../../../core/models/client.interface';
import { CreateClientModal } from '../../../core/ui/modals/create-client-modal';
import { ListClientModal } from '../../../core/ui/modals/list-client-modal';
import { formatDocument, formatPhone } from '../../../core/utils/string.util';

interface ClientInfoProps {
  client?: Client | null;
  hideChange?: boolean;
  onChange?: (c: Client | null) => void;
}

export function ClientInfo({
  client: initialClient,
  hideChange,
  onChange,
}: ClientInfoProps) {
  const [document, setDocument] = useState('');
  const [name, setName] = useState('');
  const [client, setClient] = useState<Client | null>(initialClient || null);
  const { openDialog } = useDialog();
  const snackbar = useSnackbar();

  useEffect(() => {
    setClient(initialClient || null);
  }, [initialClient]);

  async function handleAddClient() {
    const newClient = await openDialog<Client>(<CreateClientModal />);
    if (newClient) {
      setClient(newClient);
      onChange?.(newClient);
    }
  }

  async function handleSearchClient() {
    if (!document) return;

    try {
      const result = await ClientService.get(document);
      setClient(result.data);
      onChange?.(result.data);
    } catch (e) {
      snackbar.error('Cliente não encontrado');
      console.error(e);
    }
  }

  async function handleSearchClientByName() {
    const clientSelected = await openDialog<Client>(
      <ListClientModal name={name} />,
    );
    if (clientSelected) {
      setClient(clientSelected);
      onChange?.(clientSelected);
    }
  }

  function handleChangeClient() {
    setClient(null);
    setDocument('');
    onChange?.(null);
  }

  return (
    <Box>
      {/* SEARCH / ADD */}
      {!client && (
        <Stack spacing={2}>
          <Typography variant="subtitle1">Buscar cliente</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
            <Stack
              flex={1}
              direction={{ xs: 'column', sm: 'column' }}
              spacing={2}>
              <TextField
                fullWidth
                label="Nome do Cliente"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Stack alignItems="flex-end" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearchClientByName}>
                  Buscar
                </Button>
              </Stack>
            </Stack>

            <Stack
              flex={1}
              direction={{ xs: 'column', sm: 'column' }}
              spacing={2}>
              <TextField
                fullWidth
                label="CPF do Cliente"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
              />
              <Stack alignItems="flex-end" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearchClient}>
                  Buscar
                </Button>

                <Button
                  variant="contained"
                  startIcon={<AddCircleOutline />}
                  onClick={handleAddClient}>
                  Adicionar
                </Button>
              </Stack>
            </Stack>
          </Stack>

          <Divider />
        </Stack>
      )}

      {/* CLIENT INFO */}
      {client && (
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon color="primary" />
            <Typography variant="subtitle1">Dados do Cliente</Typography>
          </Box>

          <Divider />

          <Stack spacing={1}>
            <Typography>
              <strong>Nome:</strong> {client.name}
            </Typography>

            <Typography>
              <strong>Documento:</strong> {formatDocument(client.document)}
            </Typography>

            <Typography>
              <strong>Telefone:</strong> {formatPhone(client.phone)}
            </Typography>
          </Stack>

          {!hideChange && (
            <Box>
              <Button
                size="small"
                startIcon={<SwapHorizIcon />}
                onClick={handleChangeClient}>
                Alterar cliente
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* SIGNATURE */}
          <Box>
            <Typography variant="body2" gutterBottom>
              Assinatura do Cliente
            </Typography>

            <Box
              sx={{
                borderBottom: '1px solid',
                borderColor: 'text.primary',
                height: 40,
                width: '100%',
              }}
            />
          </Box>
        </Stack>
      )}
    </Box>
  );
}
