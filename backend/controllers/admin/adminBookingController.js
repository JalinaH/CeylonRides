import Booking from "../../models/booking.js";
import User from "../../models/user.js";

export const adminGetAllBookings = async (req, res) => {
  console.log("Attempting to fetch all bookings (Admin)...");
  try {
    const bookings = await Booking.find({})
      .populate({
        path: "userId",
        select: "username email",
      })
      .populate({
        path: "vehicleId",
        select: "brand model type",
      })
      .populate({
        path: "driverId",
        select: "username",
      })
      .sort({ createdAt: -1 });

    console.log(`Found ${bookings.length} bookings.`);

    if (!bookings) {
      console.error("Booking.find returned null/undefined unexpectedly.");
      return res
        .status(500)
        .json({ error: "Unexpected error fetching bookings." });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error in adminGetAllBookings controller:", error);
    res.status(500).json({
      error: "Server error fetching bookings.",
      details: error.message,
    });
  }
};

export const adminUpdateBooking = async (req, res) => {
  const bookingId = req.params.id;
  const { status, driverId } = req.body;

  if (!status) {
    return res.status(400).json({ error: "New status is required." });
  }

  if (status === "confirmed" && !driverId) {
    const tempBooking = await Booking.findById(bookingId).select(
      "driverOption"
    );
    if (tempBooking && tempBooking.driverOption === "withDriver") {
      console.warn(
        `Attempted to confirm booking ${bookingId} without assigning a driver.`
      );
      return res
        .status(400)
        .json({ error: "Please assign a driver before confirming." });
    }
  }

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    if (driverId) {
      const driver = await User.findOne({ _id: driverId, role: "driver" });
      if (!driver) {
        return res
          .status(400)
          .json({ error: "Invalid Driver ID or user is not a driver." });
      }
      booking.driverId = driverId;
      console.log(`Assigned driver ${driverId} to booking ${bookingId}`);
    } else if (
      status === "confirmed" &&
      booking.driverOption === "withDriver"
    ) {
      return res
        .status(400)
        .json({ error: "Driver ID missing for confirmation." });
    } else {
      if (status === "cancelled" || status === "pending") {
        booking.driverId = null;
      }
    }

    booking.bookingStatus = status;

    if (status === "confirmed" && booking.vehicleId && booking.driverId) {
      console.log(
        `Booking ${bookingId} confirmed. Need to update vehicle ${booking.vehicleId} availability.`
      );
    }

    const updatedBooking = await booking.save();
    console.log(`Booking ${bookingId} updated successfully.`);

    res.status(200).json({
      message: "Booking updated successfully.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(`Admin Update Booking Error for ${bookingId}:`, error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID format." });
    }
    res.status(500).json({
      error: "Server error updating booking.",
      details: error.message,
    });
  }
};
