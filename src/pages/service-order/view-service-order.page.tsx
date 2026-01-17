import {
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrderService } from '../../core/api/service-order.service';
import type { ServiceOrder } from '../../core/models/service-order.interface';
import { generateServiceOrderPDF } from '../../core/pdf/generate-service-order';
import { ClientInfo } from './components/client-info';
import { formatCNPJ } from '../../core/utils/string.util';

/* =========================
   PAGE
========================= */

export function ViewServiceOrderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [serviceOrder, setServiceOrder] = useState<ServiceOrder | null>(null);

  useEffect(() => {
    async function loadServiceOrder() {
      const { data } = await OrderService.find(id);

      setServiceOrder(data);
    }

    loadServiceOrder();
  }, [id]);

  if (!serviceOrder) {
    return <div>loading...</div>;
  }

  const totalValue = serviceOrder.products.reduce(
    (acc, item) => acc + item.value,
    0,
  );

  function handleEdit() {
    navigate('/service-orders/edit/' + serviceOrder.id_service_order);
  }

  async function handleGeneratePDF() {
    if (!serviceOrder) return;

    await generateServiceOrderPDF(serviceOrder);
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
          {serviceOrder.company && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center">
              <img
                src={serviceOrder.company.logo_url}
                alt="Logo"
                height={imgConfig}
                width={imgConfig}
                style={{ borderRadius: '50%' }}
              />

              <Box textAlign="right">
                <Typography variant="h4">
                  {serviceOrder.company.name}
                </Typography>
                <Typography variant="body2">
                  {serviceOrder.company.street}, {serviceOrder.company.number}
                </Typography>
                <Typography variant="body2">
                  CEP: {serviceOrder.company.cep}
                </Typography>
                <Typography variant="body2">
                  CNPJ: {formatCNPJ(serviceOrder.company.document)}
                </Typography>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* SERVICE DESCRIPTION */}
          <Typography variant="h6">Descrição do Serviço</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mt: 1 }}>
            {serviceOrder.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* ITEMS TABLE */}
          <Typography variant="h6" gutterBottom>
            Itens do Serviço
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Qtd</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Valor Unit.</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {serviceOrder.products.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>R$ {item.value}</TableCell>
                  <TableCell>
                    R$ {(item.value * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Divider sx={{ my: 3 }} />

          {/* TOTAL */}
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Typography variant="h5">
              Total: R$ {totalValue.toFixed(2)}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {serviceOrder.client && (
            <ClientInfo client={serviceOrder.client} hideChange />
          )}
        </Box>

        {/* FOOTER */}

        <Box
          sx={{ width: '100%', gap: 1 }}
          display="flex"
          justifyContent="flex-end"
          mt={3}>
          <Button variant="outlined" onClick={handleEdit}>
            Editar
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleGeneratePDF}>
            Exportar PDF
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
