const initOperation = (sequelize, DataTypes) => {
  const Operation = sequelize.define('Operation', {
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
    type: {
      type: DataTypes.ENUM('expense', 'replenishment'),
      allowNull: false,
    },
    source: {
      type: DataTypes.ENUM('spend', 'type_limit', 'remainder'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    occurredAt: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'occurred_at',
    },
    convertId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'convert_id',
    },
    convertName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'convert_name',
    },
    convertType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'convert_type',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    iconName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'icon_name',
    },
    remainderRedistributionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'remainder_redistribution_id',
    },
  }, {
    tableName: 'operations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    validate: {
      amountPositive() {
        if (!(Number(this.getDataValue('amount')) > 0)) {
          throw new Error('Operation amount must be positive');
        }
      },
    },
  });

  Operation.associate = (models) => {
    Operation.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });

    Operation.belongsTo(models.Convert, {
      as: 'convert',
      foreignKey: 'convertId',
      constraints: false,
    });

    Operation.belongsTo(models.ConvertType, {
      as: 'convertTypeInfo',
      foreignKey: 'convertType',
      targetKey: 'code',
    });

    Operation.belongsTo(models.RemainderRedistribution, {
      as: 'remainderRedistribution',
      foreignKey: 'remainderRedistributionId',
      constraints: false,
    });
  };

  return Operation;
};

export default initOperation;
