const { Op, fn, col, literal } = require('sequelize');
const { Convert, ConvertType, Expense } = require('../../../db');

async function getTransactionsSummary(convertIds, { transaction } = {}) {
  if (!convertIds.length) return new Map();

  const converts = await Convert.findAll({
    where: { id: { [Op.in]: convertIds } },
    attributes: ['id', 'name', 'typeCode', 'targetAmount', 'initialAmount'],
    transaction,
  });

  if (!converts.length) return new Map();

  const expenseConditions = converts.map((convert) => ({
    convertName: convert.name,
    convertType: convert.typeCode,
  }));

  const expenseRows = expenseConditions.length
    ? await Expense.findAll({
        where: { [Op.or]: expenseConditions },
        attributes: [
          'convertName',
          'convertType',
          [fn('COALESCE', fn('SUM', col('sum')), literal('0')), 'total_out'],
        ],
        group: ['convertName', 'convertType'],
        raw: true,
        transaction,
      })
    : [];

  const makeKey = (name, typeCode) => `${name}::__${typeCode}`;
  const expensesByConvertKey = new Map(
    expenseRows.map((row) => [
      makeKey(row.convertName, row.convertType),
      Number(row.total_out) || 0,
    ]),
  );

  const summary = new Map();
  for (const convert of converts) {
    const totalOut =
      expensesByConvertKey.get(makeKey(convert.name, convert.typeCode)) || 0;
    const initialAmount = Number(convert.initialAmount ?? 0);
    const balance = Number((initialAmount - totalOut).toFixed(2));

    summary.set(Number(convert.id), {
      totalIn: initialAmount,
      totalOut,
      balance,
      transactionsSum: totalOut, // 👈 добавили это поле
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
    const summary =
      summaryMap.get(convert.id) || {
        totalIn: 0,
        totalOut: 0,
        balance: 0,
        transactionsSum: 0,
      };

    return {
      ...base,
      total_in: summary.totalIn,
      total_out: summary.totalOut,
      balance: summary.balance,
      transactionsSum: summary.transactionsSum, // 👈 добавляем в возвращаемый объект
    };
  });
}

module.exports = { getUserConverts, getTransactionsSummary };
