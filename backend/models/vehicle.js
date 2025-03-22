import mongoose from "mongoose";

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

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
