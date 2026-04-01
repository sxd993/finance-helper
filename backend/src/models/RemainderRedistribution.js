const initRemainderRedistribution = (sequelize, DataTypes) => {
  const RemainderRedistribution = sequelize.define('RemainderRedistribution', {
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
    targetConvertId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'target_convert_id',
    },
    targetTypeCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'target_type_code',
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  }, {
    tableName: 'remainder_redistributions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  RemainderRedistribution.associate = (models) => {
    RemainderRedistribution.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });

    RemainderRedistribution.belongsTo(models.Convert, {
      as: 'targetConvert',
      foreignKey: 'targetConvertId',
    });

    RemainderRedistribution.belongsTo(models.ConvertType, {
      as: 'targetType',
      foreignKey: 'targetTypeCode',
      targetKey: 'code',
    });

    RemainderRedistribution.hasMany(models.RemainderRedistributionItem, {
      as: 'items',
      foreignKey: 'redistributionId',
    });
  };

  return RemainderRedistribution;
};

export default initRemainderRedistribution;
