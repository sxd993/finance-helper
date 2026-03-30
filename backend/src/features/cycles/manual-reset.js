import 'dotenv/config';

import { sequelize } from '../../db/index.js';
import { runCycleReset } from './cycle.js';

function ensureManualResetAllowed() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Ручной принудительный сброс цикла запрещён в production. Используйте команду только в dev/test среде.'
    );
  }
}

function printSummary(stats) {
  console.log('\nРезультат ручного сброса цикла:');
  console.table({
    date: stats.dateOnly,
    force: stats.force,
    total_users: stats.totalUsers,
    reset_cycles: stats.resetCycles,
    created_cycles: stats.createdCycles,
    skipped_no_active_cycle: stats.skippedNoActiveCycle,
    skipped_not_due: stats.skippedNotDue,
    errors: stats.errors,
  });
}

async function main() {
  ensureManualResetAllowed();

  await sequelize.authenticate();
  console.log('Подключение к БД установлено');

  const stats = await runCycleReset({ force: true });
  printSummary(stats);
}

main()
  .then(async () => {
    await sequelize.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Сбой ручного сброса цикла:', error);

    try {
      await sequelize.close();
    } catch (closeError) {
      console.error('Не удалось закрыть соединение с БД:', closeError);
    }

    process.exit(1);
  });
