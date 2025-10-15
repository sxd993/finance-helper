const { ConvertType } = require('../../../db');

async function getConvertTypes() {
  const rows = await ConvertType.findAll({
    attributes: ['code', 'title', 'description', 'sortOrder', 'createdAt'],
    order: [['sortOrder', 'ASC']],
  });

  return rows.map((item) => item.toJSON());
}

module.exports = { getConvertTypes };
