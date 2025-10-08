const express = require('express');
const typesRouter = require('./types');
const addConvertRouter = require('./add-convert');
const convertOverviewRouter = require('./converts-overview')

const router = express.Router('');

router.use('', typesRouter);
router.use('', addConvertRouter);
router.use('', convertOverviewRouter)

module.exports = router;
