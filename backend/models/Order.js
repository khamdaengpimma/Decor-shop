const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  total: Number,
  address: String,
  phone: String, 
  email: String,
  name: String,
  status: {
    type: String,
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);