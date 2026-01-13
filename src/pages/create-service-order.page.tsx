import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import api from '../api/axios';
import { serviceOrderService } from '../api/service-order.service';
import { ClientInfo } from '../components/client-info';
import type { Company } from '../models/company.interface';
import type {
  ServiceOrder,
  ServiceOrderItem,
} from '../models/service-order.interface';
import { useSnackbar } from '../contexts/snackbar.context';

/* =========================
   TYPES
========================= */

type Column = {
  key: keyof ServiceOrderItem;
  label: string;
  width?: number;
  type?: 'text' | 'number';
  disabled?: boolean;
};

/* =========================
   COLUMNS CONFIG
========================= */

const columns: Column[] = [
  { key: 'quantity', label: 'Qtd', width: 100, type: 'number' },
  { key: 'description', label: 'Descrição', type: 'text' },
  { key: 'value', label: 'Valor Unit.', width: 120, type: 'number' },
  // { key: 'discount', label: 'Desconto', width: 120, type: 'number' },
  { key: 'total', label: 'Total', width: 120, type: 'number', disabled: true },
];

/* =========================
   INITIAL ROW
========================= */

const emptyRow: ServiceOrderItem = {
  id: '',
  quantity: 1,
  description: '',
  value: 0,
  // discount: 0,
  total: 0,
};

/* =========================
   PAGE
========================= */

export function ServiceOrderPage() {
  const { id } = useParams();
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [company, setCompany] = useState(null);
  const [client, setClient] = useState(null);
  const [items, setItems] = useState<ServiceOrderItem[]>([
    { ...emptyRow, id: uuid() },
    { ...emptyRow, id: uuid() },
    { ...emptyRow, id: uuid() },
    { ...emptyRow, id: uuid() },
    { ...emptyRow, id: uuid() },
    { ...emptyRow, id: uuid() },
    { ...emptyRow, id: uuid() },
    { ...emptyRow, id: uuid() },
  ]);

  useEffect(() => {
    if (id) {
      async function loadServiceOrder() {
        const { data } = await serviceOrderService.find(id);

        setDescription(data.description);
        setCompany(data.company);
        setClient(data.client);

        setItems((items) => {
          return items.map((item, index) => {
            const product = data.products[index];

            if (!product) return item;

            return {
              id: item.id,
              description: product.description,
              value: product.value,
              quantity: product.quantity,
              total: product.quantity * product.value,
            } as ServiceOrderItem;
          });
        });
      }

      loadServiceOrder();
    } else {
      const getCompanies = async () => {
        const result = await api.get<Company[]>('/companies');

        if (result.data.length > 0) {
          setCompany(result.data[0]);
        }
      };
      getCompanies();
    }
  }, [id]);

  /* =========================
     HELPERS
  ========================= */

  function calculateRow(row: ServiceOrderItem): ServiceOrderItem {
    const subtotal = row.quantity * row.value;
    // const total = subtotal - row.discount;
    const total = subtotal;

    return {
      ...row,
      total,
    };
  }

  function updateItem(
    id: string,
    field: keyof ServiceOrderItem,
    value: string | number,
  ) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? calculateRow({ ...item, [field]: value }) : item,
      ),
    );
  }

  function addRow() {
    setItems((prev) => [...prev, { ...emptyRow, id: uuid() }]);
  }

  function removeRow(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  const totalServiceOrder = items.reduce((acc, item) => acc + item.total, 0);
  // const totalDiscountServiceOrder = items.reduce(
  //   (acc, item) => acc + item.discount,
  //   0,
  // );

  async function createServiceOrder() {
    const payload = {
      description,
      id_client: 1,
      id_company: company?.id_company,
      products: items
        .filter(
          (item) =>
            !!item.description &&
            item.quantity > 0 &&
            !!item.value &&
            item.value > 0,
        )
        .map((item) => ({
          quantity: item.quantity,
          description: item.description,
          value: item.value,
        })),
    };
    if (id) {
      try {
        const response = await serviceOrderService.update(id, payload);
        snackbar.success('Atualizado com sucesso.');

        navigate('/service-orders/view/' + response.data.id_service_order);
      } catch (e) {
        snackbar.error(e);
      }
    } else {
      try {
        const response = await serviceOrderService.create<ServiceOrder>(
          payload,
        );

        snackbar.success('OS ' + response.data.code + ' criada com sucesso.');

        navigate('/service-orders/view/' + response.data.id_service_order);
      } catch (e) {
        snackbar.error(e);
      }
    }
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <Box sx={{ mb: 6 }} justifyContent="center" display="flex">
      <Box sx={{ mb: 6, maxWidth: '900px' }}>
        <Box sx={{ p: 4 }}>
          {/* HEADER */}
          {company && (
            <Box display="flex" justifyContent="space-between">
              <Box>
                <img
                  src={company.logo_url}
                  alt="Logo"
                  height={220}
                  width={220}
                  style={{ borderRadius: '50%' }}
                />
              </Box>

              <Box textAlign="right">
                <Typography variant="h4">{company.name}</Typography>
                <Typography variant="body2">
                  {company.street}, {company.number}
                </Typography>
                <Typography variant="body2">CEP: {company.cep}</Typography>
                <Typography variant="body2">
                  CNPJ: {company.document}
                </Typography>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* SERVICE DESCRIPTION */}
          <Typography variant="h6" gutterBottom>
            Descrição do Serviço
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={4}
            placeholder="Descreva o serviço a ser realizado"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Divider sx={{ my: 3 }} />

          {/* ITEMS TABLE */}
          <Typography variant="h6" gutterBottom>
            Itens do Serviço
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.key} width={col.width}>
                    {col.label}
                  </TableCell>
                ))}
                <TableCell width={40} />
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <TextField
                        size="small"
                        fullWidth
                        type={col.type}
                        disabled={col.disabled}
                        value={row[col.key]}
                        onChange={(e) =>
                          updateItem(
                            row.id,
                            col.key,
                            col.type === 'number'
                              ? Number(e.target.value)
                              : e.target.value,
                          )
                        }
                      />
                    </TableCell>
                  ))}

                  <TableCell>
                    <IconButton onClick={() => removeRow(row.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button onClick={addRow} sx={{ mt: 2 }}>
            Adicionar Item
          </Button>

          <Divider sx={{ my: 3 }} />

          {/* TOTAL */}
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            alignContent="flex-end"
            alignItems="flex-end">
            {/* <Typography variant="h5">
              Desconto: R$ {totalDiscountServiceOrder.toFixed(2)}
            </Typography> */}
            <Typography variant="h5">
              Total: R$ {totalServiceOrder.toFixed(2)}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <ClientInfo client={client} />
        </Box>

        <Box display="flex" flex="1">
          <Box display="flex" justifyContent="flex-end" marginTop={2} flex={1}>
            <Button variant="contained" onClick={createServiceOrder}>
              {id ? 'Atualizar' : 'Efetivar'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
