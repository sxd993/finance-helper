const express = require('express');
const { getUserConverts } = require('./utils/get-user-converts');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/get-converts', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    const rows = await getUserConverts(userId);

    const result = rows.map((r) => {
      const typeObj = r.type ? { id: r.type.id, code: r.type.code, title: r.type.title } : null;
      return ({
        id: r.id,
        name: r.name,
        overall_limit: r.overall_limit !== null && r.overall_limit !== undefined ? Number(r.overall_limit) : undefined,
        current_amount: r.current_amount !== null && r.current_amount !== undefined ? Number(r.current_amount) : undefined,
        target_amount: r.target_amount !== null && r.target_amount !== undefined ? Number(r.target_amount) : undefined,
        type_id: typeObj,
        type: typeObj,
      })
    });

    res.json(result);
  } catch (error) {
    console.error('Failed to fetch converts', error);
    res.status(500).json({ message: 'Ошибка сервера при получении конвертов' });
  }
});

module.exports = router;
