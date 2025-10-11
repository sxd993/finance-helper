export function formatPrice(value: number | undefined): string | null {
  if (value === undefined) {
    return null
  }
  return value.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  });
}

