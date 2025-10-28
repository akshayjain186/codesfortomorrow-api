
const express = require('express');
const bodyParser = require('body-parser'); 
require('dotenv').config();

const sequelize = require('./src/config/db'); // ✅ renamed from pool → sequelize

const authRouter = require('./src/routes/auth');
const categoryRouter = require('./src/routes/category');
const serviceRouter = require('./src/routes/service');


// === DEBUGGING CHECK START ===
if (typeof authRouter !== 'function') {
  console.error("❌ ERROR: authRouter is not a function. Check src/routes/auth.js export.");
  process.exit(1);
}
if (typeof categoryRouter !== 'function') {
  console.error("❌ ERROR: categoryRouter is not a function. Check src/routes/category.js export.");
  process.exit(1);
}
if (typeof serviceRouter !== 'function') {
  console.error("❌ ERROR: serviceRouter is not a function. Check src/routes/service.js export.");
  process.exit(1);
}
// === DEBUGGING CHECK END ===

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/api', authRouter); 
app.use('/api/categories', categoryRouter); 
app.use('/api/services', serviceRouter); 

app.get('/', (req, res) => {
  res.send('Codes For Tomorrow API is running!');
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  try {
    // ✅ Test DB connection
    await sequelize.authenticate();
    console.log('✅ MySQL Database Connected Successfully!');
  } catch (err) {
    console.error('❌ Database connection test failed:', err.message);
  }
});




// require('dotenv').config();
// const app = require('./app');
// const { sequelize } = require('./config/db');
// const User = require('./models/user');
// const bcrypt = require('bcryptjs');

// const PORT = process.env.PORT || 3000;

// async function init() {
//   try {
//     await sequelize.authenticate();
//     console.log('✅ DB connected');

//     // Sync models
//     await sequelize.sync({ alter: true });
//     console.log('✅ Models synced');

//     // Create default admin user if not exists
//     const adminEmail = 'admin@codesfortomorrow.com';
//     let admin = await User.findOne({ where: { email: adminEmail } });
//     if (!admin) {
//       const passwordHash = await bcrypt.hash('Admin123!@#', 10);
//       admin = await User.create({ name: 'Admin', email: adminEmail, passwordHash });
//       console.log(`✅ Admin user created -> ${adminEmail} / Admin123!@#`);
//     } else {
//       console.log('✅ Admin user exists');
//     }

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error('❌ Failed to start', err);
//     process.exit(1);
//   }
// }

// init();
