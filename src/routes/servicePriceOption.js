const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth'); // optional
const controller = require('../controllers/servicePriceOptionController');

// CRUD Routes
router.post('/', verifyToken, controller.createServicePriceOption);
router.get('/', controller.getAllServicePriceOptions);
router.get('/:id', controller.getServicePriceOptionById);
router.put('/:id', verifyToken, controller.updateServicePriceOption);
router.delete('/:id', verifyToken, controller.deleteServicePriceOption);

module.exports = router;
