import User from "../../models/user.js";
import Booking from "../../models/booking.js";
import moment from "moment";

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
    res
      .status(500)
      .json({
        error: "Server error fetching available drivers.",
        details: error.message,
      });
  }
};
