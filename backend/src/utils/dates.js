import { MONTHS_RU } from './constants.js';

function formatRuDate(date) {
  if (!date) {
    return null;
  }

  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const monthName = MONTHS_RU[parsed.getMonth()] || MONTHS_RU[0];
  return `${parsed.getDate()} ${monthName}`;
}

function formatDateShort(date) {
  if (!date) {
    return null;
  }

  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = String(parsed.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export { formatRuDate, formatDateShort };
