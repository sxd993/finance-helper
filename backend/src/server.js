require('dotenv').config();
const listEndpoints = require('express-list-endpoints');
const app = require('./app');
const { sequelize } = require('./db');
const { startCycleScheduler } = require('./features/cycles/cycle');

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
