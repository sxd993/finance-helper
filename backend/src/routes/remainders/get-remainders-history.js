import express from 'express';
import {
  Convert,
  Cycle,
  Remainder,
  RemainderRedistribution,
  RemainderRedistributionItem,
} from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';
import { formatDateShort } from '../../utils/dates.js';
import { roundMoney } from './utils/summary.js';

const router = express.Router();

router.get('/history', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    const rows = await RemainderRedistribution.findAll({
      where: { userId },
      include: [
        {
          model: Convert,
          as: 'targetConvert',
          attributes: ['id', 'name', 'typeCode'],
          required: true,
        },
        {
          model: RemainderRedistributionItem,
          as: 'items',
          attributes: ['id', 'amount'],
          required: false,
          include: [
            {
              model: Remainder,
              as: 'remainder',
              attributes: ['id'],
              required: true,
              include: [
                {
                  model: Cycle,
                  as: 'cycle',
                  attributes: ['startDate', 'endDate'],
                  required: true,
                },
              ],
            },
          ],
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
        target_convert: {
          id: data.targetConvert.id,
          name: data.targetConvert.name,
          type_code: data.targetConvert.typeCode,
        },
        sources: (data.items ?? []).map((item) => ({
          id: item.id,
          amount: roundMoney(item.amount),
          start_date: formatDateShort(item.remainder?.cycle?.startDate),
          end_date: formatDateShort(item.remainder?.cycle?.endDate),
        })),
      };
    }));
  } catch (error) {
    console.error('[get-remainders-history] failed', error);
    return res.status(500).json({ message: 'Не удалось получить историю перераспределений' });
  }
});

export default router;
