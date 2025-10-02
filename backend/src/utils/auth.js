const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-here-change-in-production';
const ACCESS_TOKEN_EXPIRE_HOURS = Number(process.env.ACCESS_TOKEN_EXPIRE_HOURS) || 1;

const normalizeNumber = (value) => (typeof value === 'number' ? value : Number(value || 0));

async function findUserByLogin(login) {
  const rows = await query(
    `SELECT
       id,
       login,
       name,
       email,
       monthly_income,
       password_hash,
       distribution_mode,
       percent_necessary,
       percent_desire,
       percent_saving,
       percent_investment,
       leftover_pool,
       last_reset_at
     FROM users
     WHERE login = ?`,
    [login]
  );

  return rows[0];
}

function toPublicUser(userRow) {
  if (!userRow) return null;

  return {
    login: userRow.login,
    name: userRow.name,
    email: userRow.email,
    monthly_income: normalizeNumber(userRow.monthly_income),
    distribution_mode: userRow.distribution_mode || 'baseline',
    percent_necessary: normalizeNumber(userRow.percent_necessary),
    percent_desire: normalizeNumber(userRow.percent_desire),
    percent_saving: normalizeNumber(userRow.percent_saving),
    percent_investment: normalizeNumber(userRow.percent_investment),
    leftover_pool: normalizeNumber(userRow.leftover_pool),
    last_reset_at: userRow.last_reset_at,
  };
}

function createToken(login) {
  return jwt.sign(
    { sub: login },
    SECRET_KEY,
    { expiresIn: `${ACCESS_TOKEN_EXPIRE_HOURS}h` }
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
  if (!passwordHash) return false;
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

module.exports = {
  findUserByLogin,
  toPublicUser,
  createToken,
  verifyToken,
  hashPassword,
  verifyPassword,
  setAuthCookie,
};
