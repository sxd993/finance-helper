import express from 'express';
import { sequelize, Expense, Convert } from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';
import { parseExpensePayload, validateExpensePayload } from './utils/payload.js';
import { resolveConvertAndType } from './utils/converts.js';
import { buildExpenseResponse } from './utils/formatter.js';

const router = express.Router();

router.put('/edit-expense/:id', requireAuth, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.userId;
    const expenseId = Number(req.params.id);

    if (!Number.isFinite(expenseId) || expenseId <= 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Некорректный id траты' });
    }

    const expense = await Expense.findOne({
      where: { id: expenseId },
      include: [
        {
          model: Convert,
          as: 'convert',
          attributes: ['userId', 'name', 'typeCode'],
          where: { userId },
          required: true,
        },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Трата не найдена' });
    }

    const payload = parseExpensePayload(req.body?.expense);
    const errors = validateExpensePayload(payload);

    if (errors.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: 'Проверьте корректность заполнения формы',
        errors,
      });
    }

    const convertResolution = await resolveConvertAndType({
      userId,
      convertName: payload.convertName,
      requestedTypeCode: payload.convertType,
      transaction,
    });

    if (convertResolution.error === 'CONVERT_NOT_FOUND') {
      await transaction.rollback();
      return res.status(404).json({ message: 'Конверт не найден' });
    }

    if (convertResolution.error === 'TYPE_MISMATCH') {
      await transaction.rollback();
      return res.status(400).json({
        message: 'Тип конверта не совпадает с фактическим типом конверта',
        code: 'TYPE_MISMATCH',
        convert_type: convertResolution.convert?.typeCode,
      });
    }

    if (convertResolution.error === 'TYPE_NOT_FOUND') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Указан неизвестный тип конверта' });
    }

    await expense.update(
      {
        name: payload.name,
        convertName: convertResolution.convert.name,
        convertType: convertResolution.convertTypeCode,
        sum: payload.sum,
        date: payload.date,
        iconName: payload.iconName,
        iconColor: payload.iconColor,
      },
      { transaction }
    );

    await transaction.commit();

    return res.json(buildExpenseResponse(expense, convertResolution.convertType));
  } catch (error) {
    console.error('[edit-expense] failed to update expense', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Не удалось обновить трату' });
  }
});

export default router;
