// // src/controllers/category.js
// const pool = require('../config/db');

// // POST /api/categories - Add Category
// const createCategory = async (req, res) => {
//     const { name } = req.body;
//     if (!name) {
//         return res.status(400).json({ message: 'Category name is required.' });
//     }

//     try {
//         const result = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
//         res.status(201).json({ message: 'Category created successfully.', category: result.rows[0] });
//     } catch (error) {
//         // Handle unique constraint error (PostgreSQL error code 23505)
//         if (error.code === '23505') { 
//             return res.status(409).json({ message: 'Category name already exists.' });
//         }
//         console.error('Create Category error:', error);
//         res.status(500).json({ message: 'Failed to create category.' });
//     }
// };

// // GET /api/categories - Get all categories
// const getAllCategories = async (req, res) => {
//     try {
//         const result = await pool.query('SELECT * FROM categories ORDER BY name');
//         res.json(result.rows);
//     } catch (error) {
//         console.error('Get All Categories error:', error);
//         res.status(500).json({ message: 'Failed to retrieve categories.' });
//     }
// };

// // PUT /api/categories/:categoryId - Update Category
// const updateCategory = async (req, res) => {
//     const { categoryId } = req.params;
//     const { name } = req.body;

//     if (!name) {
//         return res.status(400).json({ message: 'New category name is required.' });
//     }

//     try {
//         const result = await pool.query('UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', [name, categoryId]);
        
//         if (result.rowCount === 0) {
//             return res.status(404).json({ message: 'Category not found.' });
//         }

//         res.json({ message: 'Category updated successfully.', category: result.rows[0] });
//     } catch (error) {
//         if (error.code === '23505') { // Unique constraint error
//             return res.status(409).json({ message: 'Category name already exists.' });
//         }
//         console.error('Update Category error:', error);
//         res.status(500).json({ message: 'Failed to update category.' });
//     }
// };

// // DELETE /api/categories/:categoryId - Remove empty category only
// const deleteCategory = async (req, res) => {
//     const { categoryId } = req.params;

//     try {
//         // 1. Check if the category has any services
//         const serviceCheck = await pool.query('SELECT COUNT(*) FROM services WHERE category_id = $1', [categoryId]);
//         const serviceCount = parseInt(serviceCheck.rows[0].count, 10);

//         if (serviceCount > 0) {
//             return res.status(400).json({ message: 'Cannot delete category: Category is not empty (it contains ' + serviceCount + ' services).' });
//         }

//         // 2. If no services, proceed with deletion
//         const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [categoryId]);

//         if (result.rowCount === 0) {
//             return res.status(404).json({ message: 'Category not found.' });
//         }

//         res.json({ message: 'Category deleted successfully (as it was empty).' });
//     } catch (error) {
//         console.error('Delete Category error:', error);
//         res.status(500).json({ message: 'Failed to delete category.' });
//     }
// };

// module.exports = {
//     createCategory,
//     getAllCategories,
//     updateCategory,
//     deleteCategory,
// };

const { Category } = require('../models');

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ include: 'services' });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, { include: 'services' });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await category.update(req.body);
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await category.destroy();
    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
