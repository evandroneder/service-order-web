import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceOrderService } from '../api/service-order.service';

/* =========================
   TYPES (DTO)
========================= */

interface ServiceOrderListDTO {
  id_service_order: number;
  description: string;
  company_name: string;
  client_name: string;
  total: number;
}

/* =========================
   PAGE
========================= */

export function ServiceOrderListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<ServiceOrderListDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      const { data } = await serviceOrderService.findAll();
      setOrders(data);
      setLoading(false);
    }

    loadOrders();
  }, []);

  /* =========================
     HANDLERS
  ========================= */

  function handleView(id: number) {
    navigate(`/service-orders/view/${id}`);
  }

  function handleEdit(id: number) {
    navigate(`/service-orders/edit/${id}`);
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 4 }}>
        <Typography variant="h4">Ordens de Serviço</Typography>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Empresa</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading && orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhuma ordem de serviço encontrada
                </TableCell>
              </TableRow>
            )}

            {orders.map((order) => (
              <TableRow key={order.id_service_order}>
                <TableCell>{order.id_service_order}</TableCell>

                <TableCell>{order.description}</TableCell>

                <TableCell>{order.company_name}</TableCell>

                <TableCell>{order.client_name}</TableCell>

                <TableCell align="right">R$ {order.total.toFixed(2)}</TableCell>

                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleView(order.id_service_order)}>
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton
                    color="secondary"
                    onClick={() => handleEdit(order.id_service_order)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
