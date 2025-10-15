const express = require('express');
const { getUserConverts } = require('./utils/get-user-converts');
const { requireAuth } = require('../../utils/auth');
const { getTypeLimitsMap } = require('./utils/type-limits');

const router = express.Router();

router.get('/get-converts', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    const rows = await getUserConverts(userId);
    const typeLimits = await getTypeLimitsMap({ userId, user: req.user });

    const result = rows.map((r) => {
      const code = r.type?.code;

      let overall_limit;
      let current_amount;
      let target_amount;
      let initial_investment;
      let current_value;
      let last_updated;
      let type_limit;

      switch (code) {
        case 'important': {
          overall_limit = r.important?.overall_limit ?? null;
          current_amount = r.important?.current_amount ?? null;
          target_amount = null;
          initial_investment = null;
          current_value = null;
          last_updated = null;
          type_limit = typeLimits[code] ?? null;
          break;
        }
        case 'wishes': {
          overall_limit = r.wishes?.overall_limit ?? null;
          current_amount = r.wishes?.current_amount ?? null;
          target_amount = null;
          initial_investment = null;
          current_value = null;
          last_updated = null;
          type_limit = typeLimits[code] ?? null;
          break;
        }
        case 'saving': {
          overall_limit = null;
          current_amount = r.saving?.current_amount ?? null;
          target_amount = r.saving?.target_amount ?? null;
          initial_investment = null;
          current_value = null;
          last_updated = null;
          type_limit = typeLimits[code] ?? null;
          break;
        }
        case 'investment': {
          overall_limit = null;
          current_amount = null;
          target_amount = null;
          initial_investment = r.investment?.initial_investment ?? null;
          current_value = r.investment?.current_value ?? null;
          last_updated = r.investment?.last_updated ?? null;
          type_limit = typeLimits[code] ?? null;
          break;
        }
        default: {
          overall_limit = null;
          current_amount = null;
          target_amount = null;
          initial_investment = null;
          current_value = null;
          last_updated = null;
          type_limit = null;
        }
      }

      const typeObj = r.type ? {
        id: r.type.id,
        code: r.type.code,
        title: r.type.title,
        limit: type_limit != null ? Number(type_limit) : undefined,
      } : null;

      return ({
        id: r.id,
        name: r.name,
        overall_limit: overall_limit != null ? Number(overall_limit) : undefined,
        current_amount: current_amount != null ? Number(current_amount) : undefined,
        target_amount: target_amount != null ? Number(target_amount) : undefined,
        initial_investment: initial_investment != null ? Number(initial_investment) : undefined,
        current_value: current_value != null ? Number(current_value) : undefined,
        last_updated,
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
