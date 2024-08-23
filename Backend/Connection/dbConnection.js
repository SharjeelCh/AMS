const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
 try {
  await mongoose.connect(process.env.CONNECTION_STRING);
 } catch (err) {
  console.error("Error connecting to MongoDB:", err.message);
  process.exit(1);
 }
};

module.exports = connectDB;
