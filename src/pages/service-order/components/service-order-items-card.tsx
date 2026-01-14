import {
  Box,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ServiceOrderItem } from '../../../core/models/service-order.interface';

type Props = {
  items: ServiceOrderItem[];
  updateItem: (
    id: string,
    field: keyof ServiceOrderItem,
    value: string | number,
  ) => void;
  removeRow: (id: string) => void;
};

export function ServiceOrderItemsCards({
  items,
  updateItem,
  removeRow,
}: Props) {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {items.map((item, index) => (
        <Card key={item.id} variant="outlined">
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle1">Item {index + 1}</Typography>

              <IconButton
                size="small"
                color="error"
                onClick={() => removeRow(item.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>

            <TextField
              fullWidth
              label="Descrição"
              value={item.description}
              onChange={(e) =>
                updateItem(item.id, 'description', e.target.value)
              }
              sx={{ mt: 2 }}
            />

            <Box display="flex" gap={2} mt={2}>
              <TextField
                label="Qtd"
                type="number"
                fullWidth
                value={item.quantity}
                onChange={(e) =>
                  updateItem(item.id, 'quantity', Number(e.target.value))
                }
              />

              <TextField
                label="Valor"
                type="number"
                fullWidth
                value={item.value}
                onChange={(e) =>
                  updateItem(item.id, 'value', Number(e.target.value))
                }
              />
            </Box>

            <TextField
              label="Total"
              fullWidth
              disabled
              value={item.total.toFixed(2)}
              sx={{ mt: 2 }}
            />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
