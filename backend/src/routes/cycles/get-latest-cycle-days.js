import express from 'express';
import { requireAuth } from '../../utils/auth.js';
import { Cycle } from '../../db/index.js';
import {
  calculateDaysRemaining,
  toDateOnly,
} from './utils.js';

const router = express.Router();

router.get('/remaining-days', requireAuth, async (req, res, next) => {
  try {
    const userId = req.userId;

    const latestCycle = await Cycle.findOne({
      where: { userId },
      order: [['startDate', 'DESC']],
    });

    if (!latestCycle) {
      return res.status(404).json({ message: 'Cycle not found for the user' });
    }

    const startDate = toDateOnly(latestCycle.startDate);
    if (!startDate) {
      return res.status(422).json({ message: 'Cycle start date is invalid' });
    }
    const daysRemaining = calculateDaysRemaining(startDate);
    return res.json({ daysRemaining });
  } catch (error) {
    return next(error);
  }
});

export default router;
