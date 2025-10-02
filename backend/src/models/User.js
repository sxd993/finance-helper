module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    login: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    monthlyIncome: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'monthly_income',
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
    },
    distributionMode: {
      type: DataTypes.ENUM('baseline', 'flex'),
      allowNull: false,
      defaultValue: 'baseline',
      field: 'distribution_mode',
    },
    percentNecessary: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 50.0,
      field: 'percent_necessary',
    },
    percentDesire: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 30.0,
      field: 'percent_desire',
    },
    percentSaving: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 10.0,
      field: 'percent_saving',
    },
    percentInvestment: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 10.0,
      field: 'percent_investment',
    },
    leftoverPool: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'leftover_pool',
    },
    resetDay: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      field: 'reset_day',
    },
    lastResetAt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'last_reset_at',
    },
  }, {
    tableName: 'users',
    timestamps: true,
  });

  User.associate = (models) => {
    User.hasMany(models.Convert, {
      as: 'converts',
      foreignKey: 'userId',
    });
  };

  return User;
};
