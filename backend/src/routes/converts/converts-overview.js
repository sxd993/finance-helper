const express = require('express');
const { getUserConverts } = require('./utils/get-user-converts');
const { getConvertTypes } = require('./utils/get-convert-types');
const { requireAuth } = require('../../utils/auth');
const { getTypeLimitsMap } = require('./utils/type-limits');

const router = express.Router();

router.get('/converts-overview', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const convertTypes = await getConvertTypes();
    const converts = await getUserConverts(userId);
    const typeLimits = await getTypeLimitsMap({ userId, user: req.user });

    if (!converts || converts.length === 0) {
      return res.json(null);
    }

    const typeByCode = new Map(convertTypes.map((t) => [t.code, t]));

    const overview = {};
    for (const convert of converts) {
      const code = convert?.type?.code;
      if (!code) continue;

      const key = code;
      if (!overview[key]) {
        const metaType = typeByCode.get(code);
        const limit = typeLimits[code] ?? null;
        overview[key] = {
          currentSum: 0,
          totalSum: limit ?? null,
          targetAmount: code === 'saving' ? 0 : null,
          info: metaType
            ? {
                code: metaType.code,
                title: metaType.title,
                type_id: metaType.id,
                total_limit: limit ?? null,
                used_limit: 0,
                avaliable_limit: limit ?? null,
              }
            : null,
        };
      }

      let usedIncrement = 0;

      switch (code) {
        case 'important': {
          const detail = convert?.important;
          const current = detail?.current_amount != null ? Number(detail.current_amount) : 0;
          const overall = detail?.overall_limit != null ? Number(detail.overall_limit) : 0;
          overview[key].currentSum += current;
          usedIncrement = overall;
          break;
        }
        case 'wishes': {
          const detail = convert?.wishes;
          const current = detail?.current_amount != null ? Number(detail.current_amount) : 0;
          const overall = detail?.overall_limit != null ? Number(detail.overall_limit) : 0;
          overview[key].currentSum += current;
          usedIncrement = overall;
          break;
        }
        case 'saving': {
          const current = convert?.saving?.current_amount != null ? Number(convert.saving.current_amount) : 0;
          const target = convert?.saving?.target_amount != null ? Number(convert.saving.target_amount) : 0;
          overview[key].currentSum += current;
          overview[key].targetAmount += target;
          usedIncrement = target;
          break;
        }
        case 'investment':
        default: {
          const currentValue = convert?.investment?.current_value != null ? Number(convert.investment.current_value) : 0;
          const initial = convert?.investment?.initial_investment != null ? Number(convert.investment.initial_investment) : 0;
          overview[key].currentSum += currentValue;
          usedIncrement = initial;
          break;
        }
      }

      if (overview[key].info) {
        const info = overview[key].info;
        info.used_limit = Number((info.used_limit ?? 0) + (Number.isFinite(usedIncrement) ? usedIncrement : 0));
        const totalLimit = info.total_limit;
        info.avaliable_limit = totalLimit != null
          ? Number((totalLimit - info.used_limit).toFixed(2))
          : null;
      }
    }

    res.json(overview);
  } catch (error) {
    console.error('Failed to fetch converts overview', error);
    res.status(500).json({ message: 'Ошибка сервера при получении сводки конвертов' });
  }
});

module.exports = router;
