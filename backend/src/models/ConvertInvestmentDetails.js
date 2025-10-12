module.exports = (sequelize, DataTypes) => {
  const ConvertInvestmentDetails = sequelize.define('ConvertInvestmentDetails', {
    convertId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      field: 'convert_id',
    },
    initial_investment: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: null,
    },
    current_value: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: null,
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    tableName: 'convert_investment_details',
    timestamps: false,
  });

  ConvertInvestmentDetails.associate = (models) => {
    ConvertInvestmentDetails.belongsTo(models.Convert, {
      as: 'convert',
      foreignKey: 'convertId',
    });
  };

  return ConvertInvestmentDetails;
};

