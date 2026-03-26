const initConvertSaving = (sequelize, DataTypes) => {
  const ConvertSaving = sequelize.define('ConvertSaving', {
    convertId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      field: 'convert_id',
    },
    goalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'goal_amount',
    },
    savedAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'saved_amount',
    },
  }, {
    tableName: 'convert_saving',
    timestamps: false,
  });

  ConvertSaving.associate = (models) => {
    ConvertSaving.belongsTo(models.Convert, {
      as: 'convert',
      foreignKey: 'convertId',
      onDelete: 'CASCADE',
    });
  };

  return ConvertSaving;
};

export default initConvertSaving;
