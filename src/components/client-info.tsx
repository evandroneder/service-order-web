/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { CreateClientModal } from './create-client-modal';
import { useDialog } from '../contexts/dialog.context';
import api from '../api/axios';
import { useSnackbar } from '../contexts/snackbar.context';

type Client = {
  id_client: number;
  name: string;
  document: string;
  phone: string;
};

export function ClientInfo() {
  const [document, setDocument] = useState('');
  const [client, setClient] = useState<Client | null>(null);
  const { openDialog } = useDialog();
  const snackbar = useSnackbar();

  async function handleAddClient() {
    const client = await openDialog<Client>(<CreateClientModal />);

    setClient(client);
  }

  async function handleSearchClient() {
    if (!document) return;

    try {
      const result = await api.get<Client>(
        `/client/by-document?document=${document}`,
      );
      setClient(result.data);
    } catch (e: any) {
      snackbar.error(e);
      console.error(e);
    }
  }

  function handleChangeClient() {
    setClient(null);
    setDocument('');
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Dados do Cliente
      </Typography>

      {!client ? (
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="CPF do Cliente"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
          />

          <Button variant="contained" onClick={handleSearchClient}>
            Buscar
          </Button>

          <Button variant="outlined" onClick={handleAddClient}>
            Adicionar cliente
          </Button>
        </Box>
      ) : (
        <Box>
          <Box>
            <Typography>Nome: {client.name}</Typography>
            <Typography>Documento: {client.document}</Typography>
            <Typography>Telefone: {client.phone}</Typography>

            <Button sx={{ mt: 2 }} size="small" onClick={handleChangeClient}>
              Alterar cliente
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* SIGNATURE */}
          <Typography variant="body2" gutterBottom>
            Assinatura do Cliente
          </Typography>

          <Box
            sx={{
              borderBottom: '1px solid #000',
              height: 40,
              width: '100%',
            }}
          />
        </Box>
      )}
    </>
  );
}
