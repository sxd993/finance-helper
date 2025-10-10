module.exports = (sequelize, DataTypes) => {
  const ConvertTypeLimit = sequelize.define('ConvertTypeLimit', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' },
    typeId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'type_id' },
    totalLimit: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'total_limit' },
    usedLimit: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'used_limit' },
  }, {
    tableName: 'convert_type_limits',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return ConvertTypeLimit;
};
