const express = require('express');
const {
  findUserByLogin,
  toPublicUser,
  createToken,
  verifyPassword,
  setAuthCookie,
} = require('../../utils/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  const { login, password } = req.body || {};

  if (!login || !password) {
    return res.status(400).json({ message: 'Login and password are required' });
  }

  try {
    const user = await findUserByLogin(login);
    if (!user) {
      return res.status(401).json({ message: 'Wrong login or password' });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Wrong login or password' });
    }

    const token = createToken(user.login);
    setAuthCookie(res, token);

    return res.json({
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error('Login failed', error);
    return res.status(500).json({ message: 'Database error' });
  }
});

module.exports = router;
