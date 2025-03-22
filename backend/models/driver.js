const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: String,
  contactInfo: String,
  experience: String,
  drivingLicense: String,
  languageProficiency: [String],
  customerRatings: [
    {
      rating: Number,
      review: String,
    },
  ],
  assignedVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
  },
});

module.exports = mongoose.model("Driver", driverSchema);
