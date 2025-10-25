import 'dotenv/config';
import listEndpoints from 'express-list-endpoints';
import app from './app.js';
import { sequelize } from './db/index.js';
import { startCycleScheduler } from './features/cycles/cycle.js';

const PORT = process.env.PORT || 8000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Подключение к БД');
  } catch (error) {
    console.error('Невозможно подключиться к базе данных:', error);
  }

  console.table(listEndpoints(app));

  app.listen(PORT, () => {
    console.log(`Сервер работает на порте: ${PORT}`);
  });
  startCycleScheduler();
}

start();
