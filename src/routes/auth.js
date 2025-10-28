// // src/routes/auth.js
// const express = require('express');
// const router = express.Router();
// // authController must export { login }
// const authController = require('../controllers/auth'); 

// // POST /login - This route is defined under /api in server.js, so it becomes /api/login
// // This is the only route that does NOT require JWT authentication middleware
// router.post('/login', authController.login);

// // CRITICAL: Exports the Express Router function
// module.exports = router; 
const express = require('express');
const router = express.Router();
const { login, devLogin } = require('../controllers/authController');

// Normal secure login
router.post('/login', login);

// Dev-only (plain password) login
router.post('/dev-login', devLogin);

module.exports = router;



