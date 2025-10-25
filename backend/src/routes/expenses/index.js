import express from 'express';
import getExpensesRouter from './get-expenses.js';
import addExpenseRouter from './add-expense.js';
import editExpenseRouter from './edit-expense.js';
import deleteExpenseRouter from './delete-expense.js';

const router = express.Router('');

router.use('', getExpensesRouter);
router.use('', addExpenseRouter);
router.use('', editExpenseRouter);
router.use('', deleteExpenseRouter);

export default router;
