import {
  Box,
  Button,
  Container,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { serviceOrderService } from '../api/service-order.service';
import { ClientInfo } from '../components/client-info';
import type { ServiceOrder } from '../models/service-order.interface';
import moment from 'moment';

/* =========================
   PAGE
========================= */

export function ViewServiceOrderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const pdfRef = useRef<HTMLDivElement>(null);

  const [serviceOrder, setServiceOrder] = useState<ServiceOrder | null>(null);

  useEffect(() => {
    async function loadServiceOrder() {
      const { data } = await serviceOrderService.find(id);

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
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    const fileName = serviceOrder.client.name.replaceAll(' ', '_');
    const today = moment().format('DD/MM/YYYY');
    pdf.save(`${fileName}_${today}_OS.pdf`);
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <Container maxWidth={'md'} sx={{ mb: 6 }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ p: 4, width: '100%' }} ref={pdfRef}>
          {/* HEADER */}
          {serviceOrder.company && (
            <Box display="flex" justifyContent="space-between">
              <img
                src={serviceOrder.company.logo_url}
                alt="Logo"
                height={160}
                width={160}
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
                  CNPJ: {serviceOrder.company.document}
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
          sx={{ p: 4, width: '100%' }}
          display="flex"
          justifyContent="flex-end"
          mt={3}>
          <Button variant="contained" onClick={handleEdit}>
            Editar
          </Button>
        </Box>
        <Box
          sx={{ p: 4, width: '100%' }}
          display="flex"
          justifyContent="flex-end"
          mt={3}>
          <Button variant="contained" onClick={handleGeneratePDF}>
            Exportar PDF
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
