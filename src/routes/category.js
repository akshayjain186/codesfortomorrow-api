

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

router.post('/', verifyToken, categoryController.createCategory);

router.get('/', categoryController.getAllCategories);

router.get('/:id', categoryController.getCategoryById);

router.put('/:id', verifyToken, categoryController.updateCategory);

router.delete('/:id', verifyToken, categoryController.deleteCategory);

module.exports = router;

