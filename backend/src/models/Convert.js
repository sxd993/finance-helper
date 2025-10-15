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
    typeCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'type_code',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
      foreignKey: 'typeCode',
      targetKey: 'code',
    });

    Convert.hasMany(models.Transaction, {
      as: 'transactions',
      foreignKey: 'convertId',
    });

    // Type-specific details
    if (models.ConvertImportantDetails) {
      Convert.hasOne(models.ConvertImportantDetails, { as: 'important', foreignKey: 'convertId' });
    }
    if (models.ConvertWishesDetails) {
      Convert.hasOne(models.ConvertWishesDetails, { as: 'wishes', foreignKey: 'convertId' });
    }
    if (models.ConvertSavingDetails) {
      Convert.hasOne(models.ConvertSavingDetails, { as: 'saving', foreignKey: 'convertId' });
    }
    if (models.ConvertInvestmentDetails) {
      Convert.hasOne(models.ConvertInvestmentDetails, { as: 'investment', foreignKey: 'convertId' });
    }
  };

  return Convert;
};
