// module.exports = (sequelize, DataTypes) => {
//   const Service = sequelize.define('Service', {
//     id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
//     name: { type: DataTypes.STRING, allowNull: false },
//     type: { type: DataTypes.ENUM('Normal', 'VIP'), allowNull: false, defaultValue: 'Normal' },
//     categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
//   }, {
//     tableName: 'services',
//     timestamps: true,
//   });

//   return Service;
// };
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('Normal', 'VIP'), allowNull: false, defaultValue: 'Normal' },
    categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
  }, {
    tableName: 'services',
    timestamps: true
  });
  return Service;
};
