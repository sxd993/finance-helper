import cron from 'node-cron';
import { Op, fn, col, literal } from 'sequelize';
import {
  getTodayDateOnly,
  shouldResetCycle,
} from './utils.js';
import {
  sequelize,
  User,
  Cycle,
  ConvertType,
  Convert,
  ConvertSaving,
  ConvertInvestment,
  Operation,
  Remainder,
} from '../../db/index.js';
import { recalcUserTypeLimitsAndResetDistributed } from '../../routes/converts/utils/type-limits.js';
import { getTypeLimitsMap } from '../../routes/converts/utils/type-limits.js';
import { isSameDateOnly } from './utils.js';

function createInitialStats(dateOnly, force) {
  return {
    dateOnly,
    force,
    totalUsers: 0,
    resetCycles: 0,
    createdCycles: 0,
    skippedNoActiveCycle: 0,
    skippedAlreadyResetToday: 0,
    skippedNotDue: 0,
    errors: 0,
  };
}

/* 
Функция закрытия предыдущего цикла
*/
async function closePreviousCycle(userId, endDate, transaction, cycleToClose = null) {
  const previousCycle =
    cycleToClose ||
    (await Cycle.findOne({
      where: {
        userId,
        isClosed: false,
      },
      order: [['startDate', 'DESC']],
      transaction,
    }));

  if (!previousCycle) {
    return null;
  }

  await previousCycle.update(
    {
      isClosed: true,
      endDate,
      closedAt: new Date(),
    },
    { transaction }
  );

  return previousCycle;
}


/* 
Функция открытия нового цикла
*/
async function createNewCycle(userId, startDate, transaction) {
  const existingCycle = await Cycle.findOne({
    where: {
      userId,
      startDate,
      isClosed: false,
    },
    transaction,
  });

  if (existingCycle) {
    return existingCycle;
  }

  return Cycle.create(
    {
      userId,
      startDate,
      isClosed: false,
    },
    { transaction }
  );
}

/* 
Функция сохранения остатков пользователя после закрытия цикла
*/
async function saveRemainders(userId, cycleId, convertSnapshots, transaction) {
  if (!cycleId || !convertSnapshots.length) {
    return;
  }

  const grouped = new Map();
  for (const { typeCode, amount } of convertSnapshots) {
    const numericAmount = Number(amount || 0);
    if (numericAmount <= 0) continue;
    grouped.set(typeCode, Number(((grouped.get(typeCode) || 0) + numericAmount).toFixed(2)));
  }

  const remainderPayloads = Array.from(grouped.entries()).map(([typeCode, amount]) => ({
    userId,
    cycleId,
    typeCode,
    amount,
  }));

  if (!remainderPayloads.length) {
    return;
  }

  await Remainder.bulkCreate(remainderPayloads, { transaction });
}


/* 
Функция сброса цикла
*/
async function resetConverts(user, transaction, cycleRange = null) {
  const userId = user.id;
  const converts = await Convert.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: ConvertType,
        as: 'type',
        attributes: ['code', 'isReset'],
        required: true,
        where: { isReset: true },
      },
    ],
    transaction,
  });

  const snapshots = [];
  const typeLimitsMap = await getTypeLimitsMap({
    userId,
    user,
    transaction,
  });
  const spendRows = await Operation.findAll({
    where: {
      userId,
      type: 'expense',
      convertType: {
        [Op.in]: ['important', 'wishes'],
      },
      occurredAt: {
        [Op.between]: [
          new Date(cycleRange?.startDate ?? Date.now()).getTime(),
          new Date(cycleRange?.endDate ?? Date.now()).getTime(),
        ],
      },
    },
    attributes: [
      'convertType',
      [fn('COALESCE', fn('SUM', col('amount')), literal('0')), 'total_out'],
    ],
    group: ['convertType'],
    raw: true,
    transaction,
  });
  const spentByType = new Map(
    spendRows.map((row) => [String(row.convertType), Number(row.total_out) || 0])
  );

  for (const typeCode of ['important', 'wishes']) {
    const limit = Number(typeLimitsMap[typeCode] ?? 0);
    const spent = Number(spentByType.get(typeCode) ?? 0);
    const amount = Number(Math.max(limit - spent, 0).toFixed(2));

    if (amount > 0) {
      snapshots.push({ typeCode, amount });
    }
  }

  const spendConvertIds = converts
    .filter((convert) => convert.typeCode === 'important' || convert.typeCode === 'wishes')
    .map((convert) => Number(convert.id));

  if (spendConvertIds.length) {
    await Convert.destroy({
      where: {
        id: { [Op.in]: spendConvertIds },
        userId,
      },
      transaction,
    });
  }

  for (const convert of converts) {
    if (convert.typeCode === 'saving') {
      const saving = await ConvertSaving.findByPk(convert.id, { transaction });
      const amount = Number(saving?.savedAmount || 0);
      if (amount > 0) {
        snapshots.push({ typeCode: convert.typeCode, amount });
      }
      continue;
    }

    if (convert.typeCode === 'investment') {
      const investment = await ConvertInvestment.findByPk(convert.id, { transaction });
      const amount = Number(investment?.investedAmount || 0);
      if (amount > 0) {
        snapshots.push({ typeCode: convert.typeCode, amount });
      }
    }
  }

  return snapshots;
}

