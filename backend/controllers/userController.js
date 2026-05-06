const User = require("../models/User");
const bcrypt = require("bcryptjs");

// CREATE USER
exports.createUser = async (req, res) => {

  try {
    // console.log("BODY:", req.body); // debug

    if (!req.body) {
      return res.status(400).json({ message: "No data sent" });
    }

    const { name, email, password } = req.body;

    // validate
    if (!email || !password) {
      return res.status(400).json({
        message: "Email & password required"
      });
    }

    // check duplicate
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed
    });

    await user.save();

    res.json({
      message: "User created",
      user
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET ALL USERS
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};


// UPDATE USER
exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: "after" }
  );
  res.json(user);
};


// DELETE USER
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};