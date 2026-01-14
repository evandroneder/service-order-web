import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { ClientService } from '../../api/client.service';
import { useSnackbar } from '../../contexts/snackbar.context';
import type { Client } from '../../models/client.interface';

type ViaCepResponse = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
};

type Props = {
  onClose?: () => void;
  onConfirm?: (data) => void;
};

export function CreateClientModal({ onClose, onConfirm }: Props) {
  const snackbar = useSnackbar();
  const [form, setForm] = useState<Omit<Client, 'id_client'>>({
    name: '',
    email: '',
    phone: '',
    document: '',
    cep: '',
    street: '',
    number: 0,
    complement: '',
  });

  function handleChange(field: keyof typeof form, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSearchCep() {
    if (!form.cep || form.cep.length < 8) return;

    try {
      const response = await axios.get<ViaCepResponse>(
        `https://viacep.com.br/ws/${form.cep}/json/`,
      );

      if (response.data.erro) return;

      setForm((prev) => ({
        ...prev,
        street: response.data.logradouro,
      }));
    } catch (error) {
      console.error('Erro ao buscar CEP', error);
    }
  }

  async function handleSave() {
    try {
      const result = await ClientService.create(form);
      onConfirm?.(result.data);
    } catch (e) {
      snackbar.error(e);
      console.error(e);
    }
  }

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle>Novo Cliente</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Nome"
            fullWidth
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <TextField
            label="Email"
            fullWidth
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />

          <TextField
            label="Telefone"
            fullWidth
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />

          <TextField
            label="CPF / CNPJ"
            fullWidth
            value={form.document}
            onChange={(e) => handleChange('document', e.target.value)}
          />

          {/* CEP + BOTÃO */}
          <Stack direction="row" spacing={1}>
            <TextField
              label="CEP"
              fullWidth
              value={form.cep}
              onChange={(e) => handleChange('cep', e.target.value)}
            />

            <Button
              variant="outlined"
              onClick={handleSearchCep}
              sx={{ whiteSpace: 'nowrap' }}>
              Buscar CEP
            </Button>
          </Stack>

          <TextField
            label="Rua"
            fullWidth
            value={form.street}
            onChange={(e) => handleChange('street', e.target.value)}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Número"
              type="number"
              fullWidth
              value={form.number}
              onChange={(e) => handleChange('number', Number(e.target.value))}
            />

            <TextField
              label="Complemento"
              fullWidth
              value={form.complement}
              onChange={(e) => handleChange('complement', e.target.value)}
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
