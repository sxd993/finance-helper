const express = require('express');
const { sequelize, User, ConvertType, Convert } = require('../db');
const { requireAuth } = require('../utils/auth');
const { DEFAULT_DISTRIBUTION } = require('../utils/constants');
const { getCurrentMonthPeriod } = require('../utils/periods');
const { formatRuDate } = require('../utils/dates');
const { toNumber } = require('../utils/numbers');

const router = express.Router();

router.get('/converts/types', requireAuth, async (req, res) => {
  try {
    const types = await ConvertType.findAll({
      attributes: ['id', 'code', 'title', 'hasLimit', 'accumulates'],
      order: [['id', 'ASC']],
    });

    res.json(types.map((type) => ({
      id: type.id,
      code: type.code,
      title: type.title,
      has_limit: Boolean(type.hasLimit),
      accumulates: Boolean(type.accumulates),
    })));
  } catch (error) {
    console.error('Failed to fetch convert types', error);
    res.status(500).json({ message: 'Ошибка сервера при получении типов конвертов' });
  }
});

router.post('/converts', requireAuth, async (req, res) => {
  const {
    type_code: typeCode,
    name,
    monthly_limit: monthlyLimitInput,
    target_amount: targetAmountInput,
  } = req.body || {};

  if (!typeCode || !name) {
    return res.status(400).json({ message: 'Требуются тип конверта и название' });
  }

  try {
    const result = await sequelize.transaction(async (transaction) => {
      const type = await ConvertType.findOne({
        where: { code: typeCode },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!type) {
        const err = new Error('Неизвестный тип конверта');
        err.status = 400;
        throw err;
      }

      const monthlyLimit = Math.max(0, toNumber(monthlyLimitInput));
      const targetAmount = targetAmountInput !== undefined && targetAmountInput !== null
        ? Math.max(0, toNumber(targetAmountInput))
        : null;

      const initialAmount = type.accumulates ? 0 : monthlyLimit;

      const convert = await Convert.create({
        userId: req.userId,
        typeId: type.id,
        name,
        monthlyLimit,
        currentAmount: initialAmount,
        targetAmount,
        isActive: true,
      }, { transaction });

      return {
        id: convert.id,
        convert_type: type.code,
        convert_name: name,
        limit_amount: monthlyLimit,
        current_amount: initialAmount,
        target_amount: targetAmount,
        type_title: type.title,
        type_has_limit: Boolean(type.hasLimit),
        type_accumulates: Boolean(type.accumulates),
      };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Failed to create convert', error);
    if (error.status === 400) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Не удалось создать конверт' });
  }
});

router.get('/converts', requireAuth, async (req, res) => {
  try {
    const converts = await Convert.findAll({
      where: { userId: req.userId, isActive: true },
      include: [{
        model: ConvertType,
        as: 'type',
        attributes: ['code', 'title', 'hasLimit', 'accumulates'],
      }],
    });

    const orderPriority = {
      necessary: 1,
      desire: 2,
      saving: 3,
      investment: 4,
    };

    const data = converts.map((convert) => ({
      id: convert.id,
      convert_type: convert.type?.code,
      convert_name: convert.name,
      limit_amount: toNumber(convert.monthlyLimit),
      current_amount: toNumber(convert.currentAmount),
      target_amount: convert.targetAmount !== null ? toNumber(convert.targetAmount) : null,
      is_active: Boolean(convert.isActive),
      type_title: convert.type?.title,
      type_has_limit: Boolean(convert.type?.hasLimit),
      type_accumulates: Boolean(convert.type?.accumulates),
    }));

    data.sort((a, b) => {
      const priorityA = orderPriority[a.convert_type] ?? 99;
      const priorityB = orderPriority[b.convert_type] ?? 99;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return (a.convert_name || '').localeCompare(b.convert_name || '', 'ru');
    });

    res.json(data);
  } catch (error) {
    console.error('Failed to fetch converts', error);
    res.status(500).json({ message: 'Ошибка сервера при получении конвертов' });
  }
});

router.get('/converts-info', requireAuth, async (req, res) => {
  try {
    const { start, end } = getCurrentMonthPeriod();
    const startDate = new Date(start);

    const isSameMonth = (date) => {
      if (!date) {
        return false;
      }
      const dt = new Date(date);
      return dt.getFullYear() === startDate.getFullYear() && dt.getMonth() === startDate.getMonth();
    };

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (!user.lastResetAt || !isSameMonth(user.lastResetAt)) {
      await resetMonth(req.userId);
      await user.reload();
    }

    const converts = await Convert.findAll({
      where: { userId: req.userId, isActive: true },
      include: [{
        model: ConvertType,
        as: 'type',
        attributes: ['hasLimit', 'accumulates'],
      }],
    });

    let monthlyBudget = 0;
    let currentBudget = 0;

    converts.forEach((convert) => {
      const hasLimit = Boolean(convert.type?.hasLimit);
      const accumulates = Boolean(convert.type?.accumulates);
      if (hasLimit && !accumulates) {
        monthlyBudget += toNumber(convert.monthlyLimit);
        currentBudget += toNumber(convert.currentAmount);
      }
    });

    const percentage = monthlyBudget > 0
      ? Math.round((currentBudget / monthlyBudget) * 1000) / 10
      : 0;

    res.json({
      monthly_budget: monthlyBudget,
      current_budget: currentBudget,
      percentage,
      leftover_pool: 0,
      period_start: formatRuDate(start),
      period_end: formatRuDate(end),
      last_reset_at: user.lastResetAt ? formatRuDate(user.lastResetAt) : null,
    });
  } catch (error) {
    console.error('Failed to fetch convert summary', error);
    res.status(500).json({ message: 'Ошибка сервера при получении сводки' });
  }
});

async function resetMonth(userId) {
  return sequelize.transaction(async (transaction) => {
    const user = await User.findByPk(userId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const types = await ConvertType.findAll({
      transaction,
      lock: transaction.LOCK.SHARE,
    });

    const converts = await Convert.findAll({
      where: { userId, isActive: true },
      include: [{ model: ConvertType, as: 'type' }],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    const distribution = {
      necessary: toNumber(user.percentNecessary),
      desire: toNumber(user.percentDesire),
      saving: toNumber(user.percentSaving),
      investment: toNumber(user.percentInvestment),
    };

    const convertsByType = new Map();
    let leftover = 0;

    converts.forEach((convert) => {
      const typeCode = convert.type?.code;
      if (!typeCode) {
        return;
      }

      const list = convertsByType.get(typeCode) || [];
      list.push(convert);
      convertsByType.set(typeCode, list);

      const hasLimit = Boolean(convert.type?.hasLimit);
      const accumulates = Boolean(convert.type?.accumulates);
      if (hasLimit && !accumulates) {
        leftover += toNumber(convert.currentAmount);
      }
    });

    const roundedLeftover = Math.max(0, Math.round(leftover * 100) / 100);

    const accumulativeTypes = types.filter((type) => type.accumulates);
    const carryTargets = accumulativeTypes.reduce(
      (sum, type) => sum + (distribution[type.code] ?? 0),
      0,
    );

    const allocationsByType = new Map();

    if (roundedLeftover > 0 && accumulativeTypes.length > 0) {
      if (carryTargets > 0) {
        accumulativeTypes.forEach((type) => {
          const percent = distribution[type.code] ?? 0;
          const amount = Math.round((roundedLeftover * percent / carryTargets) * 100) / 100;
          allocationsByType.set(type.code, amount);
        });

        const allocatedTotal = Array.from(allocationsByType.values())
          .reduce((sum, value) => sum + value, 0);
        const diff = Math.round((roundedLeftover - allocatedTotal) * 100) / 100;
        if (diff !== 0) {
          const firstCode = accumulativeTypes[0].code;
          allocationsByType.set(firstCode, (allocationsByType.get(firstCode) || 0) + diff);
        }
      } else {
        const firstCode = accumulativeTypes[0].code;
        allocationsByType.set(firstCode, roundedLeftover);
      }
    }

    for (const type of types) {
      const typeCode = type.code;
      const typeConverts = convertsByType.get(typeCode) || [];

      if (typeConverts.length === 0) {
        continue;
      }

      if (type.hasLimit && !type.accumulates) {
        for (const convert of typeConverts) {
          await convert.update({ currentAmount: convert.monthlyLimit }, { transaction });
        }
        continue;
      }

      const carryForType = allocationsByType.get(typeCode) || 0;
      const totalMonthlyLimit = typeConverts.reduce((sum, convert) => sum + toNumber(convert.monthlyLimit), 0);

      for (const convert of typeConverts) {
        const monthlyContribution = toNumber(convert.monthlyLimit);
        let carryShare = 0;

        if (carryForType > 0) {
          if (totalMonthlyLimit > 0) {
            carryShare = Math.round((carryForType * (monthlyContribution / totalMonthlyLimit)) * 100) / 100;
          } else {
            carryShare = Math.round((carryForType / typeConverts.length) * 100) / 100;
          }
        }

        const newAmount = Math.round((toNumber(convert.currentAmount) + monthlyContribution + carryShare) * 100) / 100;
        await convert.update({ currentAmount: newAmount }, { transaction });
      }
    }

    await user.update({ leftoverPool: 0, lastResetAt: new Date() }, { transaction });

    const carriedOverObject = {};
    allocationsByType.forEach((value, code) => {
      carriedOverObject[code] = value;
    });

    return {
      carried_over: carriedOverObject,
      leftover_used: roundedLeftover,
    };
  });
}

router.post('/converts/month/reset', requireAuth, async (req, res) => {
  try {
    const result = await resetMonth(req.userId);
    res.json({
      message: 'Месяц закрыт, остаток автоматически распределён',
      carried_over: result.carried_over,
      leftover_used: result.leftover_used,
    });
  } catch (error) {
    console.error('Failed to reset month', error);
    res.status(500).json({ message: error.message || 'Не удалось закрыть месяц' });
  }
});

router.patch('/settings/budget', requireAuth, async (req, res) => {
  const {
    distribution_mode: distributionMode = 'baseline',
    percent_necessary,
    percent_desire,
    percent_saving,
    percent_investment,
  } = req.body || {};

  try {
    let newPercents = { ...DEFAULT_DISTRIBUTION };

    if (distributionMode === 'flex') {
      const percents = {
        necessary: toNumber(percent_necessary),
        desire: toNumber(percent_desire),
        saving: toNumber(percent_saving),
        investment: toNumber(percent_investment),
      };

      const total = Object.values(percents).reduce((sum, value) => sum + value, 0);
      if (total <= 0 || Math.abs(total - 100) > 0.01) {
        return res.status(400).json({ message: 'Сумма процентов должна равняться 100' });
      }

      newPercents = percents;
    }

    await User.update({
      distributionMode: distributionMode === 'flex' ? 'flex' : 'baseline',
      percentNecessary: newPercents.necessary,
      percentDesire: newPercents.desire,
      percentSaving: newPercents.saving,
      percentInvestment: newPercents.investment,
    }, {
      where: { id: req.userId },
    });

    res.json({
      message: 'Схема распределения обновлена',
      distribution: {
        mode: distributionMode === 'flex' ? 'flex' : 'baseline',
        ...newPercents,
      },
    });
  } catch (error) {
    console.error('Failed to update distribution', error);
    res.status(500).json({ message: 'Не удалось обновить схему распределения' });
  }
});

module.exports = router;
