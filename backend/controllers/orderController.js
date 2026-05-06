const Order = require("../models/Order");

// CREATE
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json(order);
  } catch (err) {
    console.log("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ONE
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id,{returnDocument: "after"});
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
exports.updateOrder = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { returnDocument: "after", runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};