import type { ServiceOrder } from '../core/models/service-order.interface';

export function serviceOrderPdfTemplate(order: ServiceOrder): string {
  const items = order.products
    .map(
      (item) => `
        <tr>
          <td>${item.quantity}</td>
          <td>${item.description}</td>
          <td>R$ ${item.value.toFixed(2)}</td>
          <td>R$ ${(item.quantity * item.value).toFixed(2)}</td>
        </tr>
      `,
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Ordem de Serviço</title>
  <link rel="stylesheet" href="service-order-pdf.css" />
</head>
<style>
@page {
  size: A4;
  margin: 20mm;
}

body {
  font-family: Arial, sans-serif;
  font-size: 12px;
  color: #000;
}

.page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 32px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header img {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

h1 {
  margin: 0;
  font-size: 20px;
}

h2 {
  margin-top: 24px;
  font-size: 16px;
}

.description {
  white-space: pre-line;
}

.table{
    flex: 1;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
}

table th,
table td {
  border: 1px solid #000;
  padding: 6px;
  text-align: left;
}

.total {
  margin-top: 20px;
  text-align: right;
  font-size: 16px;
}

.signature {
  margin-top: 40px;
  border-top: 1px solid #000;
  width: 60%;
  padding-top: 4px;
}

</style>
<body>
  <div class="page">

    <header class="header">
      <div>
        <h1>${order.company?.name}</h1>
        <p>${order.company?.street}, ${order.company?.number}</p>
        <p>CEP: ${order.company?.cep}</p>
        <p>CNPJ: ${order.company?.document}</p>
      </div>

    </header>

    <section>
      <h2>Descrição do Serviço</h2>
      <p class="description">${order.description}</p>
    </section>

    <section class="table">
      <h2>Itens</h2>
      <table>
        <thead>
          <tr>
            <th>Qtd</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${items}
        </tbody>
      </table>
    </section>

    <section class="total">
      <strong>Total: R$ ${order.products
        .reduce((acc, i) => acc + i.quantity * i.value, 0)
        .toFixed(2)}</strong>
    </section>

    <footer>
      <p>Cliente: ${order.client?.name}</p>

      <div class="signature">
        <span>Assinatura do Cliente</span>
      </div>
    </footer>

  </div>
</body>
</html>
`;
}
