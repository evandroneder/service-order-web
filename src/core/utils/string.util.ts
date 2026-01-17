export function formatCPF(value: string) {
  if (!value) return '';
  return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

export function formatCNPJ(value: string) {
  if (!value) return '';
  return value.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5',
  );
}

export function formatDocument(value: string): string {
  if (!value) return '';

  const digits = value.replace(/\D/g, '');

  // CPF → 11 dígitos
  if (digits.length <= 11) {
    return formatCPF(value);
  }
  return formatCNPJ(value);
}

export function formatPhone(value: string) {
  if (!value) return '';
  return value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
}

export function formatCEP(value: string): string {
  if (!value) return '';

  return value.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2');
}
