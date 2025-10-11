const { ConvertType } = require('../../../db');

async function getConvertTypes() {
  return ConvertType.findAll({
    attributes: ['id', 'code', 'title', 'hasLimit', 'accumulates'],
    raw: true,
  });
}

module.exports = { getConvertTypes };

