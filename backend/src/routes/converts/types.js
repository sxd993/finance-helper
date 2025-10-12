const express = require('express');
const { ConvertType } = require('../../db');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/types', requireAuth, async (req, res) => {
  try {
    const types = await ConvertType.findAll({
      attributes: ['id', 'code', 'title'],
      order: [['id', 'ASC']],
    });

    const payload = types.map((type) => ({
      id: type.id,
      code: type.code,
      title: type.title,
    }));

    res.json(payload);
  } catch (error) {
    console.error('Failed to fetch convert types', error);
    res.status(500).json({ message: 'Ошибка сервера при получении типов конвертов' });
  }
});

module.exports = router;
