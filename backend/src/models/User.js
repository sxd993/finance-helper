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
      allowNull: true,
      defaultValue: null,
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
    percentImportant: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 50.0,
      field: 'percent_important',
    },
    percentWishes: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 30.0,
      field: 'percent_wishes',
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
    cycleType: {
      type: DataTypes.ENUM('weekly', 'monthly'),
      allowNull: false,
      defaultValue: 'weekly',
      field: 'cycle_type',
    },
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  User.associate = (models) => {
    User.hasMany(models.Convert, {
      as: 'converts',
      foreignKey: 'userId',
    });

    User.hasMany(models.Cycle, {
      as: 'cycles',
      foreignKey: 'userId',
    });

    User.hasMany(models.Remainder, {
      as: 'remainders',
      foreignKey: 'userId',
    });
  };

  return User;
};
