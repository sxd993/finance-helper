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
    cycleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      field: 'cycle_id',
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
    monthly_limit: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'monthly_limit',
    },
    current_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'current_amount',
    },
    target_amount: {
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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Convert.associate = (models) => {
    Convert.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });

    Convert.belongsTo(models.Cycle, {
      as: 'cycle',
      foreignKey: 'cycleId',
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
