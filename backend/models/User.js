const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: { 
    type: String, 
    required: true 
  },

  role: {
    type: String,
    enum: ["admin", "seller", "user"],
    default: "user"
  },

  status: {
    type: String,
    enum: ["active", "inactive", "banned"],
    default: "active"
  }

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);