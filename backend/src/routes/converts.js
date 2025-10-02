const express = require('express');
const { query, withTransaction } = require('../config/database');
const { requireAuth } = require('../middleware/auth');
const { getCurrentMonthPeriod } = require('../utils/periods');

const DEFAULT_DISTRIBUTION = {
  necessary: 50,
  desire: 30,
  saving: 10,
  investment: 10,
};

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

const toNumber = (value) => (typeof value === 'number' ? value : Number(value || 0));
const normalizeRows = (result) => (Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result);

const formatRuDate = (date) => {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const monthName = MONTHS_RU[d.getMonth()] || MONTHS_RU[0];
  return `${d.getDate()} ${monthName}`;
};

async function loadEnvelopeTypes(connectionOrQuery) {
  const executor = connectionOrQuery.query
    ? connectionOrQuery.query.bind(connectionOrQuery)
    : connectionOrQuery;

  const result = await executor('SELECT id, code, title, has_limit, accumulates FROM envelope_types');
  const rows = normalizeRows(result).map((row) => ({
    ...row,
    has_limit: row.has_limit === 1 || row.has_limit === true,
    accumulates: row.accumulates === 1 || row.accumulates === true,
  }));

  return {
    rows,
    byCode: new Map(rows.map((row) => [row.code, row])),
  };
}

async function fetchUser(connectionOrQuery, userId, { forUpdate = false } = {}) {
  const lock = forUpdate ? 'FOR UPDATE' : '';
  const executor = connectionOrQuery.query
    ? connectionOrQuery.query.bind(connectionOrQuery)
    : connectionOrQuery;

  const result = await executor(
    `SELECT id, monthly_income, leftover_pool, percent_necessary, percent_desire, percent_saving, percent_investment, distribution_mode, last_reset_at
     FROM users WHERE id = ? ${lock}`,
    [userId]
  );
  const rows = normalizeRows(result);
  return rows[0];
}

const router = express.Router();

router.get('/converts/types', requireAuth, async (req, res) => {
  try {
    const { rows } = await loadEnvelopeTypes(query);
    res.json(rows.map((row) => ({
      id: row.id,
      code: row.code,
      title: row.title,
      has_limit: row.has_limit,
      accumulates: row.accumulates,
    })));
  } catch (error) {
    console.error('Failed to fetch envelope types', error);
    res.status(500).json({ message: 'Ошибка сервера при получении типов конвертов' });
  }
});

