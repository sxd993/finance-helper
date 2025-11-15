import express from 'express';
import changePercentRouter from './change-percent.js';
import changeProfileRouter from './change-profile.js';

const router = express.Router();

router.use('/change-percent', changePercentRouter);
router.use('/profile', changeProfileRouter);

export default router;
