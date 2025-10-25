import express from 'express';
import { sequelize, Expense } from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';
import { parseExpensePayload, validateExpensePayload } from './utils/payload.js';
import { resolveConvertAndType } from './utils/converts.js';
import { buildExpenseResponse } from './utils/formatter.js';

const router = express.Router();

router.post('/add-expense', requireAuth, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.userId;
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

    const createdExpense = await Expense.create(
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

    return res.status(201).json(
      buildExpenseResponse(createdExpense, convertResolution.convertType)
    );
  } catch (error) {
    console.error('[add-expense] failed to create expense', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Не удалось создать трату' });
  }
});

export default router;
