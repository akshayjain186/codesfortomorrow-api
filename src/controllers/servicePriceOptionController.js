const ServicePriceOption = require('../models/ServicePriceOption');

exports.createServicePriceOption = async (req, res) => {
  try {
    const option = await ServicePriceOption.create(req.body);
    res.status(201).json(option);
  } catch (error) {
    console.error('Error creating service price option:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllServicePriceOptions = async (req, res) => {
  try {
    const options = await ServicePriceOption.findAll();
    res.json(options);
  } catch (error) {
    console.error('Error fetching service price options:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getServicePriceOptionById = async (req, res) => {
  try {
    const option = await ServicePriceOption.findByPk(req.params.id);
    if (!option) return res.status(404).json({ message: 'Option not found' });
    res.json(option);
  } catch (error) {
    console.error('Error fetching service price option:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateServicePriceOption = async (req, res) => {
  try {
    const option = await ServicePriceOption.findByPk(req.params.id);
    if (!option) return res.status(404).json({ message: 'Option not found' });

    await option.update(req.body);
    res.json(option);
  } catch (error) {
    console.error('Error updating service price option:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteServicePriceOption = async (req, res) => {
  try {
    const option = await ServicePriceOption.findByPk(req.params.id);
    if (!option) return res.status(404).json({ message: 'Option not found' });

    await option.destroy();
    res.json({ message: 'Option deleted successfully' });
  } catch (error) {
    console.error('Error deleting service price option:', error);
    res.status(500).json({ message: error.message });
  }
};
