import express from 'express';

import { Operation, ConvertType } from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';

const router = express.Router();
const ALLOWED_TYPES = new Set(['all', 'expense', 'replenishment']);

router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const requestedType = Array.isArray(req.query.operation_type)
      ? req.query.operation_type[0]
      : req.query.operation_type;
    const operationType =
      typeof requestedType === 'string' && ALLOWED_TYPES.has(requestedType)
        ? requestedType
        : 'all';

    const operations = await Operation.findAll({
      where: {
        userId,
        ...(operationType !== 'all' ? { type: operationType } : {}),
      },
      include: [
        {
          model: ConvertType,
          as: 'convertTypeInfo',
          attributes: ['code', 'title'],
          required: false,
        },
      ],
      order: [['occurred_at', 'DESC'], ['id', 'DESC']],
    });

    return res.json({
      operations: operations.map((operation) => {
        const data = operation.toJSON();
        return {
          id: data.id,
          type: data.type,
          source: data.source,
          amount: Number(data.amount),
          occurred_at: Number(data.occurredAt),
          convert_id: data.convertId,
          convert_name: data.convertName,
          convert_type: data.convertType,
          convert_title: data.convertTypeInfo?.title ?? null,
          title: data.title,
          icon_name: data.iconName,
          remainder_redistribution_id: data.remainderRedistributionId,
        };
      }),
    });
  } catch (error) {
    console.error('[history] failed to fetch operations', error);
    return res.status(500).json({ message: 'Не удалось получить историю операций' });
  }
});

export default router;
