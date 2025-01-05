const Pricelist = require('../models/Pricelist'); 
const AppError = require('../utils/AppError');

// Get all pricelists
exports.getAllPricelists = async (req, res, next) => {
    try {
        const pricelists = await Pricelist.find().populate('createdBy'); 
        res.status(200).json(pricelists);
    } catch (error) {
        return next(new AppError('Error fetching pricelists', 500));
    }
};

// Create a new pricelist item
exports.createPricelist = async (req, res, next) => {
    try {
        const { itemName, price, description } = req.body;
        const newItem = await Pricelist.create({
            itemName,
            price,
            description,
            createdBy: req.user._id, 
        });
        res.status(201).json(newItem);
    } catch (error) {
        return next(new AppError('Error creating pricelist item', 500));
    }
};

// Create a new work order request from a customer
exports.createWorkOrderRequest = async (req, res, next) => {
    try {
      const { title, description, customerComments, deadline, predefinedServices } = req.body;
      const workOrder = await WorkOrder.create({
        title,
        description,
        customerComments,
        status: 'pending',
        createdBy: req.user._id, 
        deadline,
        predefinedServices,
      });
      res.status(201).json(workOrder);
    } catch (error) {
      return next(new AppError('Error creating work order request', 500));
    }
  };

  // Update a pricelist item
exports.updatePricelist = async (req, res, next) => {
    const { id } = req.params;
    const { itemName, price, description } = req.body;

    try {
        const updatedItem = await Pricelist.findByIdAndUpdate(
            id,
            { itemName, price, description },
            { new: true, runValidators: true } 
        );

        if (!updatedItem) {
            return next(new AppError('Pricelist item not found', 404));
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        return next(new AppError('Error updating pricelist item', 500));
    }
};

// Delete a pricelist item
exports.deletePricelist = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedItem = await Pricelist.findByIdAndDelete(id);
        if (!deletedItem) {
            return next(new AppError('Pricelist item not found', 404));
        }

        res.status(200).json({ message: 'Pricelist item successfully deleted!' });
    } catch (error) {
        return next(new AppError('Error deleting pricelist item', 500));
    }
};