import express from 'express';
import {
  sequelize,
  Convert,
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
    const desiredInitial = toNumberOrNull(body.initial_amount ?? body.initial_investment);
    const desiredValue = toNumberOrNull(body.current_value);
    const desiredTarget = toNumberOrNull(body.target_amount);

    const updates = {};
    if (desiredInitial != null) {
      updates.initialAmount = desiredInitial;
    }
    if (desiredValue != null) {
      updates.currentAmount = desiredValue;
    }
    if (desiredTarget != null) {
      updates.targetAmount = desiredTarget;
    }

    if (Object.keys(updates).length > 0) {
      await convert.update(updates, { transaction });
    }

    await transaction.commit();

    return res.json({
      id: convert.id,
      initial_amount: convert.initialAmount,
      current_amount: convert.currentAmount,
      target_amount: convert.targetAmount,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('update investment error', error);
    return res.status(500).json({ message: 'Ошибка сервера при обновлении инвестиций' });
  }
});

export default router;
