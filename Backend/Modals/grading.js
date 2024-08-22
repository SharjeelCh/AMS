const mongoose = require("mongoose");

const GradingCriteriaSchema = new mongoose.Schema({
 threshold: {
  type: String,
  required: true,
 },
 grade: {
  type: String,
  required: true,
 },
});

const GradingCriteria = mongoose.model(
 "GradingCriteria",
 GradingCriteriaSchema
);

module.exports = GradingCriteria;
