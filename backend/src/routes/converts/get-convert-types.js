import express from 'express';
import { requireAuth } from '../../utils/auth.js';
import { ConvertType } from '../../db/index.js';


const router = express.Router();

router.get('/get-convert-types', requireAuth, async (req, res) => {
  try {
    const types = await ConvertType.findAll()
    res.json(types)
  }

  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении конвертов пользователя' });
  }
  
})

export default router;
