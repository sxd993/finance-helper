const initConvertType = (sequelize, DataTypes) => {
  const ConvertType = sequelize.define('ConvertType', {
    code: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  }, {
    tableName: 'convert_types',
    timestamps: false,
  });

  ConvertType.associate = (models) => {
    ConvertType.hasMany(models.Convert, {
      as: 'converts',
      foreignKey: 'typeCode',
      sourceKey: 'code',
    });
  };

  ConvertType.prototype.toJSON = function toJSON() {
    const values = { ...this.get() };
    values.id = values.sortOrder;
    return values;
  };

  return ConvertType;
};

export default initConvertType;
