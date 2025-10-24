const express = require('express');
const {
  sequelize,
  Convert,
  Expense,
} = require('../../db');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/delete-convert/:id', requireAuth, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.userId;
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Некорректный id конверта' });
    }

    const convert = await Convert.findOne({ where: { id, userId }, transaction });

    if (!convert) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Конверт не найден' });
    }

    await Expense.destroy({
      where: {
        convertName: convert.name,
        convertType: convert.typeCode,
      },
      transaction,
    });
    await convert.destroy({ transaction });
    await transaction.commit();

    return res.json({ message: 'Конверт удалён', id });
  } catch (error) {
    console.error('[delete-convert] error:', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Ошибка сервера при удалении конверта' });
  }
});

module.exports = router;
