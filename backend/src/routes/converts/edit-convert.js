import express from 'express';
import {
  sequelize,
  Convert,
  ConvertType,
} from '../../db/index.js';
import { requireAuth } from '../../utils/auth.js';
import { ensureWithinTypeLimit, shouldApplyTypeLimit } from './utils/type-limits.js';

const router = express.Router();

const toNumberOrNull = (val) => {
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
      target_amount: targetRaw,
      initial_amount: initialAmountRaw,
      is_active: isActiveRaw,
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

    // Проверка на дубликат имени
    const duplicate = await Convert.findOne({ where: { userId, name }, transaction });
    if (duplicate && duplicate.id !== id) {
      await transaction.rollback();
      return res.status(409).json({
        message: 'Конверт с таким названием уже существует',
        code: 'DUPLICATE_NAME',
        existing_id: duplicate.id,
      });
    }

    // Преобразование числовых значений
    const targetAmount = toNumberOrNull(targetRaw);
    const initialAmount = toNumberOrNull(initialAmountRaw);
    const isActive = isActiveRaw === undefined ? convert.isActive : Boolean(isActiveRaw);
    const canSpend = Boolean(convertType.canSpend);
    const hasLimit = Boolean(convertType.hasLimit);

    const convertUpdate = {
      name,
      typeCode: convertType.code,
      isActive,
      targetAmount: null,
      initialAmount: null,
    };

    if (hasLimit) {
      if (!canSpend && targetAmount == null) {
        await transaction.rollback();
        return res.status(400).json({ message: `Для типа ${convertType.code} требуется target_amount` });
      }

      convertUpdate.targetAmount =
        targetAmount ??
        (canSpend ? 0 : convert.targetAmount ?? 0);
    }

    // Базовое значение initialAmount до корректировки
    const baseInitialAmount = initialAmount ?? convert.initialAmount ?? 0;

    // Правило: если целевой объём меньше initial, то уменьшаем initial до целевого,
    // иначе оставляем initial без изменений. Применяем только когда есть лимит и
    // targetAmount определён числом.
    if (
      hasLimit &&
      convertUpdate.targetAmount != null &&
      Number.isFinite(Number(convertUpdate.targetAmount)) &&
      Number(convertUpdate.targetAmount) < Number(baseInitialAmount)
    ) {
      convertUpdate.initialAmount = Number(convertUpdate.targetAmount);
    } else {
      convertUpdate.initialAmount = baseInitialAmount;
    }

    const allocationAmount = shouldApplyTypeLimit(convertType)
      ? Number(convertUpdate.targetAmount ?? 0)
      : 0;

    // Проверка лимита
    const limitCheck = await ensureWithinTypeLimit({
      userId,
      user: req.user,
      typeCode: convertType.code,
      amount: allocationAmount,
      transaction,
      excludeConvertId: id,
      convertType,
    });

    if (!limitCheck.valid) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Превышен лимит для типа ${convertType.code}`,
        code: 'TYPE_LIMIT_EXCEEDED',
        limit: limitCheck.limit,
        used: limitCheck.used,
        required: limitCheck.required,
        available: limitCheck.available,
      });
    }

    // Обновление данных
    await convert.update(convertUpdate, { transaction });
    await transaction.commit();

    return res.json({
      id,
      name: convertUpdate.name,
      type_code: convertUpdate.typeCode,
      target_amount: convertUpdate.targetAmount,
      initial_amount: convertUpdate.initialAmount,
      is_active: Boolean(convertUpdate.isActive),
    });
  } catch (error) {
    console.error('[edit-convert] error:', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Ошибка сервера при обновлении конверта' });
  }
});

export default router;
