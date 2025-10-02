const { MONTHS_RU } = require('./constants');

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

module.exports = {
  formatRuDate,
};
