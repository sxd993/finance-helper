import express from 'express';
import { getUserConverts } from './utils/get-user-converts.js';
import { requireAuth } from '../../utils/auth.js';
import { getTypeLimitsMap } from './utils/type-limits.js';

const router = express.Router();

const toNumberOrNull = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

router.get('/get-converts', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    // Получаем конверты и лимиты
    const [rows, typeLimits] = await Promise.all([
      getUserConverts(userId),
      getTypeLimitsMap({ userId, user: req.user }),
    ]);

    const result = rows.map((convert) => {
      const code = convert.typeCode;
      const totalOut = toNumberOrNull(convert.total_out ?? 0);
      const targetAmount = toNumberOrNull(convert.targetAmount);
      const initialAmount = toNumberOrNull(convert.initialAmount);

      // 💡 Правильный текущий баланс
      const currentBalance =
        initialAmount != null && totalOut != null
          ? Number((initialAmount - totalOut).toFixed(2))
          : null;

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

      return {
        id: convert.id,
        name: convert.name,
        type_code: code,
        is_active: Boolean(convert.isActive),

        // значения по конверту
        target_amount: targetAmount,        // цель накоплений
        initial_amount: initialAmount,      // стартовая сумма
        total_out: totalOut,                // сколько потрачено
        current_balance: currentBalance,    // актуальный остаток = initial - total_out

        // тип
        type: typeData,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('[get-converts] error:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении конвертов' });
  }
});

export default router;
