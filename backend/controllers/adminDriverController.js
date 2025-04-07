import User from "../models/user.js";
import Booking from "../models/booking.js";
import moment from "moment";
import bcrypt from "bcryptjs";

export const getAvailableDrivers = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "Start date and end date are required." });
  }

  const requestedStart = moment(startDate).startOf("day");
  const requestedEnd = moment(endDate).endOf("day");

  if (
    !requestedStart.isValid() ||
    !requestedEnd.isValid() ||
    requestedEnd.isBefore(requestedStart)
  ) {
    return res.status(400).json({ error: "Invalid date format or range." });
  }

  try {
    const allDrivers = await User.find({ role: "driver" }, "username _id");

    const conflictingBookings = await Booking.find({
      driverId: { $ne: null },
      bookingStatus: { $in: ["confirmed", "picked_up", "en_route"] },
      pickupDate: { $lt: requestedEnd.toDate() },
      returnDate: { $gt: requestedStart.toDate() },
    }).select("driverId pickupDate returnDate");

    const busyDriverIds = new Set();
    conflictingBookings.forEach((booking) => {
      const bookingStart = moment(booking.pickupDate);
      const bookingEnd = moment(booking.returnDate);
      if (
        requestedStart.isBefore(bookingEnd) &&
        requestedEnd.isAfter(bookingStart)
      ) {
        if (booking.driverId) {
          busyDriverIds.add(booking.driverId.toString());
        }
      }
    });

    const availableDrivers = allDrivers.filter(
      (driver) => !busyDriverIds.has(driver._id.toString())
    );

    res.status(200).json(availableDrivers);
  } catch (error) {
    console.error("Error fetching available drivers:", error);
    res.status(500).json({
      error: "Server error fetching available drivers.",
      details: error.message,
    });
  }
};

export const adminGetAllDrivers = async (req, res) => {
  console.log("Attempting to fetch all drivers (Admin)...");
  try {
    const drivers = await User.find({ role: "driver" }, "-password").sort({
      createdAt: -1,
    });
    console.log(`Found ${drivers.length} drivers.`);
    res.status(200).json(drivers);
  } catch (error) {
    console.error("Admin Get All Drivers Error:", error);
    res.status(500).json({ error: "Server error fetching drivers." });
  }
};

export const adminGetDriverById = async (req, res) => {
  try {
    const driver = await User.findOne(
      { _id: req.params.id, role: "driver" },
      "-password"
    );
    if (!driver) {
      return res.status(404).json({ error: "Driver not found." });
    }
    res.status(200).json(driver);
  } catch (error) {
    console.error(`Error fetching driver ${req.params.id}:`, error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid Driver ID format." });
    }
    res
      .status(500)
      .json({ error: "Server error fetching driver.", details: error.message });
  }
};

export const adminUpdateDriver = async (req, res) => {
  const driverId = req.params.id;
  const updateData = req.body;
  console.log(`Attempting to update driver ${driverId} (Admin)...`);

  if (updateData.password && updateData.password.length > 0) {
    if (updateData.password.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters long." });
    }
    console.log(`Hashing new password for driver ${driverId}`);
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  } else {
    delete updateData.password;
  }

  try {
    const updatedDriver = await User.findByIdAndUpdate(driverId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedDriver || updatedDriver.role !== "driver") {
      return res.status(404).json({ error: "Driver not found." });
    }

    console.log("Driver updated successfully:", updatedDriver._id);
    res.status(200).json(updatedDriver);
  } catch (error) {
    console.error(`Error updating driver ${driverId}:`, error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid Driver ID format." });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Driver validation failed.",
        details: Object.values(error.errors).map((e) => e.message),
      });
    }
    res
      .status(500)
      .json({ error: "Server error updating driver.", details: error.message });
  }
};

export const adminDeleteDriver = async (req, res) => {
  const driverId = req.params.id;
  console.log(`Attempting to delete driver ${driverId} (Admin)...`);
  try {
    const upcomingBookings = await Booking.countDocuments({
      driverId: driverId,
      bookingStatus: { $in: ["confirmed", "picked_up", "en_route"] },
    });

    if (upcomingBookings > 0) {
      console.warn(
        `Attempted to delete driver ${driverId} with ${upcomingBookings} active/upcoming bookings.`
      );
      return res.status(400).json({
        error:
          "Cannot delete driver with active or upcoming bookings. Please reassign or cancel bookings first.",
      });
    }

    const deletedDriver = await User.findOneAndDelete({
      _id: driverId,
      role: "driver",
    });

    if (!deletedDriver) {
      return res.status(404).json({ error: "Driver not found." });
    }
    console.log("Driver deleted successfully:", driverId);

    res.status(200).json({ message: "Driver deleted successfully." });
  } catch (error) {
    console.error(`Error deleting driver ${driverId}:`, error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid Driver ID format." });
    }
    res
      .status(500)
      .json({ error: "Server error deleting driver.", details: error.message });
  }
};
