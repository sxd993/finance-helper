import express from 'express';
import {
  sequelize,
  Convert,
  ConvertType,
  ConvertSpend,
  ConvertSaving,
  ConvertInvestment,
} from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';
import { ensureWithinTypeLimit } from './utils/type-limits.js';

const router = express.Router();

const toNumberOrNull = (val) => {
  if (val === null || val === undefined || val === '') return null;
  const num = Number(val);
  return Number.isFinite(num) ? num : null;
};

router.post('/add-convert', requireAuth, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.userId;
    const payload = req.body?.convert || {};
    const {
      name,
      type_code: typeCode,
      is_active: isActiveRaw = true,
      monthly_limit: monthlyLimitRaw = null,
      funded_amount: fundedAmountRaw = null,
      goal_amount: goalAmountRaw = null,
      saved_amount: savedAmountRaw = null,
      invested_amount: investedAmountRaw = null,
      current_value: currentValueRaw = null,
    } = payload;

    if (!name || !typeCode) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Поля name и type_code обязательны' });
    }

    const existingByName = await Convert.findOne({ where: { userId, name, isActive: true }, transaction });
    if (existingByName) {
      await transaction.rollback();
      return res.status(409).json({
        message: 'Конверт с таким названием уже существует',
        code: 'DUPLICATE_NAME',
        existing_id: existingByName.id,
      });
    }

    const convertType = await ConvertType.findOne({ where: { code: typeCode }, transaction });
    if (!convertType) {
      await transaction.rollback();
      return res.status(400).json({ message: `Неизвестный тип конверта: ${typeCode}` });
    }

    const isActive = Boolean(isActiveRaw);
    const created = await Convert.create({
      userId,
      typeCode: convertType.code,
      name,
      isActive,
    }, { transaction });

    if (typeCode === 'important' || typeCode === 'wishes') {
      const monthlyLimit = toNumberOrNull(monthlyLimitRaw) ?? 0;
      const fundedAmount = toNumberOrNull(fundedAmountRaw) ?? monthlyLimit;

      const limitCheck = await ensureWithinTypeLimit({
        userId,
        user: req.user,
        typeCode,
        amount: monthlyLimit,
        transaction,
        convertType,
      });

      if (!limitCheck.valid) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Превышен лимит для данного типа конверта.`,
          code: 'TYPE_LIMIT_EXCEEDED',
          limit: limitCheck.limit,
          used: limitCheck.used,
          required: limitCheck.required,
          available: limitCheck.available,
        });
      }

      await ConvertSpend.create({
        convertId: created.id,
        monthlyLimit: monthlyLimit,
        fundedAmount: fundedAmount,
      }, { transaction });
    } else if (typeCode === 'saving') {
      const goalAmount = toNumberOrNull(goalAmountRaw) ?? 0;
      const savedAmount = toNumberOrNull(savedAmountRaw) ?? 0;
      await ConvertSaving.create({
        convertId: created.id,
        goalAmount,
        savedAmount,
      }, { transaction });
    } else if (typeCode === 'investment') {
      const investedAmount = toNumberOrNull(investedAmountRaw) ?? 0;
      const currentValue = toNumberOrNull(currentValueRaw) ?? investedAmount;
      await ConvertInvestment.create({
        convertId: created.id,
        investedAmount,
        currentValue,
      }, { transaction });
    } else {
      await transaction.rollback();
      return res.status(400).json({ message: `Для типа ${typeCode} не описана модель данных` });
    }

    await transaction.commit();

    return res.status(201).json({
      id: created.id,
      name: created.name,
      type_code: typeCode,
      is_active: created.isActive,
    });
  } catch (error) {
    console.error('Не удалось создать конверт', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Ошибка сервера при создании конверта' });
  }
});

export default router;
