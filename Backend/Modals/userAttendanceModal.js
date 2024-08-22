const mongoose = require("mongoose");
const attendaceSchema = mongoose.Schema({
 user_id: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
 },
 username: {
  type: String,
  required: [true, "Please provide username"],
 },
 percentage: {
  type: Number,
  default: 0,
 },
 attendance: [
  {
   date: {
    type: Date,
    default: Date.now,
   },
   status: {
    type: String,
    enum: ["Present", "Absent", "Leave"],
    default: "Absent",
   },
   reason: {
    type: String,
    default: "",
   },
   state: {
    type: String,
    default: "Approved",
   },
  },
 ],
});

module.exports = mongoose.model("Attendance", attendaceSchema);
