import express from 'express';
import {
  findUserByLogin,
  toPublicUser,
  createToken,
  verifyPassword,
  setAuthCookie,
} from '../../utils/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { login, password } = req.body || {};

  if (!login || !password) {
    return res.status(400).json({ message: 'Требуется логин и пароль' });
  }

  try {
    const user = await findUserByLogin(login);
    if (!user) {
      return res.status(401).json({ message: 'Неправильный логин или пароль' });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Неправильный логин или пароль' });
    }

    const token = createToken(user.login);
    setAuthCookie(res, token);

    return res.json({
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка в базе данных' });
  }
});

export default router;
