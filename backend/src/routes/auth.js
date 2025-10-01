const express = require('express');
const { query } = require('../config/database');
const {
  findUserByLogin,
  toPublicUser,
  createToken,
  hashPassword,
  verifyPassword,
  setAuthCookie,
} = require('../utils/auth');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { login, password } = req.body || {};

  if (!login || !password) {
    return res.status(400).json({ message: 'Login and password are required' });
  }

  try {
    const userRow = await findUserByLogin(login);
    if (!userRow) {
      return res.status(401).json({ message: 'Wrong login or password' });
    }

    const isValid = await verifyPassword(password, userRow.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Wrong login or password' });
    }

    const token = createToken(userRow.login);
    setAuthCookie(res, token);

    return res.json({
      token,
      user: toPublicUser(userRow),
    });
  } catch (error) {
    console.error('Login failed', error);
    return res.status(500).json({ message: 'Database error' });
  }
});

router.post('/register', async (req, res) => {
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

  try {
    const existingUser = await findUserByLogin(login);
    if (existingUser) {
      return res.status(400).json({ message: 'Login already exists' });
    }

    const passwordHash = await hashPassword(password);
    const normalizedIncome = Number(monthlyIncome) || 0;

    await query(
      `INSERT INTO users (login, name, email, monthly_income, password_hash)
       VALUES (?, ?, ?, ?, ?)`,
      [login, name, email, normalizedIncome, passwordHash]
    );

    const token = createToken(login);
    setAuthCookie(res, token);

    return res.status(201).json({
      token,
      user: toPublicUser({ login, name, email, monthly_income: normalizedIncome }),
    });
  } catch (error) {
    console.error('Registration failed', error);
    return res.status(500).json({ message: 'Database error' });
  }
});

router.get('/check', requireAuth, (req, res) => {
  return res.json(req.user);
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ message: 'Successfully logged out' });
});

module.exports = router;
