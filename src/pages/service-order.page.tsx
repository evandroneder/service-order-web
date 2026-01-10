import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { ClientInfo } from '../components/client-info';

/* =========================
   TYPES
========================= */

type ServiceOrderItem = {
  id: string;
  quantity: number;
  description: string;
  unitValue: number;
  discount: number;
  total: number;
};

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
  { key: 'unitValue', label: 'Valor Unit.', width: 120, type: 'number' },
  { key: 'discount', label: 'Desconto', width: 120, type: 'number' },
  { key: 'total', label: 'Total', width: 120, type: 'number', disabled: true },
];

/* =========================
   INITIAL ROW
========================= */

const emptyRow: ServiceOrderItem = {
  id: '',
  quantity: 1,
  description: '',
  unitValue: 0,
  discount: 0,
  total: 0,
};

/* =========================
   PAGE
========================= */

export function ServiceOrderPage() {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [description, setDescription] = useState('');
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

  /* =========================
     HELPERS
  ========================= */

  function calculateRow(row: ServiceOrderItem): ServiceOrderItem {
    const subtotal = row.quantity * row.unitValue;
    const total = subtotal - row.discount;

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
  const totalDiscountServiceOrder = items.reduce(
    (acc, item) => acc + item.discount,
    0,
  );

  async function handleGeneratePDF() {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current, {
      scale: 2, // melhora qualidade
    });

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
    <Paper sx={{ mb: 6, p: 4 }}>
      <Paper sx={{ p: 4 }} ref={pdfRef}>
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between">
          <Box>
            <img src="/logo.png" alt="Logo" height={60} />
          </Box>

          <Box textAlign="right">
            <Typography variant="h6">Empresa Exemplo LTDA</Typography>
            <Typography variant="body2">Rua Exemplo, 123 - Centro</Typography>
            <Typography variant="body2">CEP 00000-000</Typography>
            <Typography variant="body2">CNPJ: 00.000.000/0001-00</Typography>
          </Box>
        </Box>

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
          <Typography variant="h6" fontSize={16}>
            Desconto: R$ {totalDiscountServiceOrder.toFixed(2)}
          </Typography>
          <Typography variant="h5">
            Total: R$ {totalServiceOrder.toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <ClientInfo />
      </Paper>

      <Box display="flex" flex="1">
        <Box display="flex" justifyContent="flex-start" marginTop={2}>
          <Button>Dashboard</Button>
        </Box>

        <Box display="flex" justifyContent="flex-start" marginTop={2}>
          <Button>Ordens de serviço</Button>
        </Box>

        <Box display="flex" justifyContent="flex-end" marginTop={2} flex={1}>
          <Button variant="contained" onClick={handleGeneratePDF}>
            Exportar PDF
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
