const initCycle = (sequelize, DataTypes) => {
  const Cycle = sequelize.define('Cycle', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      field: 'end_date',
    },
    isClosed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_closed',
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      field: 'closed_at',
    },
  }, {
    tableName: 'cycles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  Cycle.associate = (models) => {
    Cycle.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });

    Cycle.hasMany(models.Remainder, {
      as: 'remainders',
      foreignKey: 'cycleId',
    });
  };

  return Cycle;
};

export default initCycle;
