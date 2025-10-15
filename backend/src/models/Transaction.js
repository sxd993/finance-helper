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
    type: {
      type: DataTypes.ENUM('deposit', 'spend', 'transfer_in', 'transfer_out'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    validate: {
      amountPositive() {
        const value = Number(this.getDataValue('amount'));
        if (!(value > 0)) {
          throw new Error('Transaction amount must be positive');
        }
      },
    },
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Convert, {
      as: 'convert',
      foreignKey: 'convertId',
    });
  };

  return Transaction;
};
