

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
