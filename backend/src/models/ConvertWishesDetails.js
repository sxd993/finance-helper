module.exports = (sequelize, DataTypes) => {
  const ConvertWishesDetails = sequelize.define('ConvertWishesDetails', {
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
    tableName: 'convert_wishes_details',
    timestamps: false,
  });

  ConvertWishesDetails.associate = (models) => {
    ConvertWishesDetails.belongsTo(models.Convert, {
      as: 'convert',
      foreignKey: 'convertId',
    });
  };

  return ConvertWishesDetails;
};
