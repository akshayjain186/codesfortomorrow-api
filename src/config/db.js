// // src/config/db.js
// const { Pool } = require('pg'); 
// require('dotenv').config();

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//     ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false
// });

// // CRITICAL FIX: Export the pool object itself (not { Pool } which is wrong)
// module.exports = pool;





const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ MySQL Database Connected Successfully!'))
  .catch(err => console.error('❌ Database connection failed:', err));

module.exports = sequelize;
