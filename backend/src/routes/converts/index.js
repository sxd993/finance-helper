const express = require('express');
const typesRouter = require('./types');
const addConvertRouter = require('./add-convert');
const getConvertsRouter = require('./get-convert');
const convertOverviewRouter = require('./converts-overview');
const updateInvestmentRouter = require('./update-investment');
const deleteConvertRouter = require('./delete-convert');
const editConvertRouter = require('./edit-convert');

const router = express.Router('');

router.use('', typesRouter);
router.use('', addConvertRouter);
router.use('', getConvertsRouter);
router.use('', convertOverviewRouter);
router.use('', updateInvestmentRouter);
router.use('', deleteConvertRouter);
router.use('', editConvertRouter);

module.exports = router;
