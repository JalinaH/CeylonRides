import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  seatingCapacity: {
    type: Number,
    required: true,
  },
  features: {
    type: [String],
    default: [],
  },
  pricingDetails: {
    perDay: {
      type: Number,
      required: true,
    },
    perHour: {
      type: Number,
      required: true,
    },
  },
  availabilityStatus: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    required: true,
  },
  bookings: [
    {
      startDate: {
        type: Date,
        required: true,
        validate: {
          validator: function (v) {
            return v instanceof Date && !isNaN(v);
          },
          message: "Invalid start date",
        },
      },
      endDate: {
        type: Date,
        required: true,
        validate: {
          validator: function (v) {
            return v instanceof Date && !isNaN(v) && v > this.startDate;
          },
          message: "End date must be after start date",
        },
      },
    },
  ],
});

export default mongoose.model("Vehicle", vehicleSchema);
