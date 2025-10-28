// // src/controllers/service.js
// const pool = require('../config/db');

// // POST /category/:categoryId/service - Add service with price options (Transaction used)
// const createService = async (req, res) => {
//     const { categoryId } = req.params;
//     const { name, type, priceOptions } = req.body; 

//     // Basic Validation
//     if (!name || !type || !['Normal', 'VIP'].includes(type)) {
//         return res.status(400).json({ message: 'Service name and valid type (Normal/VIP) are required.' });
//     }

//     const client = await pool.connect();
//     try {
//         await client.query('BEGIN'); // Start Transaction

//         // 1. Check if Category exists
//         const catCheck = await client.query('SELECT id FROM categories WHERE id = $1', [categoryId]);
//         if (catCheck.rowCount === 0) {
//             await client.query('ROLLBACK');
//             return res.status(404).json({ message: 'Category not found.' });
//         }

//         // 2. Insert the Service
//         const serviceResult = await client.query(
//             'INSERT INTO services (category_id, name, type) VALUES ($1, $2, $3) RETURNING id, name',
//             [categoryId, name, type]
//         );
//         const serviceId = serviceResult.rows[0].id;
        
//         // 3. Insert Price Options
//         if (priceOptions && Array.isArray(priceOptions) && priceOptions.length > 0) {
//             for (const option of priceOptions) {
//                 if (!option.duration || !option.price || !option.type || !['Hourly', 'Weekly', 'Monthly'].includes(option.type)) {
//                     await client.query('ROLLBACK');
//                     return res.status(400).json({ message: `Invalid price option data: ${JSON.stringify(option)}` });
//                 }
//                 await client.query(
//                     'INSERT INTO service_price_options (service_id, duration, price, type) VALUES ($1, $2, $3, $4)',
//                     [serviceId, option.duration, option.price, option.type]
//                 );
//             }
//         }

//         await client.query('COMMIT'); // Commit Transaction
//         res.status(201).json({ 
//             message: 'Service and price options created successfully.', 
//             service: serviceResult.rows[0], 
//             priceOptions: priceOptions 
//         });

//     } catch (error) {
//         await client.query('ROLLBACK'); // Rollback on error
//         console.error('Create Service error:', error);
//         res.status(500).json({ message: 'Failed to create service.' });
//     } finally {
//         client.release();
//     }
// };

// // GET /category/:categoryId/services - Get all services inside any category
// const getServicesByCategory = async (req, res) => {
//     const { categoryId } = req.params;

//     try {
//         // Fetch services and their price options efficiently using JSON aggregation (or manual grouping)
//         const result = await pool.query(`
//             SELECT 
//                 s.id, 
//                 s.name, 
//                 s.type, 
//                 s.category_id,
//                 COALESCE(
//                     json_agg(
//                         json_build_object(
//                             'id', spo.id, 
//                             'duration', spo.duration, 
//                             'price', spo.price, 
//                             'type', spo.type
//                         ) ORDER BY spo.id
//                     ) FILTER (WHERE spo.id IS NOT NULL), '[]'
//                 ) AS price_options
//             FROM services s
//             LEFT JOIN service_price_options spo ON s.id = spo.service_id
//             WHERE s.category_id = $1
//             GROUP BY s.id, s.name, s.type, s.category_id
//             ORDER BY s.name;
//         `, [categoryId]);

//         if (result.rows.length === 0) {
//              // Check if category exists before returning 404
//              const catCheck = await pool.query('SELECT id FROM categories WHERE id = $1', [categoryId]);
//              if (catCheck.rowCount === 0) {
//                 return res.status(404).json({ message: 'Category not found.' });
//              }
//             return res.json([]);
//         }

//         res.json(result.rows);
//     } catch (error) {
//         console.error('Get Services error:', error);
//         res.status(500).json({ message: 'Failed to retrieve services.' });
//     }
// };

// // DELETE /category/:categoryId/service/:serviceId - Remove service from category
// const deleteService = async (req, res) => {
//     const { categoryId, serviceId } = req.params;

//     try {
//         const result = await pool.query(
//             'DELETE FROM services WHERE id = $1 AND category_id = $2 RETURNING *',
//             [serviceId, categoryId]
//         );

//         if (result.rowCount === 0) {
//             return res.status(404).json({ message: 'Service not found in the specified category.' });
//         }

//         // Price options are automatically deleted due to ON DELETE CASCADE foreign key constraint

//         res.json({ message: 'Service deleted successfully.' });
//     } catch (error) {
//         console.error('Delete Service error:', error);
//         res.status(500).json({ message: 'Failed to delete service.' });
//     }
// };

// // PUT /category/:categoryId/service/:serviceId - Update service and its price options (Transaction used)
// const updateService = async (req, res) => {
//     const { categoryId, serviceId } = req.params;
//     const { name, type, priceOptions } = req.body; // priceOptions: array of {id (optional), duration, price, type}

//     if (!name || !type || !['Normal', 'VIP'].includes(type)) {
//         return res.status(400).json({ message: 'Service name and valid type (Normal/VIP) are required.' });
//     }

//     const client = await pool.connect();
//     try {
//         await client.query('BEGIN');

//         // 1. Update the Service details
//         const updateResult = await client.query(
//             'UPDATE services SET name = $1, type = $2 WHERE id = $3 AND category_id = $4 RETURNING *',
//             [name, type, serviceId, categoryId]
//         );

//         if (updateResult.rowCount === 0) {
//             await client.query('ROLLBACK');
//             return res.status(404).json({ message: 'Service not found in the specified category.' });
//         }

