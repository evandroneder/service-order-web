import DeleteIcon from '@mui/icons-material/Delete';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import type { ServiceOrderItem } from '../models/service-order.interface';

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

type Props = {
  items: ServiceOrderItem[];
  updateItem: (
    id: string,
    field: keyof ServiceOrderItem,
    value: string | number,
  ) => void;
  removeRow: (id: string) => void;
};

export function ServiceOrderItemsTable({
  items,
  updateItem,
  removeRow,
}: Props) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableCell key={col.key}>{col.label}</TableCell>
          ))}
          <TableCell />
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
  );
}
