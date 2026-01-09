import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function DashboardPage() {
  const navigate = useNavigate();

  function handleNewServiceOrder() {
    navigate("/service-order/new");
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleNewServiceOrder}
      >
        Nova Ordem de Serviço
      </Button>
    </Container>
  );
}