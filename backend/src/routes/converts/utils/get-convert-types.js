import { ConvertType } from '../../../db/index.js';

async function getConvertTypes() {
  const rows = await ConvertType.findAll({
    attributes: [
      'code',
      'title',
      'description',
      'isReset',
      'hasLimit',
      'canSpend',
      'sortOrder',
      'createdAt',
    ],
    order: [['sortOrder', 'ASC']],
  });

  return rows.map((item) => item.toJSON());
}

export { getConvertTypes };
