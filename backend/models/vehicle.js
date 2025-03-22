const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  type: String,
  brand: String,
  model: String,
  seatingCapacity: Number,
  features: [String],
  pricingDetails: {
    perDay: Number,
    perHour: Number,
  },
  availabilityStatus: Boolean,
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
