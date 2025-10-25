const { Op, fn, col, literal } = require("sequelize");
const { Convert, ConvertType, Expense, Cycle } = require("../../../db");

/**
 * Получает последний цикл пользователя (start_date / end_date)
 */
async function getUserLastCycle(userId, { transaction } = {}) {
  const lastCycle = await Cycle.findOne({
    where: { userId },
    order: [["end_date", "DESC"]],
    attributes: ["start_date", "end_date"],
    transaction,
  });

  return lastCycle ? lastCycle.toJSON() : null;
}

/**
 * Считает расходы по каждому конверту пользователя
 * только за текущий (последний) цикл.
 */
async function getTransactionsSummary(userId, convertIds, { transaction } = {}) {
  if (!convertIds.length) return new Map();

  // 1️⃣ Получаем последний цикл пользователя
  const lastCycle = await getUserLastCycle(userId, { transaction });
  if (!lastCycle) return new Map();

  // 2️⃣ Преобразуем start_date и end_date из формата DATE в миллисекунды
  const startMs = new Date(lastCycle.start_date).getTime();
  const endMs = new Date(lastCycle.end_date ?? Date.now()).getTime();

  // 3️⃣ Получаем конверты
  const converts = await Convert.findAll({
    where: { id: { [Op.in]: convertIds } },
    attributes: ["id", "name", "typeCode", "targetAmount", "initialAmount"],
    transaction,
  });

  if (!converts.length) return new Map();

  // 4️⃣ Формируем условия для выборки расходов
  const expenseConditions = converts.map((convert) => ({
    convert_name: convert.name,
    convert_type: convert.typeCode,
  }));

  // 5️⃣ Достаём расходы за текущий цикл
  const expenseRows = await Expense.findAll({
    where: {
      [Op.and]: [
        { [Op.or]: expenseConditions },
        { date: { [Op.between]: [startMs, endMs] } }, // ✅ фильтр по циклу в миллисекундах
      ],
    },
    attributes: [
      "convert_name",
      "convert_type",
      [fn("COALESCE", fn("SUM", col("sum")), literal("0")), "total_out"],
    ],
    group: ["convert_name", "convert_type"],
    raw: true,
    transaction,
  });

  // 6️⃣ Создаём Map по ключу "имя + тип"
  const makeKey = (name, typeCode) => `${name}::__${typeCode}`;
  const expensesByConvertKey = new Map(
    expenseRows.map((row) => [
      makeKey(row.convert_name, row.convert_type),
      Number(row.total_out) || 0,
    ])
  );

  // 7️⃣ Формируем итоговую сводку по каждому конверту
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
      transactionsSum: totalOut,
    });
  }

  return summary;
}

/**
 * Возвращает список конвертов пользователя
 * с подсчитанными суммами за последний цикл.
 */
async function getUserConverts(userId, { transaction } = {}) {
  // 1️⃣ Загружаем конверты и типы
  const converts = await Convert.findAll({
    where: { userId },
    include: [
      {
        model: ConvertType,
        as: "type",
        attributes: ["code", "title", "description", "sortOrder", "createdAt"],
      },
    ],
    order: [
      [{ model: ConvertType, as: "type" }, "sortOrder", "ASC"],
      ["name", "ASC"],
    ],
    transaction,
  });

  if (!converts.length) return [];

  const convertIds = converts.map((convert) => convert.id);

  // 2️⃣ Получаем сводку по последнему циклу
  const summaryMap = await getTransactionsSummary(userId, convertIds, { transaction });

  // 3️⃣ Объединяем данные из конвертов и сводки
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
      transactionsSum: summary.transactionsSum,
    };
  });
}

module.exports = { getUserConverts, getTransactionsSummary };
