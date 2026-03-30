import express from 'express';
import { requireAuth } from '../../utils/auth.js';
import { getConvertTypes } from './utils/get-convert-types.js';


const router = express.Router();

router.get('/get-convert-types', requireAuth, async (req, res) => {
  try {
    const types = await getConvertTypes();
    res.json(types);
  }

  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении типов конверта' });
  }
  
})

export default router;
