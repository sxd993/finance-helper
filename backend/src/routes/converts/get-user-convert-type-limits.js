import express from 'express';
import { Op, fn, col, literal } from 'sequelize';
import { ConvertTypeLimit, Expense, Cycle } from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';
import { getAllocatedAmount } from './utils/type-limits.js';

const router = express.Router();

router.get('/get-user-converts-type-limits', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const typeCodes = ['important', 'wishes', 'saving', 'investment'];

    const userLimits = await ConvertTypeLimit.findAll({ where: { userId } });
    const existingCodes = new Set(userLimits.map((row) => row.typeCode));
    const missingCodes = typeCodes.filter((code) => !existingCodes.has(code));

    if (missingCodes.length) {
      const monthlyIncomeNum = Number(req.user?.monthlyIncome) || 0;
      const percentByType = {
        important: Number(req.user?.percentImportant) || 0,
        wishes: Number(req.user?.percentWishes) || 0,
        saving: Number(req.user?.percentSaving) || 0,
        investment: Number(req.user?.percentInvestment) || 0,
      };

      await Promise.all(
        missingCodes.map((typeCode) => ConvertTypeLimit.upsert({
          userId,
          typeCode,
          limitAmount: Number(((monthlyIncomeNum * (percentByType[typeCode] ?? 0)) / 100).toFixed(2)),
        }))
      );
    }

    const refreshed = missingCodes.length
      ? await ConvertTypeLimit.findAll({ where: { userId } })
      : userLimits;

    const allocatedMap = new Map(
      await Promise.all(
        typeCodes.map(async (typeCode) => [typeCode, Number(await getAllocatedAmount(userId, typeCode) || 0)])
      )
    );

    const activeCycle = await Cycle.findOne({
      where: { userId, isClosed: false },
      order: [['id', 'DESC']],
      attributes: ['startDate', 'endDate'],
    });
    const startMs = activeCycle ? new Date(activeCycle.startDate).getTime() : null;
    const endMs = activeCycle
      ? (activeCycle.endDate ? new Date(activeCycle.endDate).getTime() : Date.now())
      : null;

    const spentRows = startMs != null
      ? await Expense.findAll({
        where: {
          userId,
          date: { [Op.between]: [startMs, endMs] },
        },
        attributes: [
          [col('convert_type'), 'typeCode'],
          [fn('COALESCE', fn('SUM', col('sum')), literal('0')), 'spent'],
        ],
        group: ['convert_type'],
        raw: true,
      })
      : [];

    const spentMap = new Map(
      spentRows.map((row) => [row.typeCode, Number(row.spent) || 0])
    );

    const orderMap = { important: 0, wishes: 1, saving: 2, investment: 3 };
    const result = refreshed
      .map(({ userId: uid, typeCode, limitAmount = 0, updatedAt }) => {
        const limit = Number(limitAmount || 0);
        const allocated = allocatedMap.get(typeCode) ?? 0;
        const spent = Number(spentMap.get(typeCode) || 0);
        const availableToAllocate = Number(Math.max(limit - allocated, 0).toFixed(2));
        const availableToSpend = Number(Math.max(limit - spent, 0).toFixed(2));
        return {
          userId: uid,
          typeCode,
          limitAmount: limit,
          allocatedAmount: allocated,
          spentAmount: spent,
          availableToAllocate,
          availableToSpend,
          updatedAt,
        };
      })
      .sort((a, b) => (orderMap[a.typeCode] ?? 999) - (orderMap[b.typeCode] ?? 999));

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ошибка при получении конвертов пользователя' });
  }
});

export default router;
