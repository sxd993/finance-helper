import express from 'express';
import getLatestCycleDaysRouter from './get-latest-cycle-days.js';

const router = express.Router();

router.use('', getLatestCycleDaysRouter);

export default router;
