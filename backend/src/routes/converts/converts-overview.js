const express = require('express');
const { sequelize, Convert, ConvertType } = require('../../db');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/converts-overview', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    // 1️⃣ Получаем все типы конвертов
    const convertTypes = await ConvertType.findAll({
      attributes: ['id', 'code', 'title', 'hasLimit', 'accumulates'],
      raw: true,
    });

    // 2️⃣ Получаем все конверты пользователя
    const converts = await Convert.findAll({
      where: { userId },
      attributes: ['current_amount', 'monthly_limit', 'target_amount'],
      include: [
        {
          model: ConvertType,
          as: 'type',
          attributes: ['code'],
        },
      ],
      raw: true,
      nest: true,
    });

    // Если у пользователя нет конвертов — вернуть null
    if (!converts || converts.length === 0) {
      return res.json(null);
    }

    // 3️⃣ Готовим справочник типов по коду
    const typeByCode = new Map(convertTypes.map((t) => [t.code, t]));

    // 4️⃣ Агрегируем суммы только по типам, которые есть у пользователя
    const overview = {};
    for (const convert of converts) {
      const code = convert.type.code;
      const key = `convert_${code}`;

      if (!overview[key]) {
        const metaType = typeByCode.get(code);
        overview[key] = {
          currentSum: 0,
          totalSum: 0,
          target_amount: null,
          meta: metaType
            ? {
                id: metaType.id,
                title: metaType.title,
                hasLimit: metaType.hasLimit,
                accumulates: metaType.accumulates,
              }
            : null,
        };
      }

      overview[key].currentSum += Number(convert.current_amount);
      overview[key].totalSum += Number(convert.monthly_limit);

      if (convert.targetAmount && !overview[key].target_amount) {
        overview[key].targetAmount = Number(convert.target_amount);
      }
    }

    // 5️⃣ Отправляем результат
    res.json(overview);
  } catch (error) {
    console.error('Failed to fetch converts overview', error);
    res.status(500).json({ message: 'Ошибка сервера при получении сводки конвертов' });
  }
});

module.exports = router;
