import express from 'express';
import { requireAuth, toPublicUser } from '../../utils/auth.js';
import { User } from '../../db/index.js';

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function normalizeString(value) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
}

function normalizeNullableNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return NaN;
  }

  return parsed;
}

router.patch('/', requireAuth, async (req, res) => {
  const name = normalizeString(req.body?.name);
  const login = normalizeString(req.body?.login);
  const email = normalizeString(req.body?.email?.toLowerCase?.() ?? req.body?.email);
  const monthlyIncomeRaw = req.body?.monthlyIncome ?? req.body?.monthly_income;
  const monthlyIncome = normalizeNullableNumber(monthlyIncomeRaw);

  if (!name || name.length < 2 || name.length > 60) {
    return res.status(400).json({ message: 'Имя должно содержать от 2 до 60 символов' });
  }

  if (!login || login.length < 3 || login.length > 32) {
    return res.status(400).json({ message: 'Логин должен содержать от 3 до 32 символов' });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: 'Введите корректный email' });
  }

  if (monthlyIncome !== null) {
    if (Number.isNaN(monthlyIncome) || monthlyIncome < 0) {
      return res.status(400).json({ message: 'Месячный доход должен быть числом больше или равно 0' });
    }
  }

  try {
    const currentUser = await User.findByPk(req.userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (login !== currentUser.login) {
      const loginExists = await User.findOne({ where: { login } });
      if (loginExists) {
        return res.status(409).json({ message: 'Такой логин уже используется' });
      }
    }

    if (email !== currentUser.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(409).json({ message: 'Такой email уже используется' });
      }
    }

    const updatePayload = {
      name,
      login,
      email,
    };

    if (monthlyIncome !== null) {
      updatePayload.monthlyIncome = monthlyIncome;
    }

    await User.update(updatePayload, { where: { id: req.userId } });
    const updatedUser = await User.findByPk(req.userId);

    return res.json({
      message: 'Профиль обновлён',
      user: toPublicUser(updatedUser),
    });
  } catch (error) {
    console.error('Failed to update profile', error);
    return res.status(500).json({ message: 'Не удалось обновить профиль' });
  }
});

export default router;
