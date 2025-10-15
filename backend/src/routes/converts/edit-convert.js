const express = require('express');
const {
  sequelize,
  Convert,
  ConvertType,
  ConvertBudgetDetails,
  ConvertSavingDetails,
  ConvertInvestmentDetails,
} = require('../../db');
const { requireAuth } = require('../../utils/auth');

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

    const payload = (req.body && req.body.convert) || req.body || {};

    const {
      name,
      type_code: typeCodeRaw,
      current_amount: currentRaw,
      target_amount: targetRaw,
      overall_limit: overallLimitRaw,
      initial_investment: initialInvestmentRaw,
      current_value: currentValueRaw,
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

    const typeCode = typeCodeRaw || convert.typeCode;
    const convertType = await ConvertType.findOne({ where: { code: typeCode }, transaction });

    if (!convertType) {
      await transaction.rollback();
      return res.status(400).json({ message: `Неизвестный тип конверта: ${typeCode}` });
    }

    const duplicate = await Convert.findOne({
      where: { userId, name },
      transaction,
    });

    if (duplicate && duplicate.id !== id) {
      await transaction.rollback();
      return res.status(409).json({
        message: 'Конверт с таким названием уже существует',
        code: 'DUPLICATE_NAME',
        existing_id: duplicate.id,
      });
    }

    const currentAmount = toNumberOrNull(currentRaw);
    const targetAmount = toNumberOrNull(targetRaw);
    const overallLimit = toNumberOrNull(overallLimitRaw);
    const initialInvestment = toNumberOrNull(initialInvestmentRaw);
    const currentValue = toNumberOrNull(currentValueRaw);
    const isActive = isActiveRaw === undefined ? convert.isActive : Boolean(isActiveRaw);

    let detailType = null;
    let detailPayload = null;

    switch (typeCode) {
      case 'important':
      case 'wishes': {
        detailType = 'budget';
        detailPayload = {
          current_amount: currentAmount ?? 0,
          overall_limit: overallLimit ?? 0,
        };
        break;
      }
      case 'saving': {
        if (targetAmount == null) {
          await transaction.rollback();
          return res.status(400).json({ message: 'Для saving требуется target_amount' });
        }
        detailType = 'saving';
        detailPayload = {
          current_amount: currentAmount ?? 0,
          target_amount: targetAmount,
        };
        break;
      }
      case 'investment': {
        detailType = 'investment';
        detailPayload = {
          initial_investment: initialInvestment ?? null,
          current_value: currentValue ?? null,
          last_updated: new Date(),
        };
        break;
      }
      default: {
        await transaction.rollback();
        return res.status(400).json({ message: `Обработчик для типа ${typeCode} не найден` });
      }
    }

    await convert.update({
      name,
      typeCode: convertType.code,
      isActive,
    }, { transaction });

    if (detailType !== 'budget') {
      await ConvertBudgetDetails.destroy({ where: { convertId: id }, transaction });
    }
    if (detailType !== 'saving') {
      await ConvertSavingDetails.destroy({ where: { convertId: id }, transaction });
    }
    if (detailType !== 'investment') {
      await ConvertInvestmentDetails.destroy({ where: { convertId: id }, transaction });
    }

    if (detailType === 'budget') {
      const [row, created] = await ConvertBudgetDetails.findOrCreate({
        where: { convertId: id },
        defaults: { convertId: id, ...detailPayload },
        transaction,
      });

      if (!created) {
        await row.update(detailPayload, { transaction });
      }
    } else if (detailType === 'saving') {
      const [row, created] = await ConvertSavingDetails.findOrCreate({
        where: { convertId: id },
        defaults: { convertId: id, ...detailPayload },
        transaction,
      });

      if (!created) {
        await row.update(detailPayload, { transaction });
      }
    } else if (detailType === 'investment') {
      const [row, created] = await ConvertInvestmentDetails.findOrCreate({
        where: { convertId: id },
        defaults: { convertId: id, ...detailPayload },
        transaction,
      });

      if (!created) {
        await row.update(detailPayload, { transaction });
      }
    }

    await transaction.commit();

    return res.json({
      id,
      name,
      type_code: typeCode,
      is_active: Boolean(isActive),
    });
  } catch (error) {
    console.error('[edit-convert] error:', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Ошибка сервера при обновлении конверта' });
  }
});

module.exports = router;
