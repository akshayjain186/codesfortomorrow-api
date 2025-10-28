
const express = require('express');
const router = express.Router();
const { login, devLogin } = require('../controllers/authController');

router.post('/login', login);

router.post('/dev-login', devLogin);

module.exports = router;



