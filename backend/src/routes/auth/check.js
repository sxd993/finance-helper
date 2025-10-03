const express = require('express');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
