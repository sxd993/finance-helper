const { query } = require('../config/database');

function getCurrentWeek() {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day; // adjust so Monday is day 1

  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() + diff);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: monday,
    end: sunday,
  };
}

async function checkAndUpdateExpiredConverts(userId) {
  const currentWeek = getCurrentWeek();

  const whereParts = [
    "convert_type IN ('necessary', 'desire')",
    'limit_amount IS NOT NULL',
    'is_active = 1',
    '(period_end IS NULL OR period_end < CURDATE())',
  ];

  const params = [currentWeek.start, currentWeek.end];

  if (userId) {
    whereParts.push('user_id = ?');
    params.push(userId);
  }

  const updateSql = `
    UPDATE converts
    SET
      current_amount = limit_amount,
      period_start = ?,
      period_end = ?,
      updated_at = NOW()
    WHERE ${whereParts.join(' AND ')}
  `;

  const result = await query(updateSql, params);
  const updatedConverts = result.affectedRows || 0;

  return {
    updatedConverts,
    currentPeriod: currentWeek,
  };
}

function createConvertWithPeriod(userId, convertData) {
  const updatedData = { ...convertData };
  const currentWeek = getCurrentWeek();
  const { start, end } = currentWeek;

  if (['necessary', 'desire'].includes(convertData.convert_type)) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const daysLeft = Math.max(0, Math.round((end - now) / (1000 * 60 * 60 * 24))) + 1;
    const weeklyLimit = Number(convertData.limit_amount || 0);
    const currentAmount = (weeklyLimit / 7) * daysLeft;

    updatedData.current_amount = Number.isFinite(currentAmount)
      ? Math.round(currentAmount * 100) / 100
      : 0;
    updatedData.period_start = start;
    updatedData.period_end = end;
  }

  return updatedData;
}

module.exports = {
  getCurrentWeek,
  checkAndUpdateExpiredConverts,
  createConvertWithPeriod,
};
