const {
  verifyToken,
  findUserByLogin,
  toPublicUser,
} = require('../utils/auth');

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

    const userRow = await findUserByLogin(payload.sub);
    if (!userRow) {
      return res.status(401).json({ message: 'Could not validate credentials' });
    }

    req.user = toPublicUser(userRow);
    req.userId = userRow.id;

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    return res.status(401).json({ message: 'Could not validate credentials' });
  }
}

module.exports = {
  requireAuth,
};
