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

        const result = userConverts.map(({ userId, typeCode, limitAmount = 0, distributedAmount = 0, updatedAt }) => ({
            userId,
            typeCode,
            limitAmount,
            distributedAmount,
            remainderAmount: limitAmount - distributedAmount,
            updatedAt,
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при получении конвертов пользователя' });
    }
});

export default router;