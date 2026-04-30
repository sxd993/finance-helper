import express from 'express';
import { User, ConvertType, Cycle, ConvertTypeLimit, sequelize } from '../../db/index.js';
import {
  findUserByLogin,
  toPublicUser,
  createToken,
  hashPassword,
  setAuthCookie,
} from '../../utils/auth.js';
import { DEFAULT_DISTRIBUTION } from '../../utils/constants.js';

const router = express.Router();

const getPercent = (primary, fallback, defaultValue) => {
  const value = primary ?? fallback;
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

router.post('/', async (req, res) => {
  const {
    login,
    name,
    email,
    password,
    monthly_income,
    cycle_type: _cycleType,
    percentImportant,
    percentWishes,
    percentSaving,
    percentInvestment,
    percent_important,
    percent_wishes,
    percent_saving,
    percent_investment,
  } = req.body || {};

  if (!login || !name || !email || !password) {
    return res.status(400).json({ message: 'Отсутствуют необходимые поля' });
  }

  const transaction = await sequelize.transaction();

  try {
    const existingUser = await findUserByLogin(login, { transaction });
    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Login already exists' });
    }

    const passwordHash = await hashPassword(password);
    const hasIncome =
      monthly_income !== undefined &&
      monthly_income !== null &&
      monthly_income !== '';

    const normalizedIncome = hasIncome ? Number(monthly_income) || 0 : null;

    const resolvedPercents = {
      important: getPercent(percentImportant, percent_important, DEFAULT_DISTRIBUTION.important),
      wishes: getPercent(percentWishes, percent_wishes, DEFAULT_DISTRIBUTION.wishes),
      saving: getPercent(percentSaving, percent_saving, DEFAULT_DISTRIBUTION.saving),
      investment: getPercent(percentInvestment, percent_investment, DEFAULT_DISTRIBUTION.investment),
    };

    const percentValues = Object.values(resolvedPercents);
    const totalPercent = percentValues.reduce((sum, value) => sum + value, 0);
    const hasInvalidPercent = percentValues.some((value) => !Number.isFinite(value) || value < 0 || value > 100);
    if (hasInvalidPercent || Math.abs(totalPercent - 100) > 0.01) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Сумма процентов должна равняться 100' });
    }

    const cycleType = 'monthly';

    // Создаём пользователя
    const user = await User.create(
      {
        login,
        name,
        email,
        passwordHash,
        percentImportant: resolvedPercents.important,
        percentWishes: resolvedPercents.wishes,
        percentSaving: resolvedPercents.saving,
        percentInvestment: resolvedPercents.investment,
        monthlyIncome: normalizedIncome,
        cycleType,
      },
      { transaction }
    );

    await Cycle.create(
      {
        userId: user.id,
        startDate: new Date(),
        isClosed: false,
      },
      { transaction }
    );

    // Создаём лимиты по всем типам (даже если доход не задан — лимит 0)
    try {
      const monthlyIncomeNum = Number(user.monthlyIncome) || 0;
      const percentByType = {
        important: Number(user.percentImportant) || 0,
        wishes: Number(user.percentWishes) || 0,
        saving: Number(user.percentSaving) || 0,
        investment: Number(user.percentInvestment) || 0,
      };

      const typeCodes = ['important', 'wishes', 'saving', 'investment'];
      await Promise.all(
        typeCodes.map((typeCode) => {
          const percent = percentByType[typeCode] ?? 0;
          const limitAmount = Number(((monthlyIncomeNum * percent) / 100).toFixed(2));
          return ConvertTypeLimit.upsert(
            { userId: user.id, typeCode, limitAmount },
            { transaction }
          );
        })
      );
    } catch (e) {
      console.warn('Failed to create initial type limits for user', e);
    }

    // Инициализируем справочник типов (ленивое использование в других местах)
    await ConvertType.findAll({ transaction });

    await transaction.commit();

    // Авторизация
    const freshUser = await findUserByLogin(login);
    const token = createToken(login);
    setAuthCookie(res, token);

    return res.status(201).json({
      token,
      user: toPublicUser(freshUser || {
        login,
        name,
        email,
        monthly_income: normalizedIncome,
        percent_important: resolvedPercents.important,
        percent_wishes: resolvedPercents.wishes,
        percent_saving: resolvedPercents.saving,
        percent_investment: resolvedPercents.investment,
        cycle_type: cycleType,
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Registration failed', error);
    return res.status(500).json({ message: error.message || 'Database error' });
  }
});

export default router;
