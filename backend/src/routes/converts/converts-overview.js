const express = require('express');
const { getUserConverts } = require('./utils/get-user-converts');
const { getConvertTypes } = require('./utils/get-convert-types');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/converts-overview', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const convertTypes = await getConvertTypes();
    const converts = await getUserConverts(userId);

    if (!converts || converts.length === 0) {
      return res.json(null);
    }

    const typeByCode = new Map(convertTypes.map((t) => [t.code, t]));

    const overview = {};
    for (const convert of converts) {
      const code = convert?.type?.code;
      if (!code) continue;
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
                type_id: metaType.id,
              }
            : null,
        };

        // Инициализация по типу (4 разных варианта)
        switch (code) {
          case 'wishes':
          case 'important':
            base.totalSum = 0; // суммируем общий доступный лимит по бюджету
            break;
          case 'saving':
            base.totalSum = 0; // суммируем целевые значения для отображения «из»
            base.targetAmount = 0;
            break;
          case 'investment':
          default:
            base.totalSum = null; // для инвестиций общий лимит не отображаем
            break;
        }

        overview[key] = base;
      }

      // Агрегация по типам на основе вложенных полей, как в get-converts
      switch (code) {
        case 'wishes':
        case 'important': {
          const current = convert?.budget?.current_amount != null ? Number(convert.budget.current_amount) : 0;
          const overall = convert?.budget?.overall_limit != null ? Number(convert.budget.overall_limit) : 0;
          overview[key].currentSum += current;
          overview[key].totalSum += overall;

          // Обновим динамическую информацию по лимитам
          if (overview[key].info) {
            const used_limit = overview[key].currentSum;
            const total_limit = overview[key].totalSum;
            overview[key].info = {
              ...overview[key].info,
              total_limit,
              used_limit,
              avaliable_limit: (total_limit ?? 0) - (used_limit ?? 0),
            };
          }
          break;
        }
        case 'saving': {
          const current = convert?.saving?.current_amount != null ? Number(convert.saving.current_amount) : 0;
          const target = convert?.saving?.target_amount != null ? Number(convert.saving.target_amount) : 0;
          overview[key].currentSum += current;
          overview[key].totalSum += target; // отображаем общую цель «из»
          overview[key].targetAmount += target;
          break;
        }
        case 'investment':
        default: {
          // Для инвестиций показываем суммарную текущую стоимость портфеля
          const currentValue = convert?.investment?.current_value != null ? Number(convert.investment.current_value) : 0;
          overview[key].currentSum += currentValue;
          break;
        }
      }
    }

    res.json(overview)
  } catch (error) {
    console.error('Failed to fetch converts overview', error);
    res.status(500).json({ message: 'Ошибка сервера при получении сводки конвертов' });
  }
});

module.exports = router;
