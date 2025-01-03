const mongoose = require("mongoose");

const pricelistSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Pricelist = mongoose.model("Pricelist", pricelistSchema);
module.exports = Pricelist;
