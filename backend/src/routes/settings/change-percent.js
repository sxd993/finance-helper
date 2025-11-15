import express from 'express';
import { requireAuth } from '../../utils/auth.js';
import { toNumber } from '../../utils/numbers.js';
import { User } from '../../db/index.js';

const router = express.Router();

const getPercent = (primary, fallback) => toNumber(primary ?? fallback);

router.patch('/', requireAuth, async (req, res) => {
  const {
    percentImportant,
    percentWishes,
    percentSaving,
    percentInvestment,
    percent_important,
    percent_wishes,
    percent_saving,
    percent_investment,
  } = req.body || {};

  try {
    const newPercents = {
      important: getPercent(percentImportant, percent_important),
      wishes: getPercent(percentWishes, percent_wishes),
      saving: getPercent(percentSaving, percent_saving),
      investment: getPercent(percentInvestment, percent_investment),
    };

    const total = Object.values(newPercents).reduce((sum, value) => sum + value, 0);
    if (total <= 0 || Math.abs(total - 100) > 0.01) {
      return res.status(400).json({ message: 'Сумма процентов должна равняться 100' });
    }

    await User.update({
      percentImportant: newPercents.important,
      percentWishes: newPercents.wishes,
      percentSaving: newPercents.saving,
      percentInvestment: newPercents.investment,
    }, {
      where: { id: req.userId },
    });

    res.json({
      message: 'Новые настройки применятся в слеудующем финансовом цикле',
      distribution: {
        percentImportant: newPercents.important,
        percentWishes: newPercents.wishes,
        percentSaving: newPercents.saving,
        percentInvestment: newPercents.investment,
      },
    });
  } catch (error) {
    console.error('Failed to update distribution', error);
    res.status(500).json({ message: 'Не удалось обновить схему распределения' });
  }
});

export default router;
