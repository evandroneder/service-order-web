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
} from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { serviceOrderService } from '../api/service-order.service';

/* =========================
   TYPES
========================= */

interface Company {
  id_company: number;
  name: string;
  document: string;
  phone: string;
  cep: string;
  street: string;
  number: number;
  complement?: string;
  email: string;
  logo_url?: string;
}

// interface Client {
//   name: string;
//   document: string;
//   phone: string;
// }

type ServiceOrderItem = {
  id: string;
  quantity: number;
  description: string;
  unitValue: number;
  discount: number;
  total: number;
};

/* =========================
   PAGE
========================= */

export function ViewServiceOrderPage() {
  const { id } = useParams();
  const pdfRef = useRef<HTMLDivElement>(null);

  const [company, setCompany] = useState<Company | null>(null);
  //   const [client, setClient] = useState<Client | null>(null);
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<ServiceOrderItem[]>([]);

  useEffect(() => {
    async function loadServiceOrder() {
      const { data } = await serviceOrderService.find(id);

      setCompany(data.company);
      //   setClient(data.client);
      setDescription(data.description);
      setItems(data.items);
    }

    loadServiceOrder();
  }, [id]);

  const totalDiscount = items.reduce((acc, item) => acc + item.discount, 0);
  const totalValue = items.reduce((acc, item) => acc + item.total, 0);

  async function handleGeneratePDF() {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('ordem-de-servico.pdf');
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <Box sx={{ mb: 6, p: 4 }} display="flex" justifyContent="center">
      <Box sx={{ p: 4, maxWidth: '900px', width: '100%' }}>
        <Box ref={pdfRef}>
          {/* HEADER */}
          {company && (
            <Box display="flex" justifyContent="space-between">
              <img
                src={company.logo_url}
                alt="Logo"
                height={160}
                width={160}
                style={{ borderRadius: '50%' }}
              />

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
          <Typography variant="h6">Descrição do Serviço</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mt: 1 }}>
            {description}
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
                <TableCell>Desconto</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>R$ {item.unitValue.toFixed(2)}</TableCell>
                  <TableCell>R$ {item.discount.toFixed(2)}</TableCell>
                  <TableCell>R$ {item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Divider sx={{ my: 3 }} />

          {/* TOTAL */}
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Typography>Desconto: R$ {totalDiscount.toFixed(2)}</Typography>
            <Typography variant="h5">
              Total: R$ {totalValue.toFixed(2)}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* {client && <ClientInfo client={client} />} */}
        </Box>

        {/* FOOTER */}
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button variant="contained" onClick={handleGeneratePDF}>
            Exportar PDF
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
