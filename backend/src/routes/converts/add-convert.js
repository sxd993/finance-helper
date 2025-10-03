const express = require('express');
const { sequelize, Convert, ConvertType } = require('../../db');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.post('/add-convert', requireAuth, async (req, res) => {
  const {
    name,
    type_code: typeCode,
    monthly_limit: monthlyLimit,
    target_amount: targetAmount,
    is_active: isActive = true,
  } = req.body?.convert || {};

  if (!name || !typeCode) {
    return res
      .status(400)
      .json({ message: 'Нужно указать название и тип конверта' });
  }

  try {
    const result = await sequelize.transaction(async (transaction) => {
      const type = await ConvertType.findOne({
        where: { code: typeCode },
        transaction,
      });

      if (!type) {
        const err = new Error('Такого типа нет');
        err.status = 400;
        throw err;
      }

      const safeMonthlyLimit = type.hasLimit
        ? Math.max(0, Number(monthlyLimit) || 0)
        : 0;

      const safeTargetAmount = type.accumulates && targetAmount !== undefined
        ? Math.max(0, Number(targetAmount) || 0)
        : null;

      const convert = await Convert.create(
        {
          userId: req.userId,
          typeId: type.id,
          name,
          monthlyLimit: safeMonthlyLimit,
          currentAmount: type.accumulates ? 0 : safeMonthlyLimit,
          targetAmount: safeTargetAmount,
          isActive,
        },
        { transaction },
      );

      return convert;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Не удалось создать конверт', error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Ошибка при создании конверта' });
  }
});

module.exports = router;
