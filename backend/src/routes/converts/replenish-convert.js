import express from 'express';

import { sequelize, Convert, ConvertTypeLimit } from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';
import { normalizeLimit } from './utils/type-limits.js';

const router = express.Router();

const SUPPORTED_TYPES = new Set(['saving', 'investment']);

router.post('/replenish-convert', requireAuth, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.userId;
    const payload = req.body || {};

    const typeCode = typeof payload.type_code === 'string' ? payload.type_code.trim() : '';
    const convertId = Number(payload.convert_id);
    const amount = Number(payload.amount);

    if (!SUPPORTED_TYPES.has(typeCode)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Для пополнения можно выбрать только типы saving или investment' });
    }

    if (!Number.isFinite(convertId) || convertId <= 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Некорректный идентификатор конверта' });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Сумма пополнения должна быть больше нуля' });
    }

    const convert = await Convert.findOne({
      where: { id: convertId, userId },
      transaction,
    });

    if (!convert) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Конверт не найден' });
    }

    if (convert.typeCode !== typeCode) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Выбранный конверт не соответствует типу источника' });
    }

    const limitRow = await ConvertTypeLimit.findOne({
      where: { userId, typeCode },
      transaction,
    });

    if (!limitRow) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Лимит для выбранного типа не найден' });
    }

    const limitAmount = Number(limitRow.limitAmount ?? 0);
    const distributedAmount = Number(limitRow.distributedAmount ?? 0);

    if (!Number.isFinite(limitAmount) || limitAmount <= 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Лимит для выбранного типа не задан' });
    }

    const remainder = Number((limitAmount - distributedAmount).toFixed(2));

    if (remainder <= 0 || amount > remainder + 1e-6) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Недостаточно средств для пополнения конверта' });
    }

    const nextDistributed = normalizeLimit(distributedAmount + amount);
    const nextInitialAmount = normalizeLimit(Number(convert.initialAmount ?? 0) + amount);

    await convert.update({ initialAmount: nextInitialAmount }, { transaction });
    await limitRow.update(
      {
        distributedAmount: nextDistributed ?? distributedAmount + amount,
        updatedAt: new Date(),
      },
      { transaction },
    );

    await transaction.commit();

    return res.json({
      convert: {
        id: convert.id,
        name: convert.name,
        type_code: convert.typeCode,
        initial_amount: nextInitialAmount,
      },
      limit: {
        type_code: typeCode,
        distributed_amount: nextDistributed,
        remainder_amount: Number((limitAmount - (nextDistributed ?? distributedAmount + amount)).toFixed(2)),
      },
    });
  } catch (error) {
    console.error('[replenish-convert] error:', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Ошибка сервера при пополнении конверта' });
  }
});

export default router;
