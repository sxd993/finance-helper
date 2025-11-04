const initExpense = (sequelize, DataTypes) => {
  const Expense = sequelize.define('Expense', {
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    sum: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Unix timestamp in milliseconds to match frontend number type',
    },
    iconName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'icon_name',
    },
    iconColor: {
      type: DataTypes.STRING(32),
      allowNull: false,
      field: 'icon_color',
    },
    convertTitle: {
      type: DataTypes.VIRTUAL,
      get() {
        const type = this.get('type');
        return type?.title ?? null;
      },
      set() {
        throw new Error('convertTitle is derived from ConvertType and cannot be set directly');
      },
    },
  }, {
    tableName: 'expenses',
    timestamps: false,
    validate: {
      sumPositive() {
        if (!(Number(this.getDataValue('sum')) > 0)) {
          throw new Error('Expense sum must be positive');
        }
      },
    },
  });

  Expense.associate = (models) => {
    Expense.belongsTo(models.Convert, {
      as: 'convert',
      foreignKey: 'convertName',
      targetKey: 'name',
      constraints: false,
    });

    Expense.belongsTo(models.ConvertType, {
      as: 'type',
      foreignKey: 'convertType',
      targetKey: 'code',
    });
  };

  return Expense;
};

export default initExpense;
