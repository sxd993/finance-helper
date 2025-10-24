const express = require('express');
const getExpensesRouter = require('./get-expenses');

const router = express.Router('');

router.use('', getExpensesRouter);

module.exports = router;