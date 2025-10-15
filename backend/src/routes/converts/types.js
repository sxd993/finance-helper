const express = require('express');
const {
  ConvertType,
  Convert,
  ConvertImportantDetails,
  ConvertWishesDetails,
  ConvertSavingDetails,
  ConvertInvestmentDetails,
} = require('../../db');
const { requireAuth } = require('../../utils/auth');
const { getTypeLimitsMap } = require('./utils/type-limits');

const router = express.Router();

router.get('/types', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    const types = await ConvertType.findAll({
      attributes: ['id', 'code', 'title'],
      order: [['id', 'ASC']],
    });
    const limits = await getTypeLimitsMap({ userId, user: req.user });

    const converts = await Convert.findAll({
      where: { userId },
      attributes: ['typeCode'],
      include: [
        { model: ConvertImportantDetails, as: 'important', attributes: ['current_amount'], required: false },
        { model: ConvertWishesDetails, as: 'wishes', attributes: ['current_amount'], required: false },
        { model: ConvertSavingDetails, as: 'saving', attributes: ['current_amount'], required: false },
        { model: ConvertInvestmentDetails, as: 'investment', attributes: ['current_value'], required: false },
      ],
      raw: true,
      nest: true,
    });

    const currentAmountByType = {};
    for (const convert of converts) {
      const code = convert?.typeCode;
      if (!code) continue;

      let amount = 0;
      switch (code) {
        case 'important':
          amount = convert?.important?.current_amount != null ? Number(convert.important.current_amount) : 0;
          break;
        case 'wishes':
          amount = convert?.wishes?.current_amount != null ? Number(convert.wishes.current_amount) : 0;
          break;
        case 'saving':
          amount = convert?.saving?.current_amount != null ? Number(convert.saving.current_amount) : 0;
          break;
        case 'investment':
          amount = convert?.investment?.current_value != null ? Number(convert.investment.current_value) : 0;
          break;
        default:
          amount = 0;
      }

      if (!Number.isFinite(amount)) {
        continue;
      }

      currentAmountByType[code] = (currentAmountByType[code] ?? 0) + amount;
    }

    const payload = types.map((type) => ({
      id: type.id,
      code: type.code,
      title: type.title,
      limit: limits[type.code] ?? null,
      current_type_amount: Object.prototype.hasOwnProperty.call(currentAmountByType, type.code)
        ? Number(currentAmountByType[type.code].toFixed(2))
        : null,
    }));

    res.json(payload);
  } catch (error) {
    console.error('Failed to fetch convert types', error);
    res.status(500).json({ message: 'Ошибка сервера при получении типов конвертов' });
  }
});

module.exports = router;
