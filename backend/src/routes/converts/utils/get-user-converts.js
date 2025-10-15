const { Op, literal } = require('sequelize');
const {
  sequelize,
  Convert,
  ConvertType,
  Transaction,
} = require('../../../db');

const IN_TYPES = "('deposit','transfer_in')";
const OUT_TYPES = "('spend','transfer_out')";

async function getTransactionsSummary(convertIds, { transaction } = {}) {
  if (!convertIds.length) {
    return new Map();
  }

  const rows = await Transaction.findAll({
    where: { convertId: { [Op.in]: convertIds } },
    attributes: [
      'convertId',
      [
        sequelize.fn(
          'COALESCE',
          sequelize.fn('SUM', literal(`CASE WHEN type IN ${IN_TYPES} THEN amount ELSE 0 END`)),
          0,
        ),
        'total_in',
      ],
      [
        sequelize.fn(
          'COALESCE',
          sequelize.fn('SUM', literal(`CASE WHEN type IN ${OUT_TYPES} THEN amount ELSE 0 END`)),
          0,
        ),
        'total_out',
      ],
    ],
    group: ['convertId'],
    raw: true,
    transaction,
  });

  const summary = new Map();
  for (const row of rows) {
    const totalIn = Number(row.total_in) || 0;
    const totalOut = Number(row.total_out) || 0;
    summary.set(Number(row.convertId), {
      totalIn,
      totalOut,
      balance: Number((totalIn - totalOut).toFixed(2)),
    });
  }

  return summary;
}

async function getUserConverts(userId, { transaction } = {}) {
  const converts = await Convert.findAll({
    where: { userId },
    include: [
      {
        model: ConvertType,
        as: 'type',
        attributes: ['code', 'title', 'description', 'sortOrder', 'createdAt'],
      },
    ],
    order: [
      [{ model: ConvertType, as: 'type' }, 'sortOrder', 'ASC'],
      ['name', 'ASC'],
    ],
    transaction,
  });

  const convertIds = converts.map((convert) => convert.id);
  const summaryMap = await getTransactionsSummary(convertIds, { transaction });

  return converts.map((convert) => {
    const base = convert.toJSON();
    const summary = summaryMap.get(convert.id) || { totalIn: 0, totalOut: 0, balance: 0 };

    return {
      ...base,
      total_in: summary.totalIn,
      total_out: summary.totalOut,
      balance: summary.balance,
    };
  });
}

module.exports = { getUserConverts, getTransactionsSummary };
