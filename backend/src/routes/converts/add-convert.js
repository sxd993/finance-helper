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
    const payload = req.body?.convert || {};
    console.log('[add-convert] incoming payload:', JSON.stringify(payload));

    const {
      name,
      type_code: typeCode,
      target_amount: targetRaw = null,
      initial_amount: initialAmountRaw = null,
      is_active: isActiveRaw = true,
    } = payload;

    if (!name || !typeCode) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Поля name и type_code обязательны' });
    }

    // Проверка на дубликат по имени
    const existingByName = await Convert.findOne({ where: { userId, name }, transaction });
    if (existingByName) {
      await transaction.rollback();
      return res.status(409).json({
        message: 'Конверт с таким названием уже существует',
        code: 'DUPLICATE_NAME',
        existing_id: existingByName.id,
      });
    }

    // Проверка существующего типа
    const convertType = await ConvertType.findOne({ where: { code: typeCode } });
    if (!convertType) {
      await transaction.rollback();
      return res.status(400).json({ message: `Неизвестный тип конверта: ${typeCode}` });
    }

    // Преобразование числовых значений
    const toNumberOrNull = (val) => {
      const num = Number(val);
      return Number.isFinite(num) ? num : null;
    };

    const targetAmount = toNumberOrNull(targetRaw);
    const initialAmount = toNumberOrNull(initialAmountRaw);
    const isActive = Boolean(isActiveRaw);

    // Основная запись
    const convertPayload = {
      userId,
      typeCode: convertType.code,
      name,
      isActive,
      targetAmount: null,
      initialAmount: null,
    };

    // allocationAmount — сколько "запрашивается" из лимита
    let allocationAmount = 0;

    switch (typeCode) {
      case 'important':
      case 'wishes':
        convertPayload.targetAmount = targetAmount ?? 0;
        convertPayload.initialAmount = initialAmount ?? 0;
        allocationAmount = convertPayload.targetAmount;
        break;

      case 'saving':
        if (targetAmount == null) {
          await transaction.rollback();
          return res.status(400).json({ message: 'Для saving требуется target_amount' });
        }
        convertPayload.targetAmount = targetAmount;
        convertPayload.initialAmount = initialAmount ?? 0;
        allocationAmount = convertPayload.targetAmount;
        break;

      case 'investment':
        convertPayload.initialAmount = initialAmount ?? 0;
        allocationAmount = convertPayload.initialAmount;
        break;

      default:
        await transaction.rollback();
        return res.status(400).json({ message: `Обработчик для типа ${typeCode} не найден` });
    }

    // Проверяем лимиты пользователя
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

    // Создаём конверт
    const created = await Convert.create(convertPayload, { transaction });

    // Добавляем стартовую транзакцию, если есть баланс
    if (initialAmount && initialAmount > 0) {
      await Transaction.create({
        convertId: created.id,
        type: 'deposit',
        amount: initialAmount,
        note: 'Initial balance',
      }, { transaction });
    }

    await transaction.commit();

    console.log('[add-convert] created convert:', created.toJSON());

    return res.status(201).json({
      id: created.id,
      name: created.name,
      type_code: typeCode,
      is_active: created.isActive,
      target_amount: convertPayload.targetAmount,
      initial_amount: convertPayload.initialAmount,
    });

  } catch (error) {
    console.error('Не удалось создать конверт', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Ошибка сервера при создании конверта' });
  }
});

module.exports = router;
