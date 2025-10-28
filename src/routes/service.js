// // src/routes/service.js
// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/auth');
// const serviceController = require('../controllers/serviceController');

// // Apply JWT authentication to all Service routes
// router.use(authMiddleware);

// // POST /category/:categoryId/service (-> /api/category/:categoryId/service)
// router.post('/:categoryId/service', serviceController.createService);

// // GET /category/:categoryId/services (-> /api/category/:categoryId/services)
// router.get('/:categoryId/services', serviceController.getServicesByCategory);

// // PUT /category/:categoryId/service/:serviceId (-> /api/category/:categoryId/service/:serviceId)
// router.put('/:categoryId/service/:serviceId', serviceController.updateService);

// // DELETE /category/:categoryId/service/:serviceId (-> /api/category/:categoryId/service/:serviceId)
// router.delete('/:categoryId/service/:serviceId', serviceController.deleteService);

// module.exports = router;

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const serviceController = require('../controllers/serviceController');

// ✅ Create service
router.post('/', verifyToken, serviceController.createService);

// ✅ Get all services
router.get('/', serviceController.getAllServices);

// ✅ Get single service
router.get('/:id', serviceController.getServiceById);

// ✅ Update service
router.put('/:id', verifyToken, serviceController.updateService);

// ✅ Delete service
router.delete('/:id', verifyToken, serviceController.deleteService);

module.exports = router;

