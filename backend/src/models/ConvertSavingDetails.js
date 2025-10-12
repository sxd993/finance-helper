module.exports = (sequelize, DataTypes) => {
  const ConvertSavingDetails = sequelize.define('ConvertSavingDetails', {
    convertId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      field: 'convert_id',
    },
    target_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: null,
    },
    current_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'convert_saving_details',
    timestamps: false,
  });

  ConvertSavingDetails.associate = (models) => {
    ConvertSavingDetails.belongsTo(models.Convert, {
      as: 'convert',
      foreignKey: 'convertId',
    });
  };

  return ConvertSavingDetails;
};

