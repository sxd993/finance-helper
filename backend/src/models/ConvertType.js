module.exports = (sequelize, DataTypes) => {
  const ConvertType = sequelize.define('ConvertType', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  }, {
    tableName: 'convert_types',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  ConvertType.associate = (models) => {
    ConvertType.hasMany(models.Convert, {
      as: 'converts',
      foreignKey: 'typeCode',
      sourceKey: 'code',
    });
  };

  return ConvertType;
};
