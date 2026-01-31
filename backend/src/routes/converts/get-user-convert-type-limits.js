import express from 'express';
import { ConvertTypeLimit } from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';
import { getAllocatedAmount } from './utils/type-limits.js';

const router = express.Router();

router.get('/get-user-converts-type-limits', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;

        const userConverts = await ConvertTypeLimit.findAll({
            where: { user_id: userId },
        });

        const typeCodes = ['important', 'wishes', 'saving', 'investment'];
        const existingCodes = new Set(userConverts.map((row) => row.typeCode));
        const missingCodes = typeCodes.filter((code) => !existingCodes.has(code));

        if (missingCodes.length) {
            const monthlyIncomeNum = Number(req.user?.monthlyIncome) || 0;
            const percentByType = {
                important: Number(req.user?.percentImportant) || 0,
                wishes: Number(req.user?.percentWishes) || 0,
                saving: Number(req.user?.percentSaving) || 0,
                investment: Number(req.user?.percentInvestment) || 0,
            };

            await Promise.all(
                missingCodes.map((typeCode) => {
                    const percent = percentByType[typeCode] ?? 0;
                    const limitAmount = Number(((monthlyIncomeNum * percent) / 100).toFixed(2));
                    return ConvertTypeLimit.upsert({
                        userId,
                        typeCode,
                        limitAmount,
                        distributedAmount: 0,
                    });
                })
            );
        }

        const refreshedConverts = missingCodes.length
            ? await ConvertTypeLimit.findAll({ where: { user_id: userId } })
            : userConverts;

        const limitMap = new Map(
            refreshedConverts.map((row) => [row.typeCode, Number(row.limitAmount) || 0])
        );

        const distributedMap = new Map(
            await Promise.all(
                typeCodes.map(async (typeCode) => {
                    const distributedAmount = await getAllocatedAmount(userId, typeCode);
                    return [typeCode, Number(distributedAmount || 0)];
                })
            )
        );

        // Синхронизируем stored distributed, но ответ строим из вычисленного значения
        await Promise.all(
            typeCodes.map(async (typeCode) => {
                const limitAmount = limitMap.get(typeCode) ?? 0;
                const distributedAmount = distributedMap.get(typeCode) ?? 0;

                await ConvertTypeLimit.upsert({
                    userId,
                    typeCode,
                    limitAmount,
                    distributedAmount,
                });
            })
        );

        const syncedConverts = await ConvertTypeLimit.findAll({ where: { user_id: userId } });

        const orderMap = {
            important: 0,
            wishes: 1,
            saving: 2,
            investment: 3,
        };

        const result = syncedConverts
            .map(({ userId, typeCode, limitAmount = 0, distributedAmount = 0, updatedAt }) => {
                const computedDistributed = distributedMap.get(typeCode) ?? Number(distributedAmount || 0);
                return {
                    userId,
                    typeCode,
                    limitAmount,
                    distributedAmount: computedDistributed,
                    remainderAmount: Number(limitAmount || 0) - Number(computedDistributed || 0),
                    updatedAt,
                };
            })
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
