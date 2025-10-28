import express from 'express';

import { requireAuth } from '../../utils/auth.js';
import { getUserTypeLimitsOverview } from './utils/type-limits.js';

const router = express.Router();

router.get('/type-limits', requireAuth, async (req, res) => {
  try {
    const { userId, user } = req;

    const limits = await getUserTypeLimitsOverview({ userId, user });

    res.json({
      user: {
        monthly_income: user?.monthlyIncome ?? null,
        distribution_mode: user?.distributionMode ?? null,
        percent_important: user?.percentImportant ?? null,
        percent_wishes: user?.percentWishes ?? null,
        percent_saving: user?.percentSaving ?? null,
        percent_investment: user?.percentInvestment ?? null,
      },
      limits,
    });
  } catch (error) {
    console.error('Failed to fetch user type limits', error);
    res
      .status(500)
      .json({ message: 'Не удалось получить информацию о лимитах пользователя' });
  }
});

export default router;
