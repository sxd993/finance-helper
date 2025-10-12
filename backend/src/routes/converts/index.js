const express = require('express');
const typesRouter = require('./types');
const addConvertRouter = require('./add-convert');
const getConvertsRouter = require('./get-convert');
const convertOverviewRouter = require('./converts-overview')
const updateInvestmentRouter = require('./update-investment');

const router = express.Router('');

router.use('', typesRouter);
router.use('', addConvertRouter);
router.use('', getConvertsRouter);
router.use('', convertOverviewRouter)
router.use('', updateInvestmentRouter);

module.exports = router;
