import express from 'express';
import {
  sequelize,
  Convert,
  ConvertInvestment,
} from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';

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
    const desiredInvested = toNumberOrNull(body.invested_amount);
    const desiredCurrent = toNumberOrNull(body.current_value);

    const investment = await ConvertInvestment.findByPk(id, { transaction });
    if (!investment) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Инвестиционные данные конверта не найдены' });
    }

    const updates = {};
    if (desiredInvested != null) updates.investedAmount = desiredInvested;
    if (desiredCurrent != null) updates.currentValue = desiredCurrent;
    if (Object.keys(updates).length) {
      await investment.update(updates, { transaction });
    }

    await transaction.commit();

    const investedAmount = Number(investment.investedAmount ?? 0);
    const currentValue = Number(investment.currentValue ?? 0);
    const pnlAmount = Number((currentValue - investedAmount).toFixed(2));
    const pnlPercent = investedAmount > 0 ? Number(((pnlAmount / investedAmount) * 100).toFixed(2)) : 0;

    return res.json({
      id: convert.id,
      invested_amount: investedAmount,
      current_value: currentValue,
      pnl_amount: pnlAmount,
      pnl_percent: pnlPercent,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('update investment error', error);
    return res.status(500).json({ message: 'Ошибка сервера при обновлении инвестиций' });
  }
});

export default router;
