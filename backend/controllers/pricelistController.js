const Pricelist = require('../models/Pricelist'); // Import the Pricelist model
const AppError = require('../utils/AppError');

// Get all pricelists
exports.getAllPricelists = async (req, res, next) => {
    try {
        const pricelists = await Pricelist.find().populate('createdBy'); // Populate createdBy field
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
            createdBy: req.user._id, // Set the creator to the authenticated user
        });
        res.status(201).json(newItem);
    } catch (error) {
        return next(new AppError('Error creating pricelist item', 500));
    }
};