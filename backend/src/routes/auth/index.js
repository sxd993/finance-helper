const express = require('express');
const loginRouter = require('./login');
const registerRouter = require('./register');
const checkRouter = require('./check');
const logoutRouter = require('./logout');

const router = express.Router();

router.use('/login', loginRouter);
router.use('/register', registerRouter);
router.use('/check', checkRouter);
router.use('/logout', logoutRouter);

module.exports = router;
