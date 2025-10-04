module.exports = (sequelize, DataTypes) => {
  const Deposit = sequelize.define('Deposit', {
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
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  }, {
    tableName: 'deposits',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  Deposit.associate = (models) => {
    Deposit.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });
  };

  return Deposit;
};
