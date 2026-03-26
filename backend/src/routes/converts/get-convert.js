import express from 'express';
import { requireAuth } from '../../utils/auth.js';
import { getTypeLimitsMap } from './utils/type-limits.js';
import { getUserConverts } from './utils/get-user-converts.js';

const router = express.Router();

const toNumberOrZero = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? Number(n.toFixed(2)) : 0;
};

router.get('/get-converts', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const [rows, typeLimits] = await Promise.all([
      getUserConverts(userId),
      getTypeLimitsMap({ userId, user: req.user }),
    ]);

    const result = rows.map((convert) => {
      const code = convert.typeCode;
      const totalOut = toNumberOrZero(convert.total_out ?? 0);
      const typeData = convert.type
        ? {
            code: convert.type.code,
            title: convert.type.title,
            description: convert.type.description ?? null,
            is_reset: Boolean(convert.type.isReset),
            has_limit: Boolean(convert.type.hasLimit),
            can_spend: Boolean(convert.type.canSpend),
            sort_order: convert.type.sortOrder ?? null,
            limit: typeLimits[code] != null ? Number(typeLimits[code]) : null,
          }
        : null;

      let currentBalance = 0;
      let payload = {
        id: convert.id,
        name: convert.name,
        type_code: code,
        is_active: Boolean(convert.isActive),
        total_out: totalOut,
        type: typeData,
      };

      if (code === 'important' || code === 'wishes') {
        const monthlyLimit = toNumberOrZero(convert.spend?.monthlyLimit ?? 0);
        const fundedAmount = toNumberOrZero(convert.spend?.fundedAmount ?? monthlyLimit);
        currentBalance = Number((fundedAmount - totalOut).toFixed(2));
        payload = {
          ...payload,
          monthly_limit: monthlyLimit,
          funded_amount: fundedAmount,
          spent_amount: totalOut,
          current_balance: currentBalance,
        };
      } else if (code === 'saving') {
        const goalAmount = toNumberOrZero(convert.saving?.goalAmount ?? 0);
        const savedAmount = toNumberOrZero(convert.saving?.savedAmount ?? 0);
        currentBalance = savedAmount;
        const progressPercent = goalAmount > 0 ? Number(Math.min((savedAmount / goalAmount) * 100, 100).toFixed(2)) : 0;
        payload = {
          ...payload,
          goal_amount: goalAmount,
          saved_amount: savedAmount,
          progress_percent: progressPercent,
          current_balance: currentBalance,
        };
      } else if (code === 'investment') {
        const investedAmount = toNumberOrZero(convert.investment?.investedAmount ?? 0);
        const currentValue = toNumberOrZero(convert.investment?.currentValue ?? investedAmount);
        currentBalance = currentValue;
        const pnlAmount = Number((currentValue - investedAmount).toFixed(2));
        const pnlPercent = investedAmount > 0 ? Number(((pnlAmount / investedAmount) * 100).toFixed(2)) : 0;
        payload = {
          ...payload,
          invested_amount: investedAmount,
          current_value: currentValue,
          pnl_amount: pnlAmount,
          pnl_percent: pnlPercent,
          current_balance: currentBalance,
        };
      } else {
        payload = {
          ...payload,
          current_balance: 0,
        };
      }

      return payload;
    });

    return res.json(result);
  } catch (error) {
    console.error('[get-converts] error:', error);
    return res.status(500).json({ message: 'Ошибка сервера при получении конвертов' });
  }
});

export default router;