router.post('/converts', requireAuth, async (req, res) => {
  const { type_code: typeCode, name, monthly_limit: monthlyLimitInput, target_amount: targetAmountInput } = req.body || {};

  if (!typeCode || !name) {
    return res.status(400).json({ message: 'Требуются тип конверта и название' });
  }

  try {
    const result = await withTransaction(async (connection) => {
      const { byCode } = await loadEnvelopeTypes(connection);
      const typeRow = byCode.get(typeCode);

      if (!typeRow) {
        const err = new Error('Неизвестный тип конверта');
        err.status = 400;
        throw err;
      }

      const monthlyLimit = Math.max(0, toNumber(monthlyLimitInput));
      const targetAmount = targetAmountInput !== undefined && targetAmountInput !== null
        ? Math.max(0, toNumber(targetAmountInput))
        : null;

      const initialAmount = typeRow.accumulates ? 0 : monthlyLimit;

      const [insertResult] = await connection.query(
        `INSERT INTO envelopes (user_id, type_id, name, monthly_limit, current_amount, target_amount)
         VALUES (?, ?, ?, ?, ?, ?)` ,
        [
          req.userId,
          typeRow.id,
          name,
          monthlyLimit,
          initialAmount,
          targetAmount,
        ]
      );

      return {
        id: insertResult.insertId,
        convert_type: typeRow.code,
        convert_name: name,
        limit_amount: monthlyLimit,
        current_amount: initialAmount,
        target_amount: targetAmount,
        type_title: typeRow.title,
        type_has_limit: typeRow.has_limit,
        type_accumulates: typeRow.accumulates,
      };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Failed to create envelope', error);
    if (error.status === 400) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Не удалось создать конверт' });
  }
});

router.get('/converts', requireAuth, async (req, res) => {
  try {
    const rows = await query(
      `SELECT e.id, e.name, e.monthly_limit, e.current_amount, e.target_amount, e.is_active, t.code, t.title, t.has_limit, t.accumulates
       FROM envelopes e
       JOIN envelope_types t ON t.id = e.type_id
       WHERE e.user_id = ? AND e.is_active = 1
       ORDER BY ${"CASE t.code WHEN 'necessary' THEN 1 WHEN 'desire' THEN 2 WHEN 'saving' THEN 3 WHEN 'investment' THEN 4 ELSE 5 END"}, e.name`,
      [req.userId]
    );

    const data = normalizeRows(rows).map((env) => ({
      id: env.id,
      convert_type: env.code,
      convert_name: env.name,
      limit_amount: toNumber(env.monthly_limit),
      current_amount: toNumber(env.current_amount),
      target_amount: env.target_amount !== null ? toNumber(env.target_amount) : null,
      is_active: env.is_active === 1 || env.is_active === true,
      type_title: env.title,
      type_has_limit: env.has_limit === 1 || env.has_limit === true,
      type_accumulates: env.accumulates === 1 || env.accumulates === true,
    }));

    res.json(data);
  } catch (error) {
    console.error('Failed to fetch envelopes', error);
    res.status(500).json({ message: 'Ошибка сервера при получении конвертов' });
  }
});

router.get('/converts-info', requireAuth, async (req, res) => {
  try {
    const { start, end } = getCurrentMonthPeriod();
    const startDate = new Date(start);

    const isSameMonth = (date) => {
      if (!date) return false;
      const dt = new Date(date);
      return dt.getFullYear() === startDate.getFullYear() && dt.getMonth() === startDate.getMonth();
    };

    const userRow = await fetchUser(query, req.userId);
    if (!userRow) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (!userRow.last_reset_at || !isSameMonth(userRow.last_reset_at)) {
      await resetMonth(req.userId);
      const updatedUser = await fetchUser(query, req.userId);
      userRow.leftover_pool = updatedUser.leftover_pool;
      userRow.last_reset_at = updatedUser.last_reset_at;
    }

    const rows = await query(
      `SELECT e.monthly_limit, e.current_amount, t.has_limit, t.accumulates
       FROM envelopes e
       JOIN envelope_types t ON t.id = e.type_id
       WHERE e.user_id = ? AND e.is_active = 1`,
      [req.userId]
    );

    let monthlyBudget = 0;
    let currentBudget = 0;

    normalizeRows(rows).forEach((row) => {
      const hasLimit = row.has_limit === 1 || row.has_limit === true;
      const accumulates = row.accumulates === 1 || row.accumulates === true;
      if (hasLimit && !accumulates) {
        monthlyBudget += toNumber(row.monthly_limit);
        currentBudget += toNumber(row.current_amount);
      }
    });

    const percentage = monthlyBudget > 0
      ? Math.round((currentBudget / monthlyBudget) * 1000) / 10
      : 0;

    res.json({
      monthly_budget: monthlyBudget,
      current_budget: currentBudget,
      percentage,
      leftover_pool: 0,
      period_start: formatRuDate(start),
      period_end: formatRuDate(end),
      last_reset_at: userRow?.last_reset_at ? formatRuDate(userRow.last_reset_at) : null,
    });
  } catch (error) {
    console.error('Failed to fetch envelope summary', error);
    res.status(500).json({ message: 'Ошибка сервера при получении сводки' });
  }
});

async function resetMonth(userId) {
  return withTransaction(async (connection) => {
    const user = await fetchUser(connection, userId, { forUpdate: true });
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const { rows: typeRows, byCode } = await loadEnvelopeTypes(connection);

    const distribution = {
      necessary: toNumber(user.percent_necessary) || DEFAULT_DISTRIBUTION.necessary,
      desire: toNumber(user.percent_desire) || DEFAULT_DISTRIBUTION.desire,
      saving: toNumber(user.percent_saving) || DEFAULT_DISTRIBUTION.saving,
      investment: toNumber(user.percent_investment) || DEFAULT_DISTRIBUTION.investment,
    };

    const [envelopeRows] = await connection.query(
      `SELECT e.id, e.name, e.monthly_limit, e.current_amount, t.code, t.has_limit, t.accumulates
       FROM envelopes e
       JOIN envelope_types t ON t.id = e.type_id
       WHERE e.user_id = ? AND e.is_active = 1
       FOR UPDATE`,
      [userId]
    );

    const rows = normalizeRows(envelopeRows);

    const envelopesByType = new Map();
    let leftover = 0;

    rows.forEach((env) => {
      const arr = envelopesByType.get(env.code) || [];
      arr.push({
        id: env.id,
        name: env.name,
        monthly_limit: toNumber(env.monthly_limit),
        current_amount: toNumber(env.current_amount),
        has_limit: env.has_limit === 1 || env.has_limit === true,
        accumulates: env.accumulates === 1 || env.accumulates === true,
      });
      envelopesByType.set(env.code, arr);

      if (env.has_limit && !env.accumulates) {
        leftover += toNumber(env.current_amount);
      }
    });

    const roundedLeftover = Math.max(0, Math.round(leftover * 100) / 100);

    const accumulativeTypes = typeRows.filter((type) => type.accumulates);
    const carryTargets = accumulativeTypes.reduce(
      (sum, type) => sum + (distribution[type.code] ?? 0),
      0
    );

    const allocationsByType = new Map();

    if (roundedLeftover > 0 && accumulativeTypes.length > 0) {
      if (carryTargets > 0) {
        accumulativeTypes.forEach((type) => {
          const percent = distribution[type.code] ?? 0;
          const amount = Math.round((roundedLeftover * percent / carryTargets) * 100) / 100;
          allocationsByType.set(type.code, amount);
        });

        const allocatedTotal = Array.from(allocationsByType.values()).reduce((sum, val) => sum + val, 0);
        const diff = Math.round((roundedLeftover - allocatedTotal) * 100) / 100;
        if (diff !== 0) {
          const firstCode = accumulativeTypes[0].code;
          allocationsByType.set(firstCode, (allocationsByType.get(firstCode) || 0) + diff);
        }
      } else {
        const firstCode = accumulativeTypes[0].code;
        allocationsByType.set(firstCode, roundedLeftover);
      }
    }

    for (const type of typeRows) {
      const envelopes = envelopesByType.get(type.code) || [];

      if (envelopes.length === 0) {
        continue;
      }

      if (type.has_limit && !type.accumulates) {
        for (const env of envelopes) {
          await connection.query(
            `UPDATE envelopes SET current_amount = ?, updated_at = NOW()
             WHERE id = ?`,
            [env.monthly_limit, env.id]
          );
        }
        continue;
      }

      const carryForType = allocationsByType.get(type.code) || 0;
      const totalMonthlyLimit = envelopes.reduce((sum, env) => sum + env.monthly_limit, 0);

      for (const env of envelopes) {
        const monthlyContribution = env.monthly_limit;
        let carryShare = 0;

        if (carryForType > 0) {
          if (totalMonthlyLimit > 0) {
            carryShare = Math.round((carryForType * (env.monthly_limit / totalMonthlyLimit)) * 100) / 100;
          } else {
            carryShare = Math.round((carryForType / envelopes.length) * 100) / 100;
          }
        }

        const newAmount = Math.round((env.current_amount + monthlyContribution + carryShare) * 100) / 100;

        await connection.query(
          `UPDATE envelopes SET current_amount = ?, updated_at = NOW()
           WHERE id = ?`,
          [newAmount, env.id]
        );
      }
    }

    await connection.query(
      `UPDATE users SET leftover_pool = 0, last_reset_at = ?, updated_at = NOW()
       WHERE id = ?`,
      [new Date(), userId]
    );

    const carriedOverObject = {};
    allocationsByType.forEach((value, code) => {
      carriedOverObject[code] = value;
    });

    return {
      carried_over: carriedOverObject,
      leftover_used: roundedLeftover,
    };
  });
}

router.post('/converts/month/reset', requireAuth, async (req, res) => {
  try {
    const result = await resetMonth(req.userId);
    res.json({
      message: 'Месяц закрыт, остаток автоматически распределён',
      carried_over: result.carried_over,
      leftover_used: result.leftover_used,
    });
  } catch (error) {
    console.error('Failed to reset month', error);
    res.status(500).json({ message: error.message || 'Не удалось закрыть месяц' });
  }
});

router.patch('/settings/budget', requireAuth, async (req, res) => {
  const {
    distribution_mode: distributionMode = 'baseline',
    percent_necessary,
    percent_desire,
    percent_saving,
    percent_investment,
  } = req.body || {};

  try {
    let newPercents = { ...DEFAULT_DISTRIBUTION };

    if (distributionMode === 'flex') {
      const percents = {
        necessary: toNumber(percent_necessary),
        desire: toNumber(percent_desire),
        saving: toNumber(percent_saving),
        investment: toNumber(percent_investment),
      };

      const total = Object.values(percents).reduce((sum, value) => sum + value, 0);
      if (total <= 0 || Math.abs(total - 100) > 0.01) {
        return res.status(400).json({ message: 'Сумма процентов должна равняться 100' });
      }

      newPercents = percents;
    }

    await query(
      `UPDATE users
       SET distribution_mode = ?,
           percent_necessary = ?,
           percent_desire = ?,
           percent_saving = ?,
           percent_investment = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        distributionMode === 'flex' ? 'flex' : 'baseline',
        newPercents.necessary,
        newPercents.desire,
        newPercents.saving,
        newPercents.investment,
        req.userId,
      ]
    );

    res.json({
      message: 'Схема распределения обновлена',
      distribution: {
        mode: distributionMode === 'flex' ? 'flex' : 'baseline',
        ...newPercents,
      },
    });
  } catch (error) {
    console.error('Failed to update distribution', error);
    res.status(500).json({ message: 'Не удалось обновить схему распределения' });
  }
});

module.exports = router;
