import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderService } from '../../core/api/service-order.service';

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
      const { data } = await OrderService.findAll();
      setOrders(data);
      setLoading(false);
    }

    loadOrders();
  }, []);

  function handleView(id: number) {
    navigate(`/service-orders/view/${id}`);
  }

  function handleEdit(id: number) {
    navigate(`/service-orders/edit/${id}`);
  }

  return (
    <Box>
      <Box>
        <Typography variant="h4">Ordens de Serviço</Typography>
      </Box>

      <Box>
        <Table>
          {/* HEADER — apenas desktop */}
          <TableHead sx={{ display: { xs: 'none', md: 'table-header-group' } }}>
            <TableRow>
              <TableCell>OS</TableCell>
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
              <TableRow
                key={order.id_service_order}
                sx={{
                  display: { xs: 'block', md: 'table-row' },
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  mb: { xs: 2, md: 0 },
                  p: { xs: 2, md: 0 },
                }}>
                {/* ID */}
                <TableCell sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                  {/* Mobile */}
                  <Typography
                    variant="body2"
                    sx={{ display: { xs: 'block', md: 'none' } }}>
                    <strong>OS #</strong> {order.id_service_order}
                  </Typography>

                  {/* Desktop */}
                  <Typography
                    variant="body2"
                    sx={{ display: { xs: 'none', md: 'block' } }}>
                    {order.id_service_order}
                  </Typography>
                </TableCell>

                {/* DESCRIPTION */}
                <TableCell sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                  {/* Mobile */}
                  <Typography
                    variant="body2"
                    sx={{ display: { xs: 'block', md: 'none' } }}>
                    <strong>Descrição:</strong> {order.description}
                  </Typography>

                  {/* Desktop */}
                  <Typography
                    variant="body2"
                    sx={{ display: { xs: 'none', md: 'block' } }}>
                    {order.description}
                  </Typography>
                </TableCell>

                {/* COMPANY */}
                <TableCell sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                  <Typography
                    variant="body2"
                    sx={{ display: { xs: 'block', md: 'none' } }}>
                    <strong>Empresa:</strong> {order.company_name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ display: { xs: 'none', md: 'block' } }}>
                    {order.company_name}
                  </Typography>
                </TableCell>

                {/* CLIENT */}
                <TableCell sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                  <Typography
                    variant="body2"
                    sx={{ display: { xs: 'block', md: 'none' } }}>
                    <strong>Cliente:</strong> {order.client_name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ display: { xs: 'none', md: 'block' } }}>
                    {order.client_name}
                  </Typography>
                </TableCell>

                {/* TOTAL */}
                <TableCell
                  align="right"
                  sx={{ display: { xs: 'block', md: 'table-cell' } }}>
                  <Typography
                    sx={{
                      display: { xs: 'block', md: 'none' },
                      fontWeight: 600,
                    }}>
                    <strong>Total:</strong> R$ {order.total.toFixed(2)}
                  </Typography>

                  <Typography
                    sx={{
                      display: { xs: 'none', md: 'block' },
                      fontWeight: 600,
                    }}>
                    R$ {order.total.toFixed(2)}
                  </Typography>
                </TableCell>

                {/* ACTIONS */}
                <TableCell
                  align="center"
                  sx={{
                    display: { xs: 'flex', md: 'table-cell' },
                    justifyContent: { xs: 'flex-end', md: 'center' },
                    gap: 1,
                    mt: { xs: 1, md: 0 },
                  }}>
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
      </Box>
    </Box>
  );
}
