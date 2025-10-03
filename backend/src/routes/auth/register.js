const express = require('express');
const { User, sequelize } = require('../../db');
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
    monthly_income: monthlyIncome,
    password,
  } = req.body || {};

  if (!login || !name || !email || monthlyIncome === undefined || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const transaction = await sequelize.transaction();

  try {
    const existingUser = await findUserByLogin(login, { transaction });
    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Login already exists' });
    }

    const passwordHash = await hashPassword(password);
    const normalizedIncome = Number(monthlyIncome) || 0;

    await User.create({
      login,
      name,
      email,
      monthlyIncome: normalizedIncome,
      passwordHash,
      distributionMode: 'baseline',
      percentNecessary: DEFAULT_DISTRIBUTION.necessary,
      percentDesire: DEFAULT_DISTRIBUTION.desire,
      percentSaving: DEFAULT_DISTRIBUTION.saving,
      percentInvestment: DEFAULT_DISTRIBUTION.investment,
      leftoverPool: 0,
      lastResetAt: new Date(),
    }, { transaction });

    await transaction.commit();

    const token = createToken(login);
    setAuthCookie(res, token);

    const freshUser = await findUserByLogin(login);

    return res.status(201).json({
      token,
      user: toPublicUser(freshUser || { login, name, email, monthly_income: normalizedIncome }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Registration failed', error);
    return res.status(500).json({ message: error.message || 'Database error' });
  }
});

module.exports = router;
