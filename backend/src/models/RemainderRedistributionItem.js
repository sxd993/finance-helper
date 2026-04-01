const initRemainderRedistributionItem = (sequelize, DataTypes) => {
  const RemainderRedistributionItem = sequelize.define('RemainderRedistributionItem', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    redistributionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'redistribution_id',
    },
    remainderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'remainder_id',
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  }, {
    tableName: 'remainder_redistribution_items',
    timestamps: false,
  });

  RemainderRedistributionItem.associate = (models) => {
    RemainderRedistributionItem.belongsTo(models.RemainderRedistribution, {
      as: 'redistribution',
      foreignKey: 'redistributionId',
      onDelete: 'CASCADE',
    });

    RemainderRedistributionItem.belongsTo(models.Remainder, {
      as: 'remainder',
      foreignKey: 'remainderId',
    });
  };

  return RemainderRedistributionItem;
};

export default initRemainderRedistributionItem;
