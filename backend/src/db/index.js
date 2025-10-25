import { Sequelize, DataTypes } from 'sequelize';

import initUser from '../models/User.js';
import initCycle from '../models/Cycle.js';
import initConvertType from '../models/ConvertType.js';
import initConvert from '../models/Convert.js';
import initExpense from '../models/Expense.js';
import initRemainder from '../models/Remainder.js';
import initConvertTypeLimit from '../models/ConvertTypeLimit.js';

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_POOL_SIZE,
  SQL_LOG,
} = process.env;

if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
  console.warn('MySQL environment variables are missing. Check .env configuration.');
}

const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  port: MYSQL_PORT ? Number(MYSQL_PORT) : undefined,
  dialect: 'mysql',
  logging: SQL_LOG === 'true' ? console.log : false,
  dialectOptions: {
    decimalNumbers: true,
  },
  pool: {
    max: Number(MYSQL_POOL_SIZE) || 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: true,
  },
});

const User = initUser(sequelize, DataTypes);
const Cycle = initCycle(sequelize, DataTypes);
const ConvertType = initConvertType(sequelize, DataTypes);
const Convert = initConvert(sequelize, DataTypes);
const Expense = initExpense(sequelize, DataTypes);
const Remainder = initRemainder(sequelize, DataTypes);
const ConvertTypeLimit = initConvertTypeLimit(sequelize, DataTypes);

const models = {
  User,
  Cycle,
  ConvertType,
  Convert,
  Expense,
  Remainder,
  ConvertTypeLimit,
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

export {
  sequelize,
  Sequelize,
  models,
  User,
  Cycle,
  ConvertType,
  Convert,
  Expense,
  Remainder,
  ConvertTypeLimit,
};

export default {
  sequelize,
  Sequelize,
  models,
  User,
  Cycle,
  ConvertType,
  Convert,
  Expense,
  Remainder,
  ConvertTypeLimit,
};
