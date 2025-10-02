module.exports = (sequelize, DataTypes) => {
  const Convert = sequelize.define('Convert', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    typeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'type_id',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    monthlyLimit: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'monthly_limit',
    },
    currentAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'current_amount',
    },
    targetAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: null,
      field: 'target_amount',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  }, {
    tableName: 'converts',
    timestamps: true,
  });

  Convert.associate = (models) => {
    Convert.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });

    Convert.belongsTo(models.ConvertType, {
      as: 'type',
      foreignKey: 'typeId',
    });

    Convert.hasMany(models.Transaction, {
      as: 'transactions',
      foreignKey: 'convertId',
    });
  };

  return Convert;
};
