import express from 'express';
import {
  sequelize,
  Convert,
  ConvertTypeLimit,
  Expense,
} from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';
import { getAllocatedAmount, normalizeLimit } from './utils/type-limits.js';

const router = express.Router();

router.delete('/delete-convert/:id', requireAuth, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.userId;
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Некорректный id конверта' });
    }

    const convert = await Convert.findOne({ where: { id, userId }, transaction });

    if (!convert) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Конверт не найден' });
    }

    const spentRow = await Expense.findOne({
      where: {
        userId,
        convertName: convert.name,
        convertType: convert.typeCode,
      },
      attributes: [
        [
          sequelize.fn(
            'COALESCE',
            sequelize.fn('SUM', sequelize.col('sum')),
            0,
          ),
          'total',
        ],
      ],
      raw: true,
      transaction,
    });

    const spentTotal = Number(spentRow?.total) || 0;
    if (spentTotal > 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: 'Нельзя удалить конверт: в нём есть расходы',
        code: 'CONVERT_HAS_EXPENSES',
        spent: Number(spentTotal.toFixed(2)),
      });
    }

    await Expense.destroy({
      where: {
        convertName: convert.name,
        convertType: convert.typeCode,
      },
      transaction,
    });
    const deletedCount = await Convert.destroy({
      where: { id, userId },
      transaction,
    });
    if (!deletedCount) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Конверт не найден' });
    }
    const typeCode = convert.typeCode || convert.type_code;
    if (typeCode) {
      const distributed = await getAllocatedAmount(userId, typeCode, { transaction });
      const existingLimit = await ConvertTypeLimit.findOne({
        where: { userId, typeCode },
        attributes: ['limitAmount'],
        raw: true,
        transaction,
      });

      const limitAmount = existingLimit?.limitAmount ?? 0;

      await ConvertTypeLimit.upsert(
        {
          userId,
          typeCode,
          limitAmount: Number(limitAmount) || 0,
          distributedAmount: normalizeLimit(distributed) ?? 0,
        },
        { transaction }
      );
    }
    await transaction.commit();

    return res.json({ message: 'Конверт удалён', id });
  } catch (error) {
    console.error('[delete-convert] error:', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Ошибка сервера при удалении конверта' });
  }
});

export default router;
