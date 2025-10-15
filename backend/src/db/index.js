const { Sequelize, DataTypes } = require('sequelize');

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

const User = require('../models/User')(sequelize, DataTypes);
const Cycle = require('../models/Cycle')(sequelize, DataTypes);
const ConvertType = require('../models/ConvertType')(sequelize, DataTypes);
const Convert = require('../models/Convert')(sequelize, DataTypes);
const Transaction = require('../models/Transaction')(sequelize, DataTypes);
const Remainder = require('../models/Remainder')(sequelize, DataTypes);
const ConvertImportantDetails = require('../models/ConvertImportantDetails')(sequelize, DataTypes);
const ConvertWishesDetails = require('../models/ConvertWishesDetails')(sequelize, DataTypes);
const ConvertSavingDetails = require('../models/ConvertSavingDetails')(sequelize, DataTypes);
const ConvertInvestmentDetails = require('../models/ConvertInvestmentDetails')(sequelize, DataTypes);
const ConvertTypeLimit = require('../models/ConvertTypeLimit')(sequelize, DataTypes);

const models = {
  User,
  Cycle,
  ConvertType,
  Convert,
  Transaction,
  Remainder,
  ConvertImportantDetails,
  ConvertWishesDetails,
  ConvertSavingDetails,
  ConvertInvestmentDetails,
  ConvertTypeLimit,
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  models,
  User,
  Cycle,
  ConvertType,
  Convert,
  Transaction,
  Remainder,
  ConvertImportantDetails,
  ConvertWishesDetails,
  ConvertSavingDetails,
  ConvertInvestmentDetails,
  ConvertTypeLimit,
};
