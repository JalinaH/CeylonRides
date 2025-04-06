import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    pickupTime: { type: String, required: true },
    returnDate: { type: Date, required: true },
    returnTime: { type: String, required: true },
    pickupPoint: { type: String, required: true },
    returnPoint: { type: String, required: true },
    numTourists: { type: Number, required: true, min: 1 },
    driverOption: {
      type: String,
      enum: ["withDriver", "selfDrive"],
      required: true,
    },
    specialRequests: { type: String, default: "" },
    totalPrice: { type: Number, required: true },
    bookingStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "picked_up",
        "en_route",
      ],
      default: "pending",
    },
    vehicleBrand: String,
    vehicleModel: String,
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
