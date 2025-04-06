import Booking from "../models/booking.js";
import User from "../models/user.js";
import moment from "moment";

export const getDriverBookings = async (req, res) => {
  const driverId = req.userId;

  try {
    const bookings = await Booking.find({
      driverId: driverId,
      bookingStatus: { $in: ["confirmed", "picked_up", "en_route"] },
    })
      .populate("vehicleId", "brand model type image")
      .populate("userId", "username email phone")
      .sort({ pickupDate: 1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching driver bookings:", error);
    res.status(500).json({
      error: "Server error fetching assigned bookings.",
      details: error.message,
    });
  }
};

export const driverUpdateBookingStatus = async (req, res) => {
  const driverId = req.userId;
  const bookingId = req.params.id;
  const { status } = req.body;

  const allowedStatuses = ["picked_up", "en_route", "completed", "cancelled"];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status provided. Allowed: ${allowedStatuses.join(", ")}`,
    });
  }

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    if (booking.driverId?.toString() !== driverId) {
      console.warn(
        `Driver ${driverId} attempted to update booking ${bookingId} not assigned to them.`
      );
      return res
        .status(403)
        .json({ error: "Forbidden: You are not assigned to this booking." });
    }

    booking.bookingStatus = status;
    await booking.save();

    res
      .status(200)
      .json({ message: `Booking status updated to ${status}`, booking });
  } catch (error) {
    console.error(
      `Error updating booking status by driver ${driverId}:`,
      error
    );
    if (error.name === "CastError") {
      // Handle invalid bookingId format
      return res.status(400).json({ error: "Invalid booking ID format." });
    }
    res.status(500).json({
      error: "Server error updating booking status.",
      details: error.message,
    });
  }
};

export const getDriverProfile = async (req, res) => {
  const driverId = req.userId;
  try {
    const driver = await User.findById(driverId, "-password");
    if (!driver || driver.role !== "driver") {
      return res.status(404).json({ error: "Driver profile not found." });
    }
    res.status(200).json(driver);
  } catch (error) {
    console.error("Error fetching driver profile:", error);
    res.status(500).json({
      error: "Server error fetching profile.",
      details: error.message,
    });
  }
};
