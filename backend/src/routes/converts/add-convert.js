const express = require('express');
const {
  sequelize,
  Convert,
  ConvertType,
  Transaction,
} = require('../../db');
const { requireAuth } = require('../../utils/auth');
const { ensureWithinTypeLimit } = require('./utils/type-limits');

const router = express.Router();

router.post('/add-convert', requireAuth, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.userId;
    const payload = (req.body && req.body.convert) || {};
    console.log('[add-convert] incoming payload:', JSON.stringify(payload));

    const {
      name,
      type_code: typeCode,
      current_amount: currentRaw = null,
      target_amount: targetRaw = null,
      overall_limit: legacyLimitRaw = null,
      initial_amount: initialAmountRaw = null,
      initial_investment: legacyInitialRaw = null,
      current_value: currentValueRaw = null,
      is_active: isActiveRaw = true,
    } = payload;

    if (!name || !typeCode) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Поля name и type_code обязательны' });
    }

    // Проверяем, что конверт с таким названием у пользователя ещё не существует
    const existingByName = await Convert.findOne({ where: { userId, name }, transaction });
    if (existingByName) {
      await transaction.rollback();
      return res.status(409).json({
        message: 'Конверт с таким названием уже существует',
        code: 'DUPLICATE_NAME',
        existing_id: existingByName.id,
      });
    }

    // Находим тип конверта
    const convertType = await ConvertType.findOne({ where: { code: typeCode } });
    if (!convertType) {
      await transaction.rollback();
      return res.status(400).json({ message: `Неизвестный тип конверта: ${typeCode}` });
    }

    // Преобразования
    const toNumberOrNull = (val) => {
      const num = Number(val);
      return Number.isFinite(num) ? num : null;
    };

    const currentAmount = toNumberOrNull(currentRaw);
    const targetAmount = toNumberOrNull(targetRaw);
    const fallbackLimit = toNumberOrNull(legacyLimitRaw);
    const effectiveTarget = targetAmount != null ? targetAmount : fallbackLimit;
    const initialInvestment = toNumberOrNull(legacyInitialRaw);
    const initialAmount = toNumberOrNull(initialAmountRaw);
    const currentValue = toNumberOrNull(currentValueRaw);
    const isActive = Boolean(isActiveRaw);

    const convertPayload = {
      userId,
      cycleId: null,
      typeCode: convertType.code,
      name,
      isActive,
      targetAmount: null,
      initialAmount: null,
    };

    let allocationAmount = 0;
    let initialDeposit = null;

    switch (typeCode) {
      case 'important': {
        convertPayload.targetAmount = effectiveTarget != null ? effectiveTarget : 0;
        allocationAmount = convertPayload.targetAmount ?? 0;
        initialDeposit = currentAmount;
        break;
      }

      case 'wishes': {
        convertPayload.targetAmount = effectiveTarget != null ? effectiveTarget : 0;
        allocationAmount = convertPayload.targetAmount ?? 0;
        initialDeposit = currentAmount;
        break;
      }

      case 'saving': {
        if (effectiveTarget == null) {
          await transaction.rollback();
          return res.status(400).json({ message: 'Для saving требуется target_amount' });
        }
        convertPayload.targetAmount = effectiveTarget;
        allocationAmount = convertPayload.targetAmount ?? 0;
        initialDeposit = currentAmount;
        break;
      }

      case 'investment': {
        convertPayload.initialAmount = initialAmount != null
          ? initialAmount
          : (initialInvestment != null ? initialInvestment : 0);
        allocationAmount = convertPayload.initialAmount ?? 0;
        if (currentValue != null) {
          initialDeposit = currentValue;
        } else if (allocationAmount) {
          initialDeposit = allocationAmount;
        }
        break;
      }

      default:
        await transaction.rollback();
        return res.status(400).json({ message: `Обработчик для типа ${typeCode} не найден` });
    }

    const limitCheck = await ensureWithinTypeLimit({
      userId,
      user: req.user,
      typeCode,
      amount: allocationAmount,
      transaction,
    });

    if (!limitCheck.valid) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Превышен лимит для типа ${typeCode}`,
        code: 'TYPE_LIMIT_EXCEEDED',
        limit: limitCheck.limit,
        used: limitCheck.used,
        required: limitCheck.required,
        available: limitCheck.available,
      });
    }

    // Формируем данные для создания конверта
    const created = await Convert.create(convertPayload, { transaction });

    if (initialDeposit != null && initialDeposit > 0) {
      await Transaction.create({
        convertId: created.id,
        type: 'deposit',
        amount: initialDeposit,
        note: 'Initial funding',
      }, { transaction });
    }

    await transaction.commit();

    console.log('[add-convert] created base convert:', created.toJSON());

    return res.status(201).json({
      id: created.id,
      name: created.name,
      type_code: typeCode,
      is_active: Boolean(created.isActive),
      target_amount: convertPayload.targetAmount != null ? Number(convertPayload.targetAmount) : null,
      initial_amount: convertPayload.initialAmount != null ? Number(convertPayload.initialAmount) : null,
    });
  } catch (error) {
    console.error('Не удалось создать конверт', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Ошибка сервера при создании конверта' });
  }
});

module.exports = router;
