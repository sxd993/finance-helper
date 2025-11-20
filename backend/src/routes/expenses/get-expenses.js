import express from 'express';
import { Op } from 'sequelize';

import { Expense, ConvertType, Cycle } from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';

const router = express.Router();

router.get('/get-expenses', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const convertTypeQuery = Array.isArray(req.query.convert_type)
      ? req.query.convert_type[0]
      : req.query.convert_type;
    const convertTypeFilter =
      typeof convertTypeQuery === 'string' ? convertTypeQuery.trim() : undefined;
    const shouldFilterByType =
      convertTypeFilter && convertTypeFilter.toLowerCase() !== 'all';

    const expenses = await Expense.findAll({
      where: {
        userId,
        ...(shouldFilterByType ? { convertType: convertTypeFilter } : {}),
      },
      include: [
        {
          model: ConvertType,
          as: 'type',
          attributes: ['code', 'title'],
          required: false,
        },
      ],
      order: [['date', 'DESC']],
    });

    const result = expenses.map((expense) => {
      const data = expense.toJSON();
      return {
        name: data.name,
        convert_name: data.convertName,
        convert_type: data.convertType,
        convert_title: data.convertTitle,
        sum: Number(data.sum),
        date: Number(data.date),
        icon_name: data.iconName,
        icon_color: data.iconColor,
      };
    });

    const activeCycle = await Cycle.findOne({
      where: { userId, isClosed: false },
      // Берём самую свежую запись, если по пользователю есть несколько открытых циклов
      order: [['id', 'DESC']],
      attributes: ['startDate', 'endDate'],
    });

    let currentCycleSpent = 0;

    if (activeCycle) {
      const cycleStart = new Date(activeCycle.startDate).getTime();
      const cycleEnd = activeCycle.endDate
        ? new Date(activeCycle.endDate).getTime()
        : Date.now();

      const spent = await Expense.sum('sum', {
        where: {
          userId,
          date: {
            [Op.between]: [cycleStart, cycleEnd],
          },
        },
      });

      currentCycleSpent = Number(spent ?? 0);
    }

    return res.json({
      expenses: result,
      current_cycle_spent: currentCycleSpent,
    });
  } catch (error) {
    console.error('[get-expenses] failed to fetch expenses', error);
    return res.status(500).json({ message: 'Не удалось получить список трат' });
  }
});

export default router;
