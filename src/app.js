const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/', categoryRoutes); 

// Healthcheck
app.get('/health', (req, res) => res.json({ ok: true }));

// Error handler (simple)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

module.exports = app;
