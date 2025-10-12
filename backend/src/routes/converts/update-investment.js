const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { ConvertInvestmentDetails } = require('../../db');

const router = express.Router();

router.patch('/:id/investment', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { initial_investment, current_value } = req.body || {};

    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: 'Некорректный id' });
    }

    const payload = {
      convertId: id,
      initial_investment: initial_investment !== undefined ? Number(initial_investment) || 0 : null,
      current_value: current_value !== undefined ? Number(current_value) || 0 : null,
      last_updated: new Date(),
    };

    const [row, created] = await ConvertInvestmentDetails.findOrCreate({
      where: { convertId: id },
      defaults: payload,
    });

    if (!created) {
      await row.update(payload);
    }

    return res.json({
      id,
      initial_investment: row.initial_investment,
      current_value: row.current_value,
      last_updated: row.last_updated,
    });
  } catch (e) {
    console.error('update investment error', e);
    return res.status(500).json({ message: 'Ошибка сервера при обновлении инвестиций' });
  }
});

module.exports = router;
