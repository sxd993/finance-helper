module.exports = (sequelize, DataTypes) => {
  const ConvertImportantDetails = sequelize.define('ConvertImportantDetails', {
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
    tableName: 'convert_important_details',
    timestamps: false,
  });

  ConvertImportantDetails.associate = (models) => {
    ConvertImportantDetails.belongsTo(models.Convert, {
      as: 'convert',
      foreignKey: 'convertId',
    });
  };

  return ConvertImportantDetails;
};
