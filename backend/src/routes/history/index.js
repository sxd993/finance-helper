import express from 'express';

import getHistoryRouter from './get-history.js';

const router = express.Router('');

router.use('', getHistoryRouter);

export default router;
