import express from 'express';
import { ConvertTypeLimit } from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';

const router = express.Router();

router.get('/get-user-converts-type-limits', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;

        const userConverts = await ConvertTypeLimit.findAll({
            where: { user_id: userId },
        });

        const orderMap = {
            important: 0,
            wishes: 1,
            saving: 2,
            investment: 3,
        };

        const result = userConverts
            .map(({ userId, typeCode, limitAmount = 0, distributedAmount = 0, updatedAt }) => ({
                userId,
                typeCode,
                limitAmount,
                distributedAmount,
                remainderAmount: limitAmount - distributedAmount,
                updatedAt,
            }))
            .sort((a, b) => {
                const orderA = orderMap[a.typeCode] ?? Number.MAX_SAFE_INTEGER;
                const orderB = orderMap[b.typeCode] ?? Number.MAX_SAFE_INTEGER;
                return orderA - orderB;
            });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при получении конвертов пользователя' });
    }
});

export default router;
