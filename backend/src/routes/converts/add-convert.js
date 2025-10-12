const express = require('express');
const { sequelize, Convert, ConvertType, ConvertBudgetDetails, ConvertSavingDetails, ConvertInvestmentDetails } = require('../../db');
const { requireAuth } = require('../../utils/auth');

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
      overall_limit: overallLimitRaw = null,
      initial_investment: initialInvestmentRaw = null,
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

    const currentAmount = toNumberOrNull(currentRaw) ?? 0;
    const targetAmount = toNumberOrNull(targetRaw);
    const overallLimit = toNumberOrNull(overallLimitRaw) ?? 0;
    const initialInvestment = toNumberOrNull(initialInvestmentRaw);
    const currentValue = toNumberOrNull(currentValueRaw);
    const isActive = Boolean(isActiveRaw);

    let computedCurrent = currentAmount;
    let computedTarget = targetAmount;

    switch (typeCode) {
      case 'important': {
        computedCurrent = currentAmount;
        computedTarget = undefined;
        break;
      }

      case 'wishes': {
        computedCurrent = currentAmount;
        computedTarget = undefined;
        break;
      }

      case 'saving': {
        console.log('CASE: saving');
        if (computedTarget == null) {
          await transaction.rollback();
          return res.status(400).json({ message: 'Для saving требуется target_amount' });
        }
        break;
      }

      case 'investment': {
        computedCurrent = undefined;
        computedTarget = undefined;
        break;
      }

      default:
        await transaction.rollback();
        return res.status(400).json({ message: `Обработчик для типа ${typeCode} не найден` });
    }

    // Формируем данные для создания конверта
    const created = await Convert.create({
      userId,
      cycleId: null,
      typeCode: convertType.code,
      name,
      isActive,
    }, { transaction });

    // Создаем детализацию по типу
    if (typeCode === 'important' || typeCode === 'wishes') {
      await ConvertBudgetDetails.create({
        convertId: created.id,
        current_amount: computedCurrent ?? 0,
        overall_limit: overallLimit,
      }, { transaction });
    } else if (typeCode === 'saving') {
      await ConvertSavingDetails.create({
        convertId: created.id,
        target_amount: computedTarget ?? null,
        current_amount: computedCurrent ?? 0,
      }, { transaction });
    } else if (typeCode === 'investment') {
      await ConvertInvestmentDetails.create({
        convertId: created.id,
        initial_investment: initialInvestment ?? null,
        current_value: currentValue ?? null,
        last_updated: new Date(),
      }, { transaction });
    }

    await transaction.commit();

    console.log('[add-convert] created base convert:', created.toJSON());

    return res.status(201).json({
      id: created.id,
      name: created.name,
      type_code: typeCode,
      is_active: Boolean(created.isActive),
    });
  } catch (error) {
    console.error('Не удалось создать конверт', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Ошибка сервера при создании конверта' });
  }
});

module.exports = router;
