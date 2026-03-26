const initConvertSpend = (sequelize, DataTypes) => {
  const ConvertSpend = sequelize.define('ConvertSpend', {
    convertId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      field: 'convert_id',
    },
    monthlyLimit: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'monthly_limit',
    },
    fundedAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'funded_amount',
    },
  }, {
    tableName: 'convert_spend',
    timestamps: false,
  });

  ConvertSpend.associate = (models) => {
    ConvertSpend.belongsTo(models.Convert, {
      as: 'convert',
      foreignKey: 'convertId',
      onDelete: 'CASCADE',
    });
  };

  return ConvertSpend;
};

export default initConvertSpend;
