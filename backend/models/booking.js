import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
  },
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  startDate: Date,
  endDate: Date,
  numberOfTourists: Number,
  specialRequests: String,
  status: String,
});

export default mongoose.model("Booking", bookingSchema);