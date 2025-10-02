module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    convertId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'convert_id',
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Convert, {
      as: 'convert',
      foreignKey: 'convertId',
    });
  };

  return Transaction;
};
