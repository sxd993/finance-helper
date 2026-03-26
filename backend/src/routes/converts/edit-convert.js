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

router.patch('/edit-convert/:id', requireAuth, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.userId;
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Некорректный id конверта' });
    }

    const payload = req.body?.convert || req.body || {};
    const {
      name,
      type_code: typeCodeRaw,
      is_active: isActiveRaw,
      monthly_limit: monthlyLimitRaw,
      funded_amount: fundedAmountRaw,
      goal_amount: goalAmountRaw,
      saved_amount: savedAmountRaw,
      invested_amount: investedAmountRaw,
      current_value: currentValueRaw,
    } = payload;

    if (!name) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Поле name обязательно' });
    }

    const convert = await Convert.findOne({ where: { id, userId }, transaction });
    if (!convert) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Конверт не найден' });
    }

    const nextTypeCode = typeCodeRaw || convert.typeCode;
    const convertType = await ConvertType.findOne({ where: { code: nextTypeCode }, transaction });
    if (!convertType) {
      await transaction.rollback();
      return res.status(400).json({ message: `Неизвестный тип конверта: ${nextTypeCode}` });
    }

    const duplicate = await Convert.findOne({ where: { userId, name, isActive: true }, transaction });
    if (duplicate && duplicate.id !== id) {
      await transaction.rollback();
      return res.status(409).json({
        message: 'Конверт с таким названием уже существует',
        code: 'DUPLICATE_NAME',
        existing_id: duplicate.id,
      });
    }

    await convert.update({
      name,
      typeCode: convertType.code,
      isActive: isActiveRaw === undefined ? convert.isActive : Boolean(isActiveRaw),
    }, { transaction });

    if (nextTypeCode === 'important' || nextTypeCode === 'wishes') {
      const existingSpend = await ConvertSpend.findByPk(id, { transaction });
      const monthlyLimit = toNumberOrNull(monthlyLimitRaw) ?? Number(existingSpend?.monthlyLimit ?? 0);
      const fundedAmount = toNumberOrNull(fundedAmountRaw) ?? Number(existingSpend?.fundedAmount ?? monthlyLimit);

      const limitCheck = await ensureWithinTypeLimit({
        userId,
        user: req.user,
        typeCode: nextTypeCode,
        amount: monthlyLimit,
        transaction,
        excludeConvertId: id,
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

      await ConvertSpend.upsert({
        convertId: id,
        monthlyLimit,
        fundedAmount,
      }, { transaction });
    }

    if (nextTypeCode === 'saving') {
      const existing = await ConvertSaving.findByPk(id, { transaction });
      await ConvertSaving.upsert({
        convertId: id,
        goalAmount: toNumberOrNull(goalAmountRaw) ?? Number(existing?.goalAmount ?? 0),
        savedAmount: toNumberOrNull(savedAmountRaw) ?? Number(existing?.savedAmount ?? 0),
      }, { transaction });
    }

    if (nextTypeCode === 'investment') {
      const existing = await ConvertInvestment.findByPk(id, { transaction });
      await ConvertInvestment.upsert({
        convertId: id,
        investedAmount: toNumberOrNull(investedAmountRaw) ?? Number(existing?.investedAmount ?? 0),
        currentValue: toNumberOrNull(currentValueRaw) ?? Number(existing?.currentValue ?? 0),
      }, { transaction });
    }

    await transaction.commit();

    return res.json({
      id,
      name: convert.name,
      type_code: convert.typeCode,
      is_active: Boolean(convert.isActive),
    });
  } catch (error) {
    console.error('[edit-convert] error:', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Ошибка сервера при обновлении конверта' });
  }
});

export default router;
