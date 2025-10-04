const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../db');

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-here-change-in-production';
const ACCESS_TOKEN_EXPIRE_HOURS = Number(process.env.ACCESS_TOKEN_EXPIRE_HOURS) || 1;

const normalizeNumber = (value) => (typeof value === 'number' ? value : Number(value || 0));

async function findUserByLogin(login, options = {}) {
  if (!login) {
    return null;
  }

  return User.findOne({
    where: { login },
    ...options,
  });
}

function toPublicUser(user) {
  if (!user) {
    return null;
  }

  const data = typeof user.toJSON === 'function' ? user.toJSON() : user;

  const monthlyIncome = data.monthlyIncome ?? data.monthly_income;
  const monthlyIncomeNormalized = (monthlyIncome === null || monthlyIncome === undefined || monthlyIncome === '')
    ? null
    : Number(monthlyIncome) || 0;

  return {
    login: data.login,
    name: data.name,
    email: data.email,
    monthly_income: monthlyIncomeNormalized,
    distribution_mode: data.distributionMode || data.distribution_mode || 'baseline',
    percent_important: normalizeNumber(data.percentImportant ?? data.percent_important),
    percent_wishes: normalizeNumber(data.percentWishes ?? data.percent_wishes),
    percent_saving: normalizeNumber(data.percentSaving ?? data.percent_saving),
    percent_investment: normalizeNumber(data.percentInvestment ?? data.percent_investment),
    cycle_type: data.cycleType || data.cycle_type || 'weekly',
  };
}

function createToken(login) {
  return jwt.sign(
    { sub: login },
    SECRET_KEY,
    { expiresIn: `${ACCESS_TOKEN_EXPIRE_HOURS}h` },
  );
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

async function hashPassword(password) {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
  return bcrypt.hash(password, saltRounds);
}

async function verifyPassword(plainPassword, passwordHash) {
  if (!passwordHash) {
    return false;
  }
  return bcrypt.compare(plainPassword, passwordHash);
}

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: (process.env.ENV || 'development') === 'production',
    sameSite: 'strict',
    maxAge: ACCESS_TOKEN_EXPIRE_HOURS * 60 * 60 * 1000,
    path: '/',
  });
}

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    let token = null;

    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice('Bearer '.length).trim();
    }

    if (!token && req.cookies) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Could not validate credentials' });
    }

    const payload = verifyToken(token);
    if (!payload?.sub) {
      return res.status(401).json({ message: 'Could not validate credentials' });
    }

    const user = await findUserByLogin(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Could not validate credentials' });
    }

    req.user = toPublicUser(user);
    req.userId = user.id;

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    return res.status(401).json({ message: 'Could not validate credentials' });
  }
}

module.exports = {
  findUserByLogin,
  toPublicUser,
  createToken,
  verifyToken,
  hashPassword,
  verifyPassword,
  setAuthCookie,
  requireAuth,
};
