const initConvertInvestment = (sequelize, DataTypes) => {
  const ConvertInvestment = sequelize.define('ConvertInvestment', {
    convertId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      field: 'convert_id',
    },
    investedAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'invested_amount',
    },
    currentValue: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'current_value',
    },
  }, {
    tableName: 'convert_investment',
    timestamps: false,
  });

  ConvertInvestment.associate = (models) => {
    ConvertInvestment.belongsTo(models.Convert, {
      as: 'convert',
      foreignKey: 'convertId',
      onDelete: 'CASCADE',
    });
  };

  return ConvertInvestment;
};

export default initConvertInvestment;
