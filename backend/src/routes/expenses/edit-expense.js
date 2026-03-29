import express from 'express';
import { sequelize, Expense, ConvertSpend } from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';
import { parseExpensePayload, validateExpensePayload } from './utils/payload.js';
import { resolveConvertAndType } from './utils/converts.js';
import { buildExpenseResponse } from './utils/formatter.js';
import { getTransactionsSummary } from '../converts/utils/get-user-converts.js';

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
      where: { id: expenseId, userId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Трата не найдена' });
    }

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
      convertId: payload.convertId,
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

    if (!convertResolution.convertType?.canSpend) {
      await transaction.rollback();
      return res.status(400).json({
        message: 'С этого типа конверта нельзя списывать средства',
        code: 'TYPE_NOT_SPENDABLE',
      });
    }

    if (convertResolution.convertType?.hasLimit) {
      const summaryMap = await getTransactionsSummary(
        userId,
        [convertResolution.convert.id],
        { transaction }
      );

      const summary = summaryMap.get(convertResolution.convert.id);
      const spendData = await ConvertSpend.findByPk(convertResolution.convert.id, { transaction });
      const fundedAmount = Number.parseFloat(spendData?.fundedAmount ?? 0) || 0;
      const balance =
        summary && Number.isFinite(summary.balance)
          ? summary.balance
          : fundedAmount;

      const requestedSum = Number(payload.sum);
      const currentExpenseSum = Number(expense.sum) || 0;
      const isSameConvert =
        Number(expense.convertId) === Number(convertResolution.convert.id);
      const available = isSameConvert ? balance + currentExpenseSum : balance;

      if (requestedSum - available > 1e-6) {
        await transaction.rollback();
        return res.status(400).json({
          message: 'Сумма траты превышает доступный остаток конверта',
          code: 'EXPENSE_EXCEEDS_BALANCE',
          available: Number(available.toFixed(2)),
          requested: Number(requestedSum.toFixed(2)),
        });
      }
    }

    const expenseDate = payload.date ?? Number(expense.date);

    await expense.update(
      {
        name: payload.name,
        convertId: convertResolution.convert.id,
        convertName: convertResolution.convert.name,
        convertType: convertResolution.convertTypeCode,
        sum: payload.sum,
        date: expenseDate,
        iconName: payload.iconName,
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
