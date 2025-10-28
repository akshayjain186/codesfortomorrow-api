


const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const serviceController = require('../controllers/serviceController');

router.post('/', verifyToken, serviceController.createService);

router.get('/', serviceController.getAllServices);

router.get('/:id', serviceController.getServiceById);

router.put('/:id', verifyToken, serviceController.updateService);

router.delete('/:id', verifyToken, serviceController.deleteService);

module.exports = router;

