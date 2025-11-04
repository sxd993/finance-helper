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

router.post('/', async (req, res) => {
  const {
    login,
    name,
    email,
    password,
    distributionMode,
    monthly_income,
    cycle_type: _cycleType,
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

    const resolvedDistributionMode =
      distributionMode === 'flex' ? 'flex' : 'baseline';

    const resolvedPercents = {
      important: DEFAULT_DISTRIBUTION.important,
      wishes: DEFAULT_DISTRIBUTION.wishes,
      saving: DEFAULT_DISTRIBUTION.saving,
      investment: DEFAULT_DISTRIBUTION.investment,
    };

    const cycleType = 'monthly';

    // Создаём пользователя
    const user = await User.create(
      {
        login,
        name,
        email,
        passwordHash,
        distributionMode: resolvedDistributionMode,
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

    // Создаём лимиты по типам для saving/investment исходя из процентов (если задан доход)
    try {
      const monthlyIncomeNum = Number(user.monthlyIncome) || 0;
      if (monthlyIncomeNum > 0) {
        const savingPercent = Number(user.percentSaving) || 0;
        const investmentPercent = Number(user.percentInvestment) || 0;

        const savingLimit = Number(((monthlyIncomeNum * savingPercent) / 100).toFixed(2));
        const investmentLimit = Number(((monthlyIncomeNum * investmentPercent) / 100).toFixed(2));

        // Вставляем/обновляем строки для saving и investment
        await Promise.all([
          ConvertTypeLimit.upsert(
            { userId: user.id, typeCode: 'saving', limitAmount: savingLimit },
            { transaction }
          ),
          ConvertTypeLimit.upsert(
            { userId: user.id, typeCode: 'investment', limitAmount: investmentLimit },
            { transaction }
          ),
        ]);
      }
    } catch (e) {
      console.warn('Failed to create initial type limits for user', e);
    }

    // Инициализируем справочник типов (ленивое использование в других местах)
    await ConvertType.findAll({ transaction });

    await transaction.commit();

    // Авторизация
    const token = createToken(login);
    setAuthCookie(res, token);

    const freshUser = await findUserByLogin(login);

    return res.status(201).json({
      token,
      user: toPublicUser(freshUser || {
        login,
        name,
        email,
        monthly_income: normalizedIncome,
        distribution_mode: resolvedDistributionMode,
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
