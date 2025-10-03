const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ message: 'Successfully logged out' });
});

module.exports = router;
