module.exports = (sequelize, DataTypes) => {
  const ConvertBudgetDetails = sequelize.define('ConvertBudgetDetails', {
    convertId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      field: 'convert_id',
    },
    current_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    overall_limit: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0,
    },
  }, {
    tableName: 'convert_budget_details',
    timestamps: false,
  });

  ConvertBudgetDetails.associate = (models) => {
    ConvertBudgetDetails.belongsTo(models.Convert, {
      as: 'convert',
      foreignKey: 'convertId',
    });
  };

  return ConvertBudgetDetails;
};