/* 
Основная функция, которая проверяет срок текущего цикла и при необходимости закрывает его, переносит остатки и открывает новый
*/
async function processUser(user, { dateOnly, force = false }) {
  return sequelize.transaction(async (transaction) => {
    const activeCycle = await Cycle.findOne({
      where: {
        userId: user.id,
        isClosed: false,
      },
      order: [['startDate', 'DESC']],
      transaction,
    });

    if (!activeCycle) {
      if (force) {
        return { status: 'skipped_no_active_cycle' };
      }

      await createNewCycle(user.id, dateOnly, transaction);
      return { status: 'created_cycle' };
    }

    if (force && isSameDateOnly(activeCycle.startDate, dateOnly)) {
      return { status: 'skipped_already_reset_today' };
    }

    if (!force && !shouldResetCycle(user, activeCycle.startDate, dateOnly)) {
      return { status: 'skipped_not_due' };
    }

    const resetCycleRange = {
      startDate: activeCycle.startDate,
      endDate: dateOnly,
    };

    const closedCycle = await closePreviousCycle(
      user.id,
      dateOnly,
      transaction,
      activeCycle
    );
    const newCycle = await createNewCycle(user.id, dateOnly, transaction);

    const convertSnapshots = await resetConverts(user, transaction, resetCycleRange);
    await saveRemainders(
      user.id,
      closedCycle ? closedCycle.id : newCycle.id,
      convertSnapshots,
      transaction
    );

    // Recompute type limits and reset distributed to 0 for new cycle
    await recalcUserTypeLimitsAndResetDistributed(user, { transaction });

    return {
      status: 'reset',
      closedCycleId: closedCycle?.id ?? null,
      newCycleId: newCycle?.id ?? null,
      remaindersCreated: convertSnapshots.length,
    };
  });
}

/* 
Основная функция запуска сброса цикла
*/
async function runCycleReset(options = {}) {
  const {
    force = false,
    dateOnly = getTodayDateOnly(),
  } = options;

  const users = await User.findAll();
  const stats = createInitialStats(dateOnly, force);

  for (const user of users) {
    stats.totalUsers += 1;

    try {
      const result = await processUser(user, { dateOnly, force });

      if (result.status === 'reset') {
        stats.resetCycles += 1;
        console.log(
          `Цикл сброшен для пользователя ${user.id} (${user.login}) в ${dateOnly}${force ? ' [force]' : ''}`
        );
        continue;
      }

      if (result.status === 'created_cycle') {
        stats.createdCycles += 1;
        console.log(
          `Создан новый цикл для пользователя ${user.id} (${user.login}) в ${dateOnly}`
        );
        continue;
      }

      if (result.status === 'skipped_no_active_cycle') {
        stats.skippedNoActiveCycle += 1;
        console.log(
          `Пропуск пользователя ${user.id} (${user.login}): нет активного цикла для force-reset`
        );
        continue;
      }

      if (result.status === 'skipped_already_reset_today') {
        stats.skippedAlreadyResetToday += 1;
        console.log(
          `Пропуск пользователя ${user.id} (${user.login}): цикл уже был сброшен ${dateOnly}`
        );
        continue;
      }

      if (result.status === 'skipped_not_due') {
        stats.skippedNotDue += 1;
      }
    } catch (error) {
      stats.errors += 1;
      console.error(
        `Ошибка сброса цикла для пользователя ${user.id} (${user.login}):`,
        error
      );
    }
  }

  return stats;
}

/* 
Основная функция расписания
*/
export function startCycleScheduler() {
  cron.schedule('0 * * * *', () => {
    runCycleReset().catch((error) => {
      console.error('Сбой задачи сброса цикла:', error);
    });
  });

  runCycleReset().catch((error) => {
    console.error('Сбой задачи сброса цикла при запуске:', error);
  });

  console.log('Планировщик циклов запущен');
}

export { runCycleReset };
