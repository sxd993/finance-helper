const express = require('express');
const { sequelize, Convert, ConvertType, ConvertTypeLimit } = require('../../db');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.post('/add-convert', requireAuth, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.userId;
    const user = req.user || {};
    const payload = (req.body && req.body.convert) || {};

    const {
      name,
      type_code: typeCode,
      current_amount: currentRaw = null,
      target_amount: targetRaw = null,
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
      return res.status(400).json({ message: 'Конверт с таким названием уже существует' });
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
    const isActive = Boolean(isActiveRaw);

    let computedCurrent = currentAmount;
    let computedTarget = targetAmount;

    // ⚙️ Логика по типам
    switch (typeCode) {
      case 'important': {
        console.log('CASE: important');

        // Проверяем лимиты пользователя
        const typeLimit = await ConvertTypeLimit.findOne({
          where: { userId, typeId: convertType.id },
          transaction,
        });

        if (!typeLimit) {
          await transaction.rollback();
          return res.status(400).json({ message: 'Лимит для типа important не найден' });
        }

        // если пользователь указал лимит для конверта — проверим не превышает ли
        const newLimit = computedLimit || 0;
        if (typeLimit.usedLimit + newLimit > typeLimit.totalLimit) {
          await transaction.rollback();
          return res.status(400).json({
            message: `Превышен общий лимит по типу important. Доступно ещё ${(typeLimit.totalLimit - typeLimit.usedLimit).toFixed(2)}`,
          });
        }

        computedCurrent = 0; // создаётся пустым
        computedTarget = null;
        break;
      }

      case 'wishes': {
        console.log('CASE: wishes');

        const typeLimit = await ConvertTypeLimit.findOne({
          where: { userId, typeId: convertType.id },
          transaction,
        });

        if (!typeLimit) {
          await transaction.rollback();
          return res.status(400).json({ message: 'Лимит для типа wishes не найден' });
        }

        const newLimit = computedLimit || 0;
        if (typeLimit.usedLimit + newLimit > typeLimit.totalLimit) {
          await transaction.rollback();
          return res.status(400).json({
            message: `Превышен общий лимит по типу wishes. Доступно ещё ${(typeLimit.totalLimit - typeLimit.usedLimit).toFixed(2)}`,
          });
        }

        computedCurrent = 0;
        computedTarget = null;
        break;
      }

      case 'saving': {
        console.log('CASE: saving');
        if (computedTarget == null) {
          await transaction.rollback();
          return res.status(400).json({ message: 'Для saving требуется target_amount' });
        }
        computedLimit = null;
        break;
      }

      case 'investment': {
        console.log('CASE: investment');
        computedLimit = null;
        computedCurrent = 0;
        computedTarget = null;
        break;
      }

      default:
        await transaction.rollback();
        return res.status(400).json({ message: `Обработчик для типа ${typeCode} не найден` });
    }

    // Создаём конверт
    const created = await Convert.create({
      userId,
      cycleId: null,
      typeId: convertType.id,
      name,
      current_amount: computedCurrent ?? 0,
      target_amount: computedTarget ?? null,
      isActive,
    }, { transaction });

    // Если тип important или wishes — обновим usedLimit
    if (['important', 'wishes'].includes(typeCode) && computedLimit > 0) {
      const typeLimit = await ConvertTypeLimit.findOne({
        where: { userId, typeId: convertType.id },
        transaction,
      });

      await typeLimit.update(
        { usedLimit: typeLimit.usedLimit + computedLimit },
        { transaction }
      );
    }

    await transaction.commit();

    console.log('CREATED CONVERT:', created.toJSON());

    return res.status(201).json({
      id: created.id,
      name: created.name,
      type_code: typeCode,
      current_amount: Number(created.current_amount),
      target_amount: created.targetAmount === null ? null : Number(created.target_amount),
      is_active: Boolean(created.isActive),
    });
  } catch (error) {
    console.error('Не удалось создать конверт', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Ошибка сервера при создании конверта' });
  }
});

module.exports = router;
