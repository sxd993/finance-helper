import express from 'express';
import { sequelize, Operation } from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';
import { deleteExpenseOperation } from '../../features/operations/write-operation.js';

const router = express.Router();

router.delete('/delete-expense/:id', requireAuth, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.userId;
    const expenseId = Number(req.params.id);

    if (!Number.isFinite(expenseId) || expenseId <= 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Некорректный id траты' });
    }

    const expense = await Operation.findOne({
      where: { id: expenseId, userId, type: 'expense' },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Трата не найдена' });
    }

    const deleted = await deleteExpenseOperation({ userId, expenseId, transaction });
    if (!deleted) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Трата не найдена' });
    }
    await transaction.commit();

    return res.json({ message: 'Трата удалена', id: expenseId });
  } catch (error) {
    console.error('[delete-expense] failed to remove expense', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Не удалось удалить трату' });
  }
});

export default router;
