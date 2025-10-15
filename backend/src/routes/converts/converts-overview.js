const express = require('express');
const { getUserConverts } = require('./utils/get-user-converts');
const { getConvertTypes } = require('./utils/get-convert-types');
const { requireAuth } = require('../../utils/auth');
const { getTypeLimitsMap } = require('./utils/type-limits');

const router = express.Router();

const sumNumber = (value) => (Number.isFinite(value) ? value : 0);

router.get('/converts-overview', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const [convertTypes, converts, typeLimits] = await Promise.all([
      getConvertTypes(),
      getUserConverts(userId),
      getTypeLimitsMap({ userId, user: req.user }),
    ]);

    if (!converts || converts.length === 0) {
      return res.json(null);
    }

    const typeByCode = new Map(convertTypes.map((type) => [type.code, type]));
    const overview = {};

    for (const convert of converts) {
      const code = convert.typeCode;
      const metaType = typeByCode.get(code);
      if (!code || !metaType) continue;

      if (!overview[code]) {
        const limit = typeLimits[code] ?? null;
        overview[code] = {
          currentSum: 0,
          totalSum: limit != null ? Number(limit) : null,
          targetAmount: code === 'saving' ? 0 : null,
          info: {
            code: metaType.code,
            title: metaType.title,
            type_id: metaType.id ?? metaType.sortOrder ?? null,
            total_limit: limit != null ? Number(limit) : null,
            used_limit: 0,
            avaliable_limit: limit != null ? Number(limit) : null,
          },
        };
      }

      const entry = overview[code];
      const balance = Number(convert.balance ?? 0);
      const targetAmount = convert.targetAmount != null ? Number(convert.targetAmount) : 0;
      const initialAmount = convert.initialAmount != null ? Number(convert.initialAmount) : 0;

      let usedIncrement = 0;

      switch (code) {
        case 'important':
        case 'wishes': {
          entry.currentSum += balance;
          usedIncrement = targetAmount;
          break;
        }
        case 'saving': {
          entry.currentSum += balance;
          entry.targetAmount += targetAmount;
          usedIncrement = targetAmount;
          break;
        }
        case 'investment': {
          entry.currentSum += balance;
          usedIncrement = initialAmount;
          break;
        }
        default: {
          entry.currentSum += balance;
          usedIncrement = targetAmount || initialAmount;
        }
      }

      if (entry.info) {
        entry.info.used_limit = Number(
          (entry.info.used_limit ?? 0) + sumNumber(usedIncrement),
        );
        if (entry.info.total_limit != null) {
          entry.info.avaliable_limit = Number(
            (entry.info.total_limit - entry.info.used_limit).toFixed(2),
          );
        } else {
          entry.info.avaliable_limit = null;
        }
      }
    }

    return res.json(overview);
  } catch (error) {
    console.error('Failed to fetch converts overview', error);
    res.status(500).json({ message: 'Ошибка сервера при получении сводки конвертов' });
  }
});

module.exports = router;
