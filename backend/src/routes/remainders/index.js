import express from 'express';

import getUserRemaindersRouter from './get-user-remainders.js';

const router = express.Router('');

router.use('', getUserRemaindersRouter);

export default router;
