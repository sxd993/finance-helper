import express from 'express';
import typesRouter from './types.js';
import addConvertRouter from './add-convert.js';
import getConvertsRouter from './get-convert.js';
import convertOverviewRouter from './converts-overview.js';
import updateInvestmentRouter from './update-investment.js';
import deleteConvertRouter from './delete-convert.js';
import editConvertRouter from './edit-convert.js';
import typeLimitsRouter from './type-limits.js';

const router = express.Router('');

router.use('', typesRouter);
router.use('', addConvertRouter);
router.use('', getConvertsRouter);
router.use('', convertOverviewRouter);
router.use('', updateInvestmentRouter);
router.use('', deleteConvertRouter);
router.use('', editConvertRouter);
router.use('', typeLimitsRouter);

export default router;
