const express = require('express');
const { getUserConverts } = require('./utils/get-user-converts');
const { getUserConvertLimits } = require('./utils/get-user-convert-limits');
const { getConvertTypes } = require('./utils/get-convert-types');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/converts-overview', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const convertTypes = await getConvertTypes();
    const converts = await getUserConverts(userId);
    const converts_limit = await getUserConvertLimits(userId);

    if (!converts || converts.length === 0) {
      return res.json(null);
    }

    const typeByCode = new Map(convertTypes.map((t) => [t.code, t]));
    const limitsByTypeId = new Map((converts_limit || []).map(l => [l.type_id, l]));

    const overview = {};
    for (const convert of converts) {
      const code = convert.type.code;
      const key = `convert_${code}`;

      if (!overview[key]) {
        const metaType = typeByCode.get(code);
        const base = {
          currentSum: 0,
          totalSum: null,
          targetAmount: null,
          info: metaType
            ? {
                code: metaType.code,
                title: metaType.title,
                ...(limitsByTypeId.get(metaType.id) || {}),
                type_id: metaType.id,
              }
            : null,
        };

        // Инициализация по типу
        switch (code) {
          case 'wishes':
          case 'important':
            base.totalSum = 0; // для этих типов показываем общий доступный лимит
            break;
          case 'saving':
          case 'investment':
          default:
            base.totalSum = null;
            break;
        }

        overview[key] = base;
      }

      const current = convert.current_amount != null ? Number(convert.current_amount) : 0;
      const overall = convert.overall_limit != null ? Number(convert.overall_limit) : 0;
      const target = convert.target_amount != null ? Number(convert.target_amount) : null;

      // Агрегация по типам
      switch (code) {
        case 'wishes':
        case 'important':
          overview[key].currentSum += current;
          // totalSum существует для этих типов
          overview[key].totalSum += overall;
          // target не используется
          break;

        case 'saving':
          overview[key].currentSum += current;
          if (target != null && overview[key].targetAmount == null) {
            overview[key].targetAmount = target;
          }
          break;

        case 'investment':
        default:
          overview[key].currentSum += current;
          break;
      }
    }

    res.json(overview)
  } catch (error) {
    console.error('Failed to fetch converts overview', error);
    res.status(500).json({ message: 'Ошибка сервера при получении сводки конвертов' });
  }
});

module.exports = router;
