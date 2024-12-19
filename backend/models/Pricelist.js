const mongoose = require('mongoose');

const pricelistSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' }, // Manager who created the pricelist
}, { timestamps: true });

const Pricelist = mongoose.model('Pricelist', pricelistSchema);
module.exports = Pricelist;