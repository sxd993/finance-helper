require('dotenv').config();
const listEndpoints = require('express-list-endpoints');
const app = require('./app');
const { sequelize } = require('./db');

const PORT = process.env.PORT || 8000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  console.table(listEndpoints(app));

  app.listen(PORT, () => {
    console.log(`Finance Helper backend listening on port ${PORT}`);
  });
}

start();
