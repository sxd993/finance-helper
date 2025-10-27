import express from 'express';
import { sequelize, Expense } from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';
import { parseExpensePayload, validateExpensePayload } from './utils/payload.js';
import { resolveConvertAndType } from './utils/converts.js';
import { buildExpenseResponse } from './utils/formatter.js';
import { getTransactionsSummary } from '../converts/utils/get-user-converts.js';

const router = express.Router();

router.post('/add-expense', requireAuth, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.userId;
    const payload = parseExpensePayload(req.body);
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

    const { convert, convertType } = convertResolution;

    if (!convertType?.canSpend) {
      await transaction.rollback();
      return res.status(400).json({
        message: 'С этого типа конверта нельзя создавать траты',
        code: 'TYPE_NOT_SPENDABLE',
      });
    }

    if (convertType?.hasLimit) {
      const summaryMap = await getTransactionsSummary(
        userId,
        [convert.id],
        { transaction }
      );

      const summary = summaryMap.get(convert.id);
      const initialAmount = Number.parseFloat(convert.initialAmount ?? 0) || 0;
      const balance =
        summary && Number.isFinite(summary.balance)
          ? summary.balance
          : initialAmount;
      const requestedSum = Number(payload.sum);

      if (requestedSum - balance > 1e-6) {
        await transaction.rollback();
        return res.status(400).json({
          message: 'Сумма траты превышает доступный остаток конверта',
          code: 'EXPENSE_EXCEEDS_BALANCE',
          available: Number(balance.toFixed(2)),
          requested: Number(requestedSum.toFixed(2)),
        });
      }
    }

    const requestedDate = Number.isFinite(payload.date) ? Number(payload.date) : null;
    const now = Date.now();
    const expenseDate =
      requestedDate && requestedDate > 0 ? Math.min(requestedDate, now) : now;

    const createdExpense = await Expense.create(
      {
        name: payload.name,
        convertName: convert.name,
        convertType: convertResolution.convertTypeCode,
        sum: payload.sum,
        date: expenseDate,
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
