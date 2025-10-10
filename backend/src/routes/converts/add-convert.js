const express = require('express');
const { sequelize, Convert, ConvertType } = require('../../db');
const { requireAuth } = require('../../utils/auth');
const { toNumberOrNull, getTypeBuilder } = require('./helpers');

const router = express.Router();

// Создание конверта по бизнес-правилам:
// - important, wishes: имеют лимит (если baseline и указан доход — считаем от процента)
// - saving: без лимита, есть цель (target), current опционален
// - investment: без лимита, пополняется позже (на создании current=0, target=null)
router.post('/add-convert', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const user = req.user || {};

    // Тело запроса ожидается в виде { convert: { ... } }
    const payload = (req.body && req.body.convert) || {};
    const {
      name,
      type_code: typeCode,
      current_ammount: currentRaw = null,
      target_amount: targetRaw = null,
      is_active: isActiveRaw = true,
    } = payload;

    if (!name || !typeCode) {
      return res.status(400).json({ message: 'Поля name и type_code обязательны' });
    }

    const convertType = await ConvertType.findOne({ where: { code: typeCode } });
    if (!convertType) {
      return res.status(400).json({ message: `Неизвестный тип конверта: ${typeCode}` });
    }

    const distributionMode = user.distribution_mode || 'baseline';
    const monthlyIncome = toNumberOrNull(user.monthly_income);

    // Получаем типовой билдер для расчёта полей
    const builder = getTypeBuilder(typeCode);
    if (!builder) {
      return res.status(400).json({ message: `Обработчик для типа ${typeCode} не найден` });
    }

    const result = builder({ user, payload, convertType });
    if (!result?.ok) {
      return res.status(400).json({ message: result?.message || 'Некорректные данные для создания конверта' });
    }

    const { monthlyLimit, currentAmount, targetAmount } = result.data;

    const isActive = Boolean(isActiveRaw);

    // Создание конверта
    const created = await Convert.create({
      userId,
      cycleId: null, // накопительные по умолчанию без цикла
      typeId: convertType.id,
      name,
      monthlyLimit,
      currentAmount,
      targetAmount,
      isActive,
    });

    // Ответ в удобном для фронтенда формате
    return res.status(201).json({
      id: created.id,
      name: created.name,
      type_code: typeCode,
      monthly_limit: Number(created.monthlyLimit),
      current_amount: Number(created.currentAmount),
      target_amount: created.targetAmount === null ? null : Number(created.targetAmount),
      is_active: Boolean(created.isActive),
    });
  } catch (error) {
    console.error('Не удалось создать конверт', error);
    return res.status(500).json({ message: 'Ошибка сервера при создании конверта' });
  }
});
module.exports = router;
