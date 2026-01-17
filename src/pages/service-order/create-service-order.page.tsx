import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { OrderService } from '../../core/api/service-order.service';
import { useCompany } from '../../core/contexts/compnay.context';
import { useSnackbar } from '../../core/contexts/snackbar.context';
import type { Client } from '../../core/models/client.interface';
import type {
  ServiceOrder,
  ServiceOrderItem,
} from '../../core/models/service-order.interface';
import { ClientInfo } from './components/client-info';
import { ServiceOrderItemsCards } from './components/service-order-items-card';
import { ServiceOrderItemsTable } from './components/service-order-items-table';

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
  const { company: decodedCompany } = useCompany();

  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [description, setDescription] = useState('');
  const [company, setCompany] = useState(decodedCompany);

  const [client, setClient] = useState<Client | null>(null);
  const [items, setItems] = useState<ServiceOrderItem[]>([
    { ...emptyRow, id: uuid() },
    { ...emptyRow, id: uuid() },
    { ...emptyRow, id: uuid() },
  ]);

  const isEditting = useMemo(() => !!id, [id]);

  useEffect(() => {
    if (id) {
      async function loadServiceOrder() {
        const { data } = await OrderService.find(id);

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

  function cancelEdit() {
    navigate('/service-orders/view/' + id);
  }

  async function createServiceOrder() {
    const payload = {
      description,
      id_client: client?.id_client,
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
        const response = await OrderService.update(id, payload);
        snackbar.success('Atualizado com sucesso.');

        navigate('/service-orders/view/' + response.data.id_service_order);
      } catch (e) {
        snackbar.error(e);
      }
    } else {
      try {
        const { data } = await OrderService.create<ServiceOrder>(payload);

        snackbar.success(
          'OS #' + data.id_service_order + ' criada com sucesso.',
        );

        navigate('/service-orders/view/' + data.id_service_order);
      } catch (e) {
        snackbar.error(e);
      }
    }
  }

  /* =========================
     RENDER
  ========================= */

  const imgConfig = isMobile ? 80 : 160;

  return (
    <Box justifyContent="center" display="flex">
      <Box sx={{ maxWidth: '900px', flex: 1 }}>
        <Box>
          {/* HEADER */}
          {company && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center">
              <Box>
                <img
                  src={company.logo_url}
                  alt="Logo"
                  height={imgConfig}
                  width={imgConfig}
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

          {isMobile ? (
            <ServiceOrderItemsCards
              items={items}
              updateItem={updateItem}
              removeRow={removeRow}
            />
          ) : (
            <ServiceOrderItemsTable
              items={items}
              updateItem={updateItem}
              removeRow={removeRow}
            />
          )}

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

          <ClientInfo
            client={client}
            hideChange={isEditting}
            onChange={(c) => setClient(c)}
          />
        </Box>

        <Box display="flex" flex="1">
          <Box
            display="flex"
            justifyContent="flex-end"
            marginTop={2}
            flex={1}
            gap={1}>
            {id && (
              <Button variant="contained" onClick={cancelEdit}>
                Cancelar
              </Button>
            )}
            <Button
              variant="contained"
              color="success"
              onClick={createServiceOrder}>
              {id ? 'Atualizar' : 'Efetivar'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
