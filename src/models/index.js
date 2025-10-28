const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = require('./user')(sequelize, DataTypes);
const Category = require('./category')(sequelize, DataTypes);
const Service = require('./service')(sequelize, DataTypes);
const ServicePriceOption = require('./servicePriceOption')(sequelize, DataTypes);

// Associations
Category.hasMany(Service, { as: 'services', foreignKey: 'categoryId', onDelete: 'CASCADE' });
Service.belongsTo(Category, { foreignKey: 'categoryId' });

Service.hasMany(ServicePriceOption, { as: 'priceOptions', foreignKey: 'serviceId', onDelete: 'CASCADE' });
ServicePriceOption.belongsTo(Service, { foreignKey: 'serviceId' });

module.exports = {
  sequelize,
  User,
  Category,
  Service,
  ServicePriceOption
};


