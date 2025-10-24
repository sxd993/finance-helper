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
    typeCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'type_code',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    targetAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: null,
      field: 'target_amount',
    },
    initialAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: null,
      field: 'initial_amount',
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

    Convert.belongsTo(models.ConvertType, {
      as: 'type',
      foreignKey: 'typeCode',
      targetKey: 'code',
    });

    Convert.hasMany(models.Expense, {
      as: 'expenses',
      foreignKey: 'convertName',
      sourceKey: 'name',
      constraints: false,
    });
  };

  return Convert;
};
