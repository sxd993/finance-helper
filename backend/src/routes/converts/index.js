const express = require('express');
const typesRouter = require('./types');
const addConvertRouter = require('./add-convert');

const router = express.Router('');

router.use('', typesRouter);
router.use('', addConvertRouter);

module.exports = router;
