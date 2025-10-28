
const express = require('express');
const bodyParser = require('body-parser'); 
require('dotenv').config();

const sequelize = require('./src/config/db'); 
const authRouter = require('./src/routes/auth');
const categoryRouter = require('./src/routes/category');
const serviceRouter = require('./src/routes/service');
const servicePriceOptionRouter = require('./src/routes/servicePriceOption');

if (typeof authRouter !== 'function') {
  console.error(" ERROR: authRouter is not a function. Check src/routes/auth.js export.");
  process.exit(1);
}
if (typeof categoryRouter !== 'function') {
  console.error(" ERROR: categoryRouter is not a function. Check src/routes/category.js export.");
  process.exit(1);
}
if (typeof serviceRouter !== 'function') {
  console.error(" ERROR: serviceRouter is not a function. Check src/routes/service.js export.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());

app.use('/api', authRouter); 
app.use('/api/categories', categoryRouter); 
app.use('/api/services', serviceRouter); 
app.use('/api/service-price-options', servicePriceOptionRouter);


app.get('/', (req, res) => {
  res.send('Codes For Tomorrow API is running!');
});

app.listen(PORT, async () => {
  console.log(` Server running on http://localhost:${PORT}`);

  try {
    await sequelize.authenticate();
    console.log(' MySQL Database Connected Successfully!');
  } catch (err) {
    console.error(' Database connection test failed:', err.message);
  }
});



