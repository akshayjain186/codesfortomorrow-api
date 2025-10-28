// // src/routes/category.js
// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/auth');
// const categoryController = require('../controllers/categoryController');

// // Apply JWT authentication to all Category routes
// router.use(authMiddleware);

// // POST /category (-> /api/categories)
// router.post('/', categoryController.createCategory);

// // GET /categories (-> /api/categories)
// router.get('/', categoryController.getAllCategories);

// // PUT /category/:categoryId (-> /api/categories/:categoryId)
// router.put('/:categoryId', categoryController.updateCategory);

// // DELETE /category/:categoryId (-> /api/categories/:categoryId)
// router.delete('/:categoryId', categoryController.deleteCategory);

// module.exports = router;

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

// ✅ Create a category
router.post('/', verifyToken, categoryController.createCategory);

// ✅ Get all categories
router.get('/', categoryController.getAllCategories);

// ✅ Get single category by ID
router.get('/:id', categoryController.getCategoryById);

// ✅ Update category
router.put('/:id', verifyToken, categoryController.updateCategory);

// ✅ Delete category
router.delete('/:id', verifyToken, categoryController.deleteCategory);

module.exports = router;

