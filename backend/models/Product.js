const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  images: [String],
  description: String,
  category: String,
  stock: Number,
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);