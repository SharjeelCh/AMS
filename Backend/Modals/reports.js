const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
 {
  id: {
   type: mongoose.Schema.Types.ObjectId,
   required: true,
  },
  name: {
   type: String,
   required: true,
  },
  daysPresent: {
   type: Number,
   default: 0,
  },
  daysAbsent: {
   type: Number,
   default: 0,
  },
  percentage: {
   type: Number,
   default: 0,
  },
  state: {
   type: String,
   default: "Approved",
  },
 },
 {
  timestamps: true,
 }
);

module.exports = mongoose.model("Report", reportSchema);
