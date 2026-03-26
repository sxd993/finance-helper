import express from 'express';
import {
  sequelize,
  Convert,
  ConvertSpend,
  Expense,
} from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';
import { getTransactionsSummary } from './utils/get-user-converts.js';

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

    let spentTotal = 0;
    let unspentAmount = 0;

    if (convert.typeCode === 'important' || convert.typeCode === 'wishes') {
      const summaryMap = await getTransactionsSummary(userId, [id], { transaction });
      spentTotal = Number(summaryMap.get(id)?.totalOut ?? 0);

      const spendData = await ConvertSpend.findByPk(id, { transaction });
      const fundedAmount = Number(spendData?.fundedAmount ?? 0);
      unspentAmount = Number(Math.max(fundedAmount - spentTotal, 0).toFixed(2));

      await ConvertSpend.destroy({ where: { convertId: id }, transaction });
    }

    await Expense.update(
      { convertId: null },
      {
        where: { userId, convertId: id },
        transaction,
        validate: false,
        hooks: false,
        individualHooks: false,
      }
    );

    const deletedCount = await Convert.destroy({
      where: { id, userId },
      transaction,
    });

    if (!deletedCount) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Конверт не найден' });
    }

    await transaction.commit();

    return res.json({
      message: 'Конверт удалён',
      id,
      unspent_amount: unspentAmount,
      spent_amount: Number(spentTotal.toFixed(2)),
    });
  } catch (error) {
    console.error('[delete-convert] error:', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Ошибка сервера при удалении конверта' });
  }
});

export default router;
