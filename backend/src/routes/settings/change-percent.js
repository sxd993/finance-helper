router.patch('/settings/change-percent', requireAuth, async (req, res) => {
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
        necessary: toNumber(percent_necessary),
        desire: toNumber(percent_desire),
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
      percentNecessary: newPercents.necessary,
      percentDesire: newPercents.desire,
      percentSaving: newPercents.saving,
      percentInvestment: newPercents.investment,
    }, {
      where: { id: req.userId },
    });

    res.json({
      message: 'Схема распределения обновлена',
      distribution: {
        mode: distributionMode === 'flex' ? 'flex' : 'baseline',
        ...newPercents,
      },
    });
  } catch (error) {
    console.error('Failed to update distribution', error);
    res.status(500).json({ message: 'Не удалось обновить схему распределения' });
  }
});
