const express = require('express');
const { getUserConverts } = require('./utils/get-user-converts');
const { requireAuth } = require('../../utils/auth');
const { getTypeLimitsMap } = require('./utils/type-limits');

const router = express.Router();

const toNumberOrUndefined = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

router.get('/get-converts', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    const rows = await getUserConverts(userId);
    const typeLimits = await getTypeLimitsMap({ userId, user: req.user });

    const result = rows.map((convert) => {
      const code = convert.typeCode;
      const balance = Number(convert.balance ?? 0);
      const totalIn = Number(convert.total_in ?? 0);
      const totalOut = Number(convert.total_out ?? 0);
      const targetAmount = convert.targetAmount != null ? Number(convert.targetAmount) : null;
      const initialAmount = convert.initialAmount != null ? Number(convert.initialAmount) : null;

      let overallLimit;
      let currentAmount;
      let goalAmount;
      let initialInvestment;
      let currentValue;

      switch (code) {
        case 'important':
        case 'wishes': {
          overallLimit = targetAmount;
          currentAmount = balance;
          goalAmount = null;
          initialInvestment = null;
          currentValue = null;
          break;
        }
        case 'saving': {
          overallLimit = null;
          currentAmount = balance;
          goalAmount = targetAmount;
          initialInvestment = null;
          currentValue = null;
          break;
        }
        case 'investment': {
          overallLimit = null;
          currentAmount = null;
          goalAmount = null;
          initialInvestment = initialAmount;
          currentValue = balance;
          break;
        }
        default: {
          overallLimit = null;
          currentAmount = balance;
          goalAmount = targetAmount;
          initialInvestment = initialAmount;
          currentValue = balance;
        }
      }

      const typeData = convert.type
        ? {
            id: convert.type.id ?? convert.type.sortOrder ?? undefined,
            code: convert.type.code,
            title: convert.type.title,
            description: convert.type.description ?? null,
            sort_order: convert.type.sortOrder ?? null,
            limit: typeLimits[code] != null ? Number(typeLimits[code]) : null,
          }
        : null;

      return {
        id: convert.id,
        name: convert.name,
        type_code: code,
        is_active: Boolean(convert.isActive),
        overall_limit: toNumberOrUndefined(overallLimit),
        current_amount: toNumberOrUndefined(currentAmount),
        target_amount: toNumberOrUndefined(goalAmount),
        initial_investment: toNumberOrUndefined(initialInvestment),
        initial_amount: toNumberOrUndefined(initialAmount),
        current_value: toNumberOrUndefined(currentValue),
        balance,
        total_in: totalIn,
        total_out: totalOut,
        type: typeData,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Failed to fetch converts', error);
    res.status(500).json({ message: 'Ошибка сервера при получении конвертов' });
  }
});

module.exports = router;
