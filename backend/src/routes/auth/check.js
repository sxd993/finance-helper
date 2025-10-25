import express from 'express';
import { requireAuth } from '../../utils/auth.js';

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  res.json(req.user);
});

export default router;
