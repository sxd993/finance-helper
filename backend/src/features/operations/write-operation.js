import { Operation } from '../../db/index.js';

const roundMoney = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? Number(num.toFixed(2)) : 0;
};

const createExpenseOperation = async ({ userId, expense, transaction }) => {
  const payload = {
    userId,
    type: 'expense',
    source: 'spend',
    amount: roundMoney(expense.sum),
    occurredAt: Number(expense.date),
    convertId: expense.convertId ?? null,
    convertName: expense.convertName,
    convertType: expense.convertType,
    title: expense.name,
    iconName: expense.iconName,
    remainderRedistributionId: null,
  };

  return Operation.create(payload, { transaction });
};

const updateExpenseOperation = async ({ userId, expenseId, expense, transaction }) => {
  const operation = await Operation.findOne({
    where: { id: expenseId, userId, type: 'expense' },
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (!operation) return null;

  await operation.update(
    {
      amount: roundMoney(expense.sum),
      occurredAt: Number(expense.date),
      convertId: expense.convertId ?? null,
      convertName: expense.convertName,
      convertType: expense.convertType,
      title: expense.name,
      iconName: expense.iconName,
    },
    { transaction }
  );

  return operation;
};

const deleteExpenseOperation = async ({ userId, expenseId, transaction }) => {
  const deletedCount = await Operation.destroy({
    where: { userId, type: 'expense', id: expenseId },
    transaction,
  });
  return deletedCount > 0;
};

const createTypeLimitReplenishmentOperation = async ({
  userId,
  convert,
  amount,
  transaction,
}) =>
  Operation.create(
    {
      userId,
      type: 'replenishment',
      source: 'type_limit',
      amount: roundMoney(amount),
      occurredAt: Date.now(),
      convertId: convert.id,
      convertName: convert.name,
      convertType: convert.typeCode,
      title: `Пополнение: ${convert.name}`,
      iconName: null,
      remainderRedistributionId: null,
    },
    { transaction }
  );

const createRemainderReplenishmentOperation = async ({
  userId,
  convert,
  amount,
  redistributionId,
  transaction,
}) =>
  Operation.create(
    {
      userId,
      type: 'replenishment',
      source: 'remainder',
      amount: roundMoney(amount),
      occurredAt: Date.now(),
      convertId: convert.id,
      convertName: convert.name,
      convertType: convert.typeCode,
      title: `Пополнение из остатков: ${convert.name}`,
      iconName: null,
      remainderRedistributionId: redistributionId,
    },
    { transaction }
  );

export {
  createExpenseOperation,
  updateExpenseOperation,
  deleteExpenseOperation,
  createTypeLimitReplenishmentOperation,
  createRemainderReplenishmentOperation,
};
