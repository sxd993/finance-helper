import cron from 'node-cron';
import { Op } from 'sequelize';
import {
  getTodayDateOnly,
  RESETTABLE_TYPES,
  RESET_BEHAVIOR_BY_TYPE,
  shouldResetCycle,
} from './utils.js';
import {
  sequelize,
  User,
  Cycle,
  Convert,
  Remainder,
} from '../../db/index.js';
import { recalcUserTypeLimitsAndResetDistributed } from '../../routes/converts/utils/type-limits.js';

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

  // Group snapshots by typeCode to respect unique (cycle_id, type_code)
  const grouped = new Map();
  for (const { typeCode, amount } of convertSnapshots) {
    const numericAmount = Number(amount || 0);
    if (numericAmount <= 0) continue;
    grouped.set(typeCode, (grouped.get(typeCode) || 0) + numericAmount);
  }

  const remainderPayloads = Array.from(grouped.entries()).map(
    ([typeCode, amount]) => ({
      userId,
      cycleId,
      typeCode,
      amount,
    })
  );

  if (!remainderPayloads.length) {
    return;
  }

  await Remainder.bulkCreate(remainderPayloads, { transaction });
}


/* 
Функция сброса цикла
*/
async function resetConverts(userId, transaction) {
  const converts = await Convert.findAll({
    where: {
      userId,
      typeCode: {
        [Op.in]: RESETTABLE_TYPES,
      },
    },
    transaction,
  });

  if (!converts.length) {
    return [];
  }

  const snapshots = [];

  for (const convert of converts) {
    const behavior = RESET_BEHAVIOR_BY_TYPE[convert.typeCode];
    if (!behavior) {
      throw new Error(
        `Reset behavior is not defined for type "${convert.typeCode}". Update RESET_BEHAVIOR_BY_TYPE to reflect all convert types.`
      );
    }

    const amount = Number(convert.initialAmount || 0);
    if (amount > 0) {
      snapshots.push({ typeCode: convert.typeCode, amount });
    }

    if (behavior.deleteConvert) {
      await convert.destroy({ transaction });
      continue;
    }

    // For other types we keep convert as is; limits are reset via convert_type_limits table
  }
  return snapshots;
}

/* 
Основная функция, которая проверяет срок текущего цикла и при необходимости закрывает его, переносит остатки и открывает новый
*/
async function processUser(user, { dateOnly }) {
  return sequelize.transaction(async (transaction) => {
    let activeCycle = await Cycle.findOne({
      where: {
        userId: user.id,
        isClosed: false,
      },
      order: [['startDate', 'DESC']],
      transaction,
    });

    if (!activeCycle) {
      await createNewCycle(user.id, dateOnly, transaction);
      return false;
    }

    if (!shouldResetCycle(user, activeCycle.startDate, dateOnly)) {
      return false;
    }

    const closedCycle = await closePreviousCycle(
      user.id,
      dateOnly,
      transaction,
      activeCycle
    );
    const newCycle = await createNewCycle(user.id, dateOnly, transaction);

    const convertSnapshots = await resetConverts(user.id, transaction);
    await saveRemainders(
      user.id,
      closedCycle ? closedCycle.id : newCycle.id,
      convertSnapshots,
      transaction
    );

    // Recompute type limits and reset distributed to 0 for new cycle
    await recalcUserTypeLimitsAndResetDistributed(user, { transaction });

    return true;
  });
}

/* 
Основная функция запуска сброса цикла
*/
async function runCycleReset() {
  const dateOnly = getTodayDateOnly();

  const users = await User.findAll();

  for (const user of users) {
    try {
      const processed = await processUser(user, { dateOnly });
      if (processed) {
        console.log(
          `Цикл сброшен для пользователя  ${user.id} (${user.login}) в ${dateOnly}`
        );
      }
    } catch (error) {
      console.error(
        `Ошибка сброса цикла для пользователя  ${user.id} (${user.login}):`,
        error
      );
    }
  }
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
