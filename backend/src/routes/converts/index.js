import express from 'express';
import addConvertRouter from './add-convert.js';
import getConvertsRouter from './get-convert.js';
import convertOverviewRouter from './converts-overview.js';
import updateInvestmentRouter from './update-investment.js';
import deleteConvertRouter from './delete-convert.js';
import editConvertRouter from './edit-convert.js';
import СonvertTypes from './get-convert-types.js'
import UserConvertTypeLimits from './get-user-convert-type-limits.js'
import replenishConvertRouter from './replenish-convert.js';

const router = express.Router('');

router.use('', СonvertTypes)
router.use('', UserConvertTypeLimits)
router.use('', addConvertRouter);
router.use('', getConvertsRouter);
router.use('', convertOverviewRouter);
router.use('', updateInvestmentRouter);
router.use('', deleteConvertRouter);
router.use('', editConvertRouter);
router.use('', replenishConvertRouter);


export default router;
