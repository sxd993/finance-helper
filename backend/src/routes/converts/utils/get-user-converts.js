const { Op, fn, col, literal } = require('sequelize');
const {
  Convert,
  ConvertType,
  Expense,
} = require('../../../db');

async function getTransactionsSummary(convertIds, { transaction } = {}) {
  if (!convertIds.length) {
    return new Map();
  }

  const converts = await Convert.findAll({
    where: { id: { [Op.in]: convertIds } },
    attributes: ['id', 'name', 'typeCode', 'targetAmount', 'initialAmount'],
    transaction,
  });

  if (!converts.length) {
    return new Map();
  }

  const convertNames = converts.map((convert) => convert.name);

  const expenseRows = await Expense.findAll({
    where: { convertName: { [Op.in]: convertNames } },
    attributes: [
      'convertName',
      [fn('COALESCE', fn('SUM', col('sum')), literal('0')), 'total_out'],
    ],
    group: ['convertName'],
    raw: true,
    transaction,
  });

  const expensesByConvertName = new Map(
    expenseRows.map((row) => [row.convertName, Number(row.total_out) || 0]),
  );

  const summary = new Map();
  for (const convert of converts) {
    const totalOut = expensesByConvertName.get(convert.name) || 0;
    const targetAmount = Number(convert.targetAmount ?? 0) || 0;
    const initialAmount = Number(convert.initialAmount ?? 0) || 0;
    const fallbackAmount = targetAmount || initialAmount;

    let totalIn = 0;
    switch (convert.typeCode) {
      case 'investment':
        totalIn = initialAmount;
        break;
      case 'saving':
        totalIn = targetAmount || fallbackAmount;
        break;
      case 'important':
      case 'wishes':
        totalIn = fallbackAmount;
        break;
      default:
        totalIn = fallbackAmount;
    }

    const balance = Number((totalIn - totalOut).toFixed(2));

    summary.set(Number(convert.id), {
      totalIn,
      totalOut,
      balance,
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
