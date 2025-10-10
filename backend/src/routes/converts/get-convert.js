const express = require('express');
const { Convert, ConvertType } = require('../../db');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/get-converts', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;

    const rows = await Convert.findAll({
      where: { userId },
      attributes: ['id', 'name', 'currentAmount', 'targetAmount'],
      include: [
        {
          model: ConvertType,
          as: 'type',
          attributes: ['id', 'code', 'title'],
        },
      ],
      raw: true,
      nest: true,
    });

    const result = rows.map((r) => ({
      id: r.id,
      name: r.name,
      current_amount: r.currentAmount !== null && r.currentAmount !== undefined ? Number(r.currentAmount) : undefined,
      target_amount: r.targetAmount !== null && r.targetAmount !== undefined ? Number(r.targetAmount) : undefined,
      type_id: r.type ? { id: r.type.id, code: r.type.code, title: r.type.title } : null,
    }));

    res.json(result);
  } catch (error) {
    console.error('Failed to fetch converts', error);
    res.status(500).json({ message: 'Ошибка сервера при получении конвертов' });
  }
});

module.exports = router;
