import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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
    pickupTime: { type: String, required: true }, // Store as string HH:MM
    returnDate: { type: Date, required: true },
    returnTime: { type: String, required: true }, // Store as string HH:MM
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
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    vehicleBrand: String, // Denormalized for easy display
    vehicleModel: String, // Denormalized for easy display
  },
  { timestamps: true }
); // Adds createdAt and updatedAt

export default mongoose.model("Booking", bookingSchema);
