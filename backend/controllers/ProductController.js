const Product = require("../models/product");

// ================= CREATE =================
exports.createProduct = async (req, res) => {
  try {
    const { name, price, images, description, category, stock } = req.body;

    // validate
    if (!name || !price) {
      return res.status(400).json({
        message: "Name and price are required"
      });
    }

    const product = new Product({
      name,
      price,
      images,
      description,
      category,
      stock
    });

    await product.save();

    res.status(201).json({
      message: "Product created",
      product
    });

  } catch (err) {
    console.log("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= GET ALL =================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json(products);

  } catch (err) {
    console.log("GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= GET ONE =================
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (err) {
    console.log("GET PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= UPDATE =================
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // ✔️ an toàn hơn
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated",
      product
    });

  } catch (err) {
    console.log("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE =================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product deleted"
    });

  } catch (err) {
    console.log("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};