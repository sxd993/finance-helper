module.exports = (sequelize, DataTypes) => {
  const Remainder = sequelize.define('Remainder', {
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
      allowNull: false,
      field: 'cycle_id',
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  }, {
    tableName: 'remainders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  Remainder.associate = (models) => {
    Remainder.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });

    Remainder.belongsTo(models.Cycle, {
      as: 'cycle',
      foreignKey: 'cycleId',
    });
  };

  return Remainder;
};
