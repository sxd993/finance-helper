const express = require('express');
const { getUserConverts } = require('./utils/get-user-converts');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/get-converts', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    const rows = await getUserConverts(userId);

    const result = rows.map((r) => {
      const typeObj = r.type ? { id: r.type.id, code: r.type.code, title: r.type.title } : null;
      // Flatten amounts based on available detail
      const overall_limit = r.budget?.overall_limit;
      const current_amount = r.budget?.current_amount ?? r.saving?.current_amount ?? null;
      const target_amount = r.saving?.target_amount ?? null;
      const initial_investment = r.investment?.initial_investment ?? null;
      const current_value = r.investment?.current_value ?? null;
      const last_updated = r.investment?.last_updated ?? null;

      return ({
        id: r.id,
        name: r.name,
        overall_limit: overall_limit != null ? Number(overall_limit) : undefined,
        current_amount: current_amount != null ? Number(current_amount) : undefined,
        target_amount: target_amount != null ? Number(target_amount) : undefined,
        initial_investment: initial_investment != null ? Number(initial_investment) : undefined,
        current_value: current_value != null ? Number(current_value) : undefined,
        last_updated,
        type_id: typeObj,
        type: typeObj,
      })
    });

    res.json(result);
  } catch (error) {
    console.error('Failed to fetch converts', error);
    res.status(500).json({ message: 'Ошибка сервера при получении конвертов' });
  }
});

module.exports = router;
