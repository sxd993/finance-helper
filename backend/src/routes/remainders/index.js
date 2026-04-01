import express from 'express';

import getUserRemaindersRouter from './get-user-remainders.js';
import redistributeRemainderRouter from './redistribute-remainder.js';
import getRemaindersHistoryRouter from './get-remainders-history.js';

const router = express.Router('');

router.use('', getUserRemaindersRouter);
router.use('', redistributeRemainderRouter);
router.use('', getRemaindersHistoryRouter);

export default router;
