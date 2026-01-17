import moment from 'moment';
import type { ServiceOrder } from '../models/service-order.interface';
import { formatCNPJ, formatDocument } from '../utils/string.util';

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
  const total = order.products.reduce(
    (acc, i) => acc + i.quantity * i.value,
    0,
  );

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>Registro de Ordem de Serviço</title>

<style>
@page {
  size: A4;
  margin: 15mm;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 11px;
  color: #000;
}

h1 {
  font-size: 14px;
  margin: 0;
  text-align: center;
  text-transform: uppercase;
}

.box {
  border: 1px solid #000;
  padding: 6px 8px;
  margin-top: 8px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.col {
  flex: 1;
}

.label {
  font-weight: bold;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  width: 90px;
}

.os-info {
  border: 1px solid #000;
  padding: 6px 10px;
  text-align: center;
  font-size: 10px;
}

.os-info strong {
  display: block;
  margin-top: 4px;
  font-size: 12px;
}

.section-title {
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
  text-transform: uppercase;
}

.text-area {
  min-height: 50px;
}

.budget-row {
  display: flex;
  justify-content: space-between;
}

.total {
  font-weight: bold;
}

.signatures {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.signature {
  width: 45%;
  text-align: center;
}

.signature-line {
  border-top: 1px solid #000;
  margin-top: 40px;
  padding-top: 4px;
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
</style>
</head>

<body>

<!-- HEADER -->
<div class="header">
  <div>
    <!-- opcional: logo -->
    <strong>${order.company?.name}</strong><br />
    CNPJ: ${formatCNPJ(order.company?.document)}
  </div>

  <h1>Registro de Ordem de Serviço</h1>

  <div class="os-info">
    O.S Nº
    <strong>${order.id_service_order}</strong>
    Data de abertura:
    <strong>${moment(order.created_at)
      .local()
      .format('DD/MM/YYYY HH:mm')}</strong>
  </div>
</div>

<!-- CLIENT -->
<div class="section-title">Dados do Cliente</div>
<div class="box">
  <div class="row">
    <div class="col"><span class="label">Nome:</span> ${
      order.client?.name
    }</div>
    <div class="col"><span class="label">CPF/CNPJ:</span> ${formatDocument(
      order.client?.document,
    )}</div>
  </div>

  <div class="row">
    <div class="col"><span class="label">Endereço:</span> ${
      order.client?.street ?? '-'
    } ${order.client?.number}</div>
    <div class="col"><span class="label">Telefone:</span> ${
      order.client?.phone ?? '-'
    }</div>
  </div>
</div>

<!-- PRODUCT -->
<div class="section-title">Produtos</div>


          
      <table class="table">
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

<!-- DIAGNOSIS -->
<div class="section-title">Diagnóstico e Serviço a ser Prestado</div>
<div class="box text-area">
  ${order.description}
</div>

<!-- WARRANTY -->
<div class="section-title">Garantia e Observações</div>
<div class="box">
  3 meses de garantia do serviço e peças contadas da data de entrega desta OS.
</div>

<!-- BUDGET -->
<div class="section-title">Orçamento</div>
<div class="box">
  <div class="budget-row">
    <span>Valor total</span>
    <span class="total">R$ ${total.toFixed(2)}</span>
  </div>
</div>

<!-- SIGNATURES -->
<div class="signatures">
  <div class="signature">
    <div class="signature-line">Assinatura do Cliente</div>
  </div>

  <div class="signature">
    <div class="signature-line">Assinatura Responsável Técnico</div>
  </div>
</div>

</body>
</html>
`;
}
