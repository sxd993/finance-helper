const express = require('express');
const { User, ConvertType, ConvertTypeLimit, sequelize } = require('../../db');
const {
  findUserByLogin,
  toPublicUser,
  createToken,
  hashPassword,
  setAuthCookie,
} = require('../../utils/auth');
const { DEFAULT_DISTRIBUTION } = require('../../utils/constants');

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    login,
    name,
    email,
    password,
    distributionMode,
    monthly_income,
    cycle_type,
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

    const cycleType = cycle_type === 'monthly' ? 'monthly' : 'weekly';

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

    // 🧩 Получаем типы конвертов
    const convertTypes = await ConvertType.findAll({ transaction });

    // 🧮 Создаём лимиты по типам
    for (const type of convertTypes) {
      let totalLimit = 0;

      if (resolvedDistributionMode === 'baseline' && normalizedIncome) {
        switch (type.code) {
          case 'important':
            totalLimit = normalizedIncome * (resolvedPercents.important / 100);
            break;
          case 'wishes':
            totalLimit = normalizedIncome * (resolvedPercents.wishes / 100);
            break;
          case 'saving':
            totalLimit = 0;
            break;
          case 'investment':
            totalLimit = 0;
            break;
        }
      }

      await ConvertTypeLimit.create(
        {
          userId: user.id,
          typeId: type.id,
          totalLimit,
          usedLimit: 0,
        },
        { transaction }
      );
    }

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

module.exports = router;
