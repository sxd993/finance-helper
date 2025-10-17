module.exports = (sequelize, DataTypes) => {
  const ConvertTypeLimit = sequelize.define('ConvertTypeLimit', {
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      field: 'user_id',
    },
    typeCode: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      field: 'type_code',
    },
    limitAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'limit_amount',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  }, {
    tableName: 'convert_type_limits',
    timestamps: false,
  });

  ConvertTypeLimit.associate = (models) => {
    ConvertTypeLimit.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });

    ConvertTypeLimit.belongsTo(models.ConvertType, {
      as: 'type',
      foreignKey: 'typeCode',
      targetKey: 'code',
    });
  };

  return ConvertTypeLimit;
};
