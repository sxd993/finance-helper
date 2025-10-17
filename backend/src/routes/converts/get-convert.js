const express = require('express');
const { getUserConverts } = require('./utils/get-user-converts');
const { requireAuth } = require('../../utils/auth');
const { getTypeLimitsMap } = require('./utils/type-limits');

const router = express.Router();

const toNumberOrNull = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

router.get('/get-converts', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    // Получаем все конверты пользователя
    const rows = await getUserConverts(userId);
    // Получаем лимиты пользователя по типам
    const typeLimits = await getTypeLimitsMap({ userId, user: req.user });

    const result = rows.map((convert) => {
      const code = convert.typeCode;
      const balance = toNumberOrNull(convert.balance ?? 0);
      const totalIn = toNumberOrNull(convert.total_in ?? 0);
      const totalOut = toNumberOrNull(convert.total_out ?? 0);
      const targetAmount = toNumberOrNull(convert.targetAmount);
      const initialAmount = toNumberOrNull(convert.initialAmount);

      const typeData = convert.type
        ? {
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

        // Универсальные поля новой модели
        target_amount: targetAmount,      // цель (лимит)
        initial_amount: initialAmount,    // текущие деньги в конверте

        // Информация о типе
        type: typeData,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('[get-converts] error:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении конвертов' });
  }
});

module.exports = router;
