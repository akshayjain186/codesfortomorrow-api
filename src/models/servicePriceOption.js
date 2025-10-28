const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Service = require('./Service'); // assuming Service model exists

const ServicePriceOption = sequelize.define('ServicePriceOption', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'services',
      key: 'id'
    }
  },
  optionName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'service_price_options',
  timestamps: true
});

ServicePriceOption.belongsTo(Service, { foreignKey: 'serviceId', onDelete: 'CASCADE' });

module.exports = ServicePriceOption;
