const express = require('express');
const getExpensesRouter = require('./get-expenses');
const addExpenseRouter = require('./add-expense');
const editExpenseRouter = require('./edit-expense');
const deleteExpenseRouter = require('./delete-expense');

const router = express.Router('');

router.use('', getExpensesRouter);
router.use('', addExpenseRouter);
router.use('', editExpenseRouter);
router.use('', deleteExpenseRouter);

module.exports = router;