//         // 2. Handle Price Options: Determine which prices to keep, update, or insert.
//         const existingPrices = await client.query('SELECT id FROM service_price_options WHERE service_id = $1', [serviceId]);
//         const existingIds = existingPrices.rows.map(row => row.id);
//         const newOrUpdatedIds = (priceOptions || []).map(opt => opt.id).filter(id => id); // IDs provided in the request body

//         // IDs to delete (those existing but not present in the new list)
//         const idsToDelete = existingIds.filter(id => !newOrUpdatedIds.includes(id));

//         if (idsToDelete.length > 0) {
//             await client.query('DELETE FROM service_price_options WHERE id = ANY($1::int[])', [idsToDelete]);
//         }

//         // 3. Insert new and Update existing Price Options
//         if (priceOptions && Array.isArray(priceOptions)) {
//             for (const option of priceOptions) {
//                 if (!option.duration || !option.price || !option.type || !['Hourly', 'Weekly', 'Monthly'].includes(option.type)) {
//                     await client.query('ROLLBACK');
//                     return res.status(400).json({ message: `Invalid price option data: ${JSON.stringify(option)}` });
//                 }

//                 if (option.id && existingIds.includes(option.id)) {
//                     // Update existing option (by ID)
//                     await client.query(
//                         'UPDATE service_price_options SET duration = $1, price = $2, type = $3 WHERE id = $4 AND service_id = $5',
//                         [option.duration, option.price, option.type, option.id, serviceId]
//                     );
//                 } else if (!option.id) {
//                     // Insert new option (ID is missing)
//                     await client.query(
//                         'INSERT INTO service_price_options (service_id, duration, price, type) VALUES ($1, $2, $3, $4)',
//                         [serviceId, option.duration, option.price, option.type]
//                     );
//                 }
//                 // Ignore options with ID that did not exist (or handle as an error if strict validation is needed)
//             }
//         }

//         await client.query('COMMIT');
//         res.json({ message: 'Service and price options updated successfully.', service: updateResult.rows[0] });

//     } catch (error) {
//         await client.query('ROLLBACK');
//         console.error('Update Service error:', error);
//         res.status(500).json({ message: 'Failed to update service.' });
//     } finally {
//         client.release();
//     }
// };


// module.exports = {
//     createService,
//     getServicesByCategory,
//     deleteService,
//     updateService
// };

const { Category, Service, ServicePriceOption } = require('../models');

const addService = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, type, priceOptions } = req.body;

    if (!name) return res.status(400).json({ message: 'Service name required' });
    if (type && !['Normal', 'VIP'].includes(type)) return res.status(400).json({ message: 'Invalid service type' });

    const cat = await Category.findByPk(categoryId);
    if (!cat) return res.status(404).json({ message: 'Category not found' });

    const service = await Service.create({ name, type: type || 'Normal', categoryId: cat.id });

    if (Array.isArray(priceOptions)) {
      const validPOs = priceOptions.filter(po => po.duration && po.price && ['Hourly', 'Weekly', 'Monthly'].includes(po.type));
      for (const po of validPOs) {
        await ServicePriceOption.create({
          serviceId: service.id,
          duration: po.duration,
          price: po.price,
          type: po.type
        });
      }
    }

    const created = await Service.findByPk(service.id, { include: [{ model: ServicePriceOption, as: 'priceOptions' }] });
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const listServicesInCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const cat = await Category.findByPk(categoryId);
    if (!cat) return res.status(404).json({ message: 'Category not found' });

    const services = await Service.findAll({
      where: { categoryId },
      include: [{ model: ServicePriceOption, as: 'priceOptions' }]
    });

    return res.json(services);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const deleteService = async (req, res) => {
  try {
    const { categoryId, serviceId } = req.params;
    const service = await Service.findOne({ where: { id: serviceId, categoryId } });
    if (!service) return res.status(404).json({ message: 'Service not found in category' });
    await service.destroy();
    return res.json({ message: 'Service deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateService = async (req, res) => {
  try {
    const { categoryId, serviceId } = req.params;
    const { name, type, priceOptions } = req.body;

    const service = await Service.findOne({
      where: { id: serviceId, categoryId },
      include: [{ model: ServicePriceOption, as: 'priceOptions' }]
    });
    if (!service) return res.status(404).json({ message: 'Service not found in category' });

    if (name) service.name = name;
    if (type) {
      if (!['Normal', 'VIP'].includes(type)) return res.status(400).json({ message: 'Invalid service type' });
      service.type = type;
    }
    await service.save();

    // priceOptions array supports create (no id), update (id + fields), delete (id + _action: 'delete')
    if (Array.isArray(priceOptions)) {
      for (const po of priceOptions) {
        if (po.id) {
          const existing = await ServicePriceOption.findOne({ where: { id: po.id, serviceId: service.id } });
          if (!existing) continue;
          if (po._action === 'delete') {
            await existing.destroy();
            continue;
          }
          // update allowed fields
          if (po.duration) existing.duration = po.duration;
          if (po.price) existing.price = po.price;
          if (po.type && ['Hourly', 'Weekly', 'Monthly'].includes(po.type)) existing.type = po.type;
          await existing.save();
        } else {
          // create new
          if (!po.duration || !po.price || !po.type) continue;
          if (!['Hourly', 'Weekly', 'Monthly'].includes(po.type)) continue;
          await ServicePriceOption.create({ serviceId: service.id, duration: po.duration, price: po.price, type: po.type });
        }
      }
    }

    const updated = await Service.findByPk(service.id, { include: [{ model: ServicePriceOption, as: 'priceOptions' }] });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createService: addService,
  getAllServices: listServicesInCategory,
  getServiceById: listServicesInCategory, // optional if you add single fetch later
  deleteService,
  updateService
};
