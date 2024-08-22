const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
 {
  name: {
   type: String,
   required: [true, "Name is required"],
  },
  email: {
   type: String,
   required: [true, "Email is required"],
   unique: [true, "Email already exists"],
  },
  password: {
   type: String,
   required: [true, "Password is required"],
  },
  isAdmin: {
   type: Boolean,
   required: [true, "Admin is required"],
   default: false,
  },
 },
 {
  timestamps: true,
 }
);

module.exports = mongoose.model("Admin", adminSchema);
