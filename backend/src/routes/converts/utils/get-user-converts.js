import { Op, fn, col, literal } from 'sequelize';
import {
  Convert,
  ConvertType,
  ConvertSpend,
  ConvertSaving,
  ConvertInvestment,
  Operation,
  Cycle,
} from '../../../db/index.js';

async function getUserLastCycle(userId, { transaction } = {}) {
  const activeCycle = await Cycle.findOne({
    where: { userId, isClosed: false },
    order: [['startDate', 'DESC']],
    attributes: ['startDate', 'endDate'],
    transaction,
  });
  if (activeCycle) return activeCycle.toJSON();

  const lastClosedCycle = await Cycle.findOne({
    where: { userId, isClosed: true },
    order: [['endDate', 'DESC'], ['startDate', 'DESC']],
    attributes: ['startDate', 'endDate'],
    transaction,
  });
  return lastClosedCycle ? lastClosedCycle.toJSON() : null;
}

async function getTransactionsSummary(userId, convertIds, options = {}) {
  const { transaction, cycleStartDate = null, cycleEndDate = null } = options;
  if (!convertIds.length) return new Map();

  const cycleRange = cycleStartDate
    ? { startDate: cycleStartDate, endDate: cycleEndDate }
    : await getUserLastCycle(userId, { transaction });
  if (!cycleRange) return new Map();

  const startValue = cycleRange.startDate ?? cycleRange.start_date;
  const endValue = cycleRange.endDate ?? cycleRange.end_date ?? Date.now();
  const startMs = new Date(startValue).getTime();
  const endMs = new Date(endValue).getTime();

  const expenseRows = await Operation.findAll({
    where: {
      userId,
      type: 'expense',
      convertId: { [Op.in]: convertIds },
      occurredAt: { [Op.between]: [startMs, endMs] },
    },
    attributes: [
      [col('convert_id'), 'convert_id'],
      [fn('COALESCE', fn('SUM', col('amount')), literal('0')), 'total_out'],
    ],
    group: ['convert_id'],
    raw: true,
    transaction,
  });

  const byConvertId = new Map(
    expenseRows.map((row) => [Number(row.convert_id), Number(row.total_out) || 0])
  );

  const summary = new Map();
  for (const id of convertIds) {
    const totalOut = byConvertId.get(Number(id)) || 0;
    const spendData = await ConvertSpend.findByPk(id, { attributes: ['fundedAmount'], transaction });
    const fundedAmount = Number(spendData?.fundedAmount ?? 0);
    summary.set(Number(id), {
      totalOut,
      transactionsSum: totalOut,
      balance: Number((fundedAmount - totalOut).toFixed(2)),
    });
  }
  return summary;
}

async function getUserConverts(userId, { transaction } = {}) {
  const converts = await Convert.findAll({
    where: { userId, isActive: true },
    include: [
      {
        model: ConvertType,
        as: 'type',
        attributes: ['code', 'title', 'description', 'isReset', 'hasLimit', 'canSpend', 'sortOrder', 'createdAt'],
      },
      { model: ConvertSpend, as: 'spend', attributes: ['monthlyLimit', 'fundedAmount'], required: false },
      { model: ConvertSaving, as: 'saving', attributes: ['goalAmount', 'savedAmount'], required: false },
      { model: ConvertInvestment, as: 'investment', attributes: ['investedAmount', 'currentValue'], required: false },
    ],
    order: [[{ model: ConvertType, as: 'type' }, 'sortOrder', 'ASC'], ['name', 'ASC']],
    transaction,
  });

  if (!converts.length) return [];

  const convertIds = converts.map((c) => Number(c.id));
  const summaryMap = await getTransactionsSummary(userId, convertIds, { transaction });

  return converts.map((convert) => {
    const base = convert.toJSON();
    const summary = summaryMap.get(Number(convert.id)) || { totalOut: 0, transactionsSum: 0 };
    return {
      ...base,
      total_out: summary.totalOut,
      transactionsSum: summary.transactionsSum,
    };
  });
}

export { getUserConverts, getTransactionsSummary };
