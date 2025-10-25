import express from 'express';
import { getUserConverts } from './utils/get-user-converts.js';
import { getConvertTypes } from './utils/get-convert-types.js';
import { requireAuth } from '../../utils/auth.js';
import { getTypeLimitsMap } from './utils/type-limits.js';

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
          current_convert_limit: convert.targetAmount != null ? Number(convert.targetAmount) : null,
          info: {
            code: metaType.code,
            title: metaType.title,
            type_id: metaType.id ?? metaType.sortOrder ?? null,
            convert_type_limit: limit != null ? Number(limit) : null,
          },
        };
      }

      const entry = overview[code];

      // --- корректный расчёт текущего баланса ---
      const initialAmount = Number(convert.initialAmount ?? 0);
      const transactionsSum = Number(convert.transactionsSum ?? 0);
      const currentBalance = initialAmount - transactionsSum;
      // -----------------------------------------

      entry.currentSum += currentBalance;

      const targetAmount = Number(convert.targetAmount ?? 0);
      const usedIncrement = targetAmount || initialAmount;

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

    return res.json(overview);
  } catch (error) {
    console.error('Failed to fetch converts overview', error);
    res
      .status(500)
      .json({ message: 'Ошибка сервера при получении сводки конвертов' });
  }
});

export default router;
