import express from 'express';
import { requireAuth } from '../../utils/auth.js';
import { getConvertTypes } from './utils/get-convert-types.js';
import { getUserConverts } from './utils/get-user-converts.js';
import { getTypeLimitsMap, getAllocatedAmount } from './utils/type-limits.js';

const router = express.Router();

router.get('/converts-overview', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const [convertTypes, converts, typeLimits] = await Promise.all([
      getConvertTypes(),
      getUserConverts(userId),
      getTypeLimitsMap({ userId, user: req.user }),
    ]);

    if (!converts.length) return res.json([]);

    const typeByCode = new Map(convertTypes.map((t) => [t.code, t]));
    const grouped = new Map();

    for (const convert of converts) {
      const code = convert.typeCode;
      const meta = typeByCode.get(code);
      if (!meta) continue;

      const currentBalance =
        code === 'important' || code === 'wishes'
          ? Number((Number(convert.spend?.fundedAmount ?? 0) - Number(convert.total_out ?? 0)).toFixed(2))
          : code === 'saving'
            ? Number(convert.saving?.savedAmount ?? 0)
            : code === 'investment'
              ? Number(convert.investment?.currentValue ?? 0)
              : 0;

      if (!grouped.has(code)) {
        const limit = typeLimits[code] != null ? Number(typeLimits[code]) : null;
        grouped.set(code, {
          code,
          currentSum: 0,
          current_convert_limit: limit,
          info: {
            code: meta.code,
            title: meta.title,
            type_id: meta.id ?? meta.sortOrder ?? null,
            is_reset: Boolean(meta.isReset),
            has_limit: Boolean(meta.hasLimit),
            can_spend: Boolean(meta.canSpend),
            convert_type_limit: limit,
            used_limit: 0,
            avaliable_limit: null,
          },
        });
      }

      const entry = grouped.get(code);
      entry.currentSum += currentBalance;
    }

    for (const [code, entry] of grouped.entries()) {
      const used = await getAllocatedAmount(userId, code);
      entry.info.used_limit = Number(used.toFixed(2));
      if (entry.info.convert_type_limit != null) {
        entry.info.avaliable_limit = Number((entry.info.convert_type_limit - entry.info.used_limit).toFixed(2));
      }
    }

    return res.json(Array.from(grouped.values()));
  } catch (error) {
    console.error('Failed to fetch converts overview', error);
    return res.status(500).json({ message: 'Ошибка сервера при получении сводки конвертов' });
  }
});

export default router;
