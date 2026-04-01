export const roundMoney = (value) => Number(Number(value || 0).toFixed(2));

export const buildRemaindersSummary = (rows) => ({
  total_amount: roundMoney(
    rows.reduce((sum, row) => sum + Number(row.amount || 0), 0)
  ),
  items_count: rows.length,
});
