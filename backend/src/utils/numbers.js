function toNumber(value) {
  if (typeof value === 'number') {
    return value;
  }

  if (value === null || value === undefined || value === '') {
    return 0;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

module.exports = {
  toNumber,
};
