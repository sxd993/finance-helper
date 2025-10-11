const { ConvertTypeLimit } = require('../../../db');

async function getUserConvertLimits(userId) {
  const rows = await ConvertTypeLimit.findAll({
    where: { userId },
    attributes: ['typeId', 'totalLimit', 'usedLimit'],
    raw: true,
  });

  return rows.map(r => ({
    type_id: r.typeId,
    total_limit: Number(r.totalLimit),
    used_limit: Number(r.usedLimit),
    available_limit: Number(r.totalLimit) - Number(r.usedLimit),
  }));
}
module.exports = { getUserConvertLimits };
