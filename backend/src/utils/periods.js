function getCurrentMonthPeriod(referenceDate = new Date()) {
  const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

module.exports = {
  getCurrentMonthPeriod,
};
