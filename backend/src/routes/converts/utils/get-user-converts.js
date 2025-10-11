const { Convert, ConvertType } = require('../../../db');

async function getUserConverts(userId) {
  return Convert.findAll({
    where: { userId },
    attributes: ['id', 'name', 'current_amount', 'overall_limit', 'target_amount'],
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
}

module.exports = { getUserConverts };
