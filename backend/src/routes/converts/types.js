import express from 'express';
import { requireAuth } from '../../utils/auth.js';
import { getConvertTypes } from './utils/get-convert-types.js';
import { getUserConverts } from './utils/get-user-converts.js';
import { getTypeLimitsMap } from './utils/type-limits.js';

const router = express.Router();

router.get('/types', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    const [types, limits, converts] = await Promise.all([
      getConvertTypes(),
      getTypeLimitsMap({ userId, user: req.user }),
      getUserConverts(userId),
    ]);

    const totalsByType = converts.reduce((acc, convert) => {
      const code = convert.typeCode;
      if (!code) return acc;

      const balance = Number(convert.balance ?? 0);
      acc[code] = (acc[code] ?? 0) + balance;
      return acc;
    }, {});

    const payload = types.map((type) => ({
      id: type.id ?? type.sortOrder ?? null,
      code: type.code,
      title: type.title,
      description: type.description ?? null,
      limit: limits[type.code] != null ? Number(limits[type.code]) : null,
      current_type_amount: Object.prototype.hasOwnProperty.call(totalsByType, type.code)
        ? Number(totalsByType[type.code].toFixed(2))
        : null,
    }));

    res.json(payload);
  } catch (error) {
    console.error('Failed to fetch convert types', error);
    res.status(500).json({ message: 'Ошибка сервера при получении типов конвертов' });
  }
});

export default router;
