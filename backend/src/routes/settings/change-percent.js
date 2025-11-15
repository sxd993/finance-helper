import express from 'express';
import { requireAuth } from '../../utils/auth.js';
import { DEFAULT_DISTRIBUTION } from '../../utils/constants.js';
import { toNumber } from '../../utils/numbers.js';
import { User } from '../../db/index.js';

const router = express.Router();

router.patch('/', requireAuth, async (req, res) => {
  const {
    distribution_mode: distributionMode = 'baseline',
    percent_necessary,
    percent_desire,
    percent_saving,
    percent_investment,
  } = req.body || {};

  try {
    let newPercents = { ...DEFAULT_DISTRIBUTION };

    if (distributionMode === 'flex') {
      const percents = {
        important: toNumber(percent_necessary),
        wishes: toNumber(percent_desire),
        saving: toNumber(percent_saving),
        investment: toNumber(percent_investment),
      };

      const total = Object.values(percents).reduce((sum, value) => sum + value, 0);
      if (total <= 0 || Math.abs(total - 100) > 0.01) {
        return res.status(400).json({ message: 'Сумма процентов должна равняться 100' });
      }

      newPercents = percents;
    }

    await User.update({
      distributionMode: distributionMode === 'flex' ? 'flex' : 'baseline',
      percentImportant: newPercents.important,
      percentWishes: newPercents.wishes,
      percentSaving: newPercents.saving,
      percentInvestment: newPercents.investment,
    }, {
      where: { id: req.userId },
    });

    res.json({
      message: 'Схема распределения обновлена',
      distribution: {
        mode: distributionMode === 'flex' ? 'flex' : 'baseline',
        percent_important: newPercents.important,
        percent_wishes: newPercents.wishes,
        percent_saving: newPercents.saving,
        percent_investment: newPercents.investment,
      },
    });
  } catch (error) {
    console.error('Failed to update distribution', error);
    res.status(500).json({ message: 'Не удалось обновить схему распределения' });
  }
});

export default router;
