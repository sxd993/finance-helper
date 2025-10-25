import express from 'express';

import {
  Expense,
  Convert,
  ConvertType,
} from '../../db/index.js';
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
      ...(shouldFilterByType
        ? { where: { convertType: convertTypeFilter } }
        : {}),
      include: [
        {
          model: Convert,
          as: 'convert',
          attributes: [],
          where: {
            userId,
          },
          required: true,
        },
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

    return res.json(result);
  } catch (error) {
    console.error('[get-expenses] failed to fetch expenses', error);
    return res.status(500).json({ message: 'Не удалось получить список трат' });
  }
});

export default router;
