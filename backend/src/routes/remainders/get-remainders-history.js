import express from 'express';
import {
  Cycle,
  Remainder,
} from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';
import { formatDateShort } from '../../utils/dates.js';
import { roundMoney } from './utils/summary.js';

const router = express.Router();

router.get('/history', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    const rows = await Remainder.findAll({
      where: { userId },
      include: [
        {
          model: Cycle,
          as: 'cycle',
          attributes: ['startDate', 'endDate'],
          required: true,
          where: { userId },
        },
      ],
      order: [['created_at', 'DESC'], ['id', 'DESC']],
    });

    return res.json(rows.map((row) => {
      const data = row.toJSON();
      return {
        id: data.id,
        amount: roundMoney(data.amount),
        created_at: data.created_at ?? row.get('created_at') ?? row.get('createdAt'),
        remainder_type: {
          type_code: data.typeCode,
          start_date: formatDateShort(data.cycle?.startDate),
          end_date: formatDateShort(data.cycle?.endDate),
        },
      };
    }));
  } catch (error) {
    console.error('[get-remainders-history] failed', error);
    return res.status(500).json({ message: 'Не удалось получить историю остатков' });
  }
});

export default router;
