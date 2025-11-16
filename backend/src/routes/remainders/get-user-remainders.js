import express from 'express';

import { Remainder, Cycle } from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';
import { formatDateShort } from '../../utils/dates.js';

const router = express.Router();

router.get('/get-user-remainders', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    const remainders = await Remainder.findAll({
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
      order: [['id', 'ASC']],
    });

    const result = remainders.map((remainder) => {
      const data = remainder.toJSON();
      return {
        id: data.id,
        amount: Number(data.amount),
        start_date: formatDateShort(data.cycle?.startDate),
        end_date: formatDateShort(data.cycle?.endDate),
      };
    });

    return res.json(result);
  } catch (error) {
    console.error('[get-user-remainders] failed to fetch remainders', error);
    return res
      .status(500)
      .json({ message: 'Не удалось получить остатки пользователя' });
  }
});

export default router;
