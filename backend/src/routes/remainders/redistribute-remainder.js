import express from 'express';
import {
  sequelize,
  Convert,
  ConvertSaving,
  ConvertInvestment,
  Remainder,
  RemainderRedistribution,
  RemainderRedistributionItem,
} from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';
import { buildRemaindersSummary, roundMoney } from './utils/summary.js';

const router = express.Router();

const SUPPORTED_TARGET_TYPES = new Set(['saving', 'investment']);

router.post('/redistribute', requireAuth, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.userId;
    const payload = req.body || {};
    const convertId = Number(payload.convert_id);
    const amount = roundMoney(payload.amount);

    if (!Number.isInteger(convertId) || convertId <= 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Некорректный идентификатор конверта' });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Сумма перераспределения должна быть больше нуля' });
    }

    const targetConvert = await Convert.findOne({
      where: { id: convertId, userId, isActive: true },
      transaction,
    });

    if (!targetConvert) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Целевой конверт не найден' });
    }

    if (!SUPPORTED_TARGET_TYPES.has(targetConvert.typeCode)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Остатки можно переводить только в накопления или инвестиции' });
    }

    const remainders = await Remainder.findAll({
      where: { userId },
      order: [['created_at', 'ASC'], ['id', 'ASC']],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    const summary = buildRemaindersSummary(remainders);
    if (summary.total_amount + 1e-6 < amount) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Недостаточно средств в остатках' });
    }

    let amountLeft = amount;
    const updates = [];

    for (const remainder of remainders) {
      if (amountLeft <= 0) break;

      const currentAmount = roundMoney(remainder.amount);
      if (currentAmount <= 0) continue;

      const writeOff = Math.min(currentAmount, amountLeft);
      const nextAmount = roundMoney(currentAmount - writeOff);

      await remainder.update({ amount: nextAmount }, { transaction });

      updates.push({
        remainderId: remainder.id,
        amount: writeOff,
      });

      amountLeft = roundMoney(amountLeft - writeOff);
    }

    if (amountLeft > 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Не удалось распределить выбранную сумму из остатков' });
    }

    if (targetConvert.typeCode === 'saving') {
      const savingRow = await ConvertSaving.findByPk(targetConvert.id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!savingRow) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Данные накопления для конверта не найдены' });
      }

      await savingRow.update(
        { savedAmount: roundMoney(Number(savingRow.savedAmount || 0) + amount) },
        { transaction }
      );
    } else {
      const investmentRow = await ConvertInvestment.findByPk(targetConvert.id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!investmentRow) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Данные инвестиций для конверта не найдены' });
      }

      await investmentRow.update(
        {
          investedAmount: roundMoney(Number(investmentRow.investedAmount || 0) + amount),
          currentValue: roundMoney(Number(investmentRow.currentValue || 0) + amount),
        },
        { transaction }
      );
    }

    const redistribution = await RemainderRedistribution.create({
      userId,
      targetConvertId: targetConvert.id,
      targetTypeCode: targetConvert.typeCode,
      amount,
    }, { transaction });

    await RemainderRedistributionItem.bulkCreate(
      updates.map((item) => ({
        redistributionId: redistribution.id,
        remainderId: item.remainderId,
        amount: item.amount,
      })),
      { transaction }
    );

    await transaction.commit();

    const nextSummary = {
      total_amount: roundMoney(summary.total_amount - amount),
    };

    return res.json({
      summary: nextSummary,
      redistribution: {
        id: redistribution.id,
        amount,
        created_at: redistribution.get('created_at') ?? redistribution.get('createdAt'),
        target_convert: {
          id: targetConvert.id,
          name: targetConvert.name,
          type_code: targetConvert.typeCode,
        },
      },
    });
  } catch (error) {
    console.error('[redistribute-remainder] error:', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Ошибка сервера при перераспределении остатка' });
  }
});

export default router;
