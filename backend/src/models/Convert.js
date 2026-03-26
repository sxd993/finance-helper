const initConvert = (sequelize, DataTypes) => {
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
      foreignKey: 'convertId',
    });

    Convert.hasOne(models.ConvertSpend, {
      as: 'spend',
      foreignKey: 'convertId',
    });

    Convert.hasOne(models.ConvertSaving, {
      as: 'saving',
      foreignKey: 'convertId',
    });

    Convert.hasOne(models.ConvertInvestment, {
      as: 'investment',
      foreignKey: 'convertId',
    });
  };

  return Convert;
};

export default initConvert;
