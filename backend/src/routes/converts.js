const express = require('express');
const { query } = require('../config/database');
const { requireAuth } = require('../middleware/auth');
const {
  checkAndUpdateExpiredConverts,
  getCurrentWeek,
} = require('../utils/simplePeriods');

const router = express.Router();

function toDateString(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

const MONTHS_RU = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

function formatRuDate(date) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const monthName = MONTHS_RU[d.getMonth()] || MONTHS_RU[8];
  return `${d.getDate()} ${monthName}`;
}

router.get('/converts', requireAuth, async (req, res) => {
  try {
    await checkAndUpdateExpiredConverts(req.userId);

    const converts = await query(
      `SELECT
        id, convert_type, convert_name, current_amount,
        limit_amount, target_amount, one_transfer, next_transfer,
        period_start, period_end, is_complete
      FROM converts
      WHERE user_id = ? AND is_active = 1
      ORDER BY CASE convert_type
        WHEN 'necessary' THEN 1
        WHEN 'desire' THEN 2
        WHEN 'saving' THEN 3
        WHEN 'investment' THEN 4
        ELSE 5
      END, convert_name`,
      [req.userId]
    );

    const formatted = converts.map((convert) => ({
      id: convert.id,
      convert_type: convert.convert_type,
      convert_name: convert.convert_name,
      current_amount: Number(convert.current_amount || 0),
      limit_amount: convert.limit_amount !== null ? Number(convert.limit_amount) : null,
      target_amount: convert.target_amount !== null ? Number(convert.target_amount) : null,
      one_transfer: convert.one_transfer !== null ? Number(convert.one_transfer) : null,
      next_transfer: toDateString(convert.next_transfer),
      period_start: toDateString(convert.period_start),
      period_end: toDateString(convert.period_end),
      is_complete: convert.is_complete === 1 || convert.is_complete === true,
    }));

    return res.json(formatted);
  } catch (error) {
    console.error('Failed to fetch converts', error);
    return res.status(500).json({ message: `Ошибка БД: ${error.message}` });
  }
});

router.get('/converts-info', requireAuth, async (req, res) => {
  try {
    const stats = await query(
      `SELECT
        COALESCE(SUM(limit_amount), 0) AS weekly_budget,
        COALESCE(SUM(current_amount), 0) AS current_budget,
        MIN(period_start) AS period_start,
        MAX(period_end) AS period_end
       FROM converts
       WHERE user_id = ?
         AND convert_type IN ('necessary', 'desire')
         AND is_active = 1
         AND limit_amount IS NOT NULL`,
      [req.userId]
    );

    const info = stats[0] || {};
    const weeklyBudget = Number(info.weekly_budget || 0);
    const currentBudget = Number(info.current_budget || 0);
    const percentage = weeklyBudget > 0
      ? Math.round((currentBudget / weeklyBudget) * 1000) / 10
      : 0;

    let periodStartStr = formatRuDate(info.period_start);
    let periodEndStr = formatRuDate(info.period_end);

    if (!periodStartStr || !periodEndStr) {
      const currentWeek = getCurrentWeek();
      periodStartStr = formatRuDate(currentWeek.start);
      periodEndStr = formatRuDate(currentWeek.end);
    }

    return res.json({
      weekly_budget: weeklyBudget,
      current_budget: currentBudget,
      percentage,
      period_start: periodStartStr,
      period_end: periodEndStr,
    });
  } catch (error) {
    console.error('Failed to fetch converts info', error);
    return res.status(500).json({ message: `Ошибка БД: ${error.message}` });
  }
});

module.exports = router;
