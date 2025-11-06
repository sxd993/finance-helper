import express from 'express';
import { ConvertTypeLimit } from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';

const router = express.Router();

router.get('/get-user-converts-type-limits', requireAuth, async (req, res) => {
    try {
        const user_id = req.userId;

        const userConverts = await ConvertTypeLimit.findAll({
            where: { user_id },
        });

        res.json(userConverts);
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при получении конвертов пользователя' });
    }
    
});

export default router;
