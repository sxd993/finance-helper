const express = require('express');
const {
  sequelize,
  Convert,
  Transaction,
} = require('../../db');
const { requireAuth } = require('../../utils/auth');
const { getTransactionsSummary } = require('./utils/get-user-converts');

const router = express.Router();

const toNumberOrNull = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

router.patch('/:id/investment', requireAuth, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Некорректный id' });
    }

    const userId = req.userId;
    const convert = await Convert.findOne({ where: { id, userId }, transaction });

    if (!convert) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Конверт не найден' });
    }

    if (convert.typeCode !== 'investment') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Обновлять инвестиции можно только для инвестиционных конвертов' });
    }

    const body = req.body || {};
    const desiredInitial = toNumberOrNull(body.initial_amount ?? body.initial_investment);
    const desiredValue = toNumberOrNull(body.current_value);

    if (desiredInitial != null) {
      await convert.update({ initialAmount: desiredInitial }, { transaction });
    }

    if (desiredValue != null) {
      const currentSummary = await getTransactionsSummary([convert.id], { transaction });
      const current = currentSummary.get(convert.id)?.balance ?? 0;
      const diff = Number((desiredValue - current).toFixed(2));

      if (diff > 0.005) {
        await Transaction.create({
          convertId: convert.id,
          type: 'deposit',
          amount: diff,
          note: 'Valuation adjustment (increase)',
        }, { transaction });
      } else if (diff < -0.005) {
        await Transaction.create({
          convertId: convert.id,
          type: 'spend',
          amount: Math.abs(diff),
          note: 'Valuation adjustment (decrease)',
        }, { transaction });
      }
    }

    const summaryAfter = await getTransactionsSummary([convert.id], { transaction });
    const metrics = summaryAfter.get(convert.id) || { balance: 0, totalIn: 0, totalOut: 0 };

    await transaction.commit();

    return res.json({
      id: convert.id,
      initial_amount: convert.initialAmount,
      balance: metrics.balance,
      total_in: metrics.totalIn,
      total_out: metrics.totalOut,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('update investment error', error);
    return res.status(500).json({ message: 'Ошибка сервера при обновлении инвестиций' });
  }
});

module.exports = router;
