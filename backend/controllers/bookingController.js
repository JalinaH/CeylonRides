import vehicle from "../models/vehicle.js";
import Booking from "../models/booking.js";

export const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    // --- Server-Side Validation (Essential!) ---
    if (
      !bookingData.vehicleId ||
      !bookingData.pickupDate ||
      !bookingData.returnDate /* ... add all required fields */
    ) {
      return res
        .status(400)
        .json({ error: "Missing required booking information." });
    }

    const startDate = moment(
      `${bookingData.pickupDate} ${bookingData.pickupTime || "00:00"}`
    );
    const endDate = moment(
      `${bookingData.returnDate} ${bookingData.returnTime || "23:59"}`
    );

    if (
      !startDate.isValid() ||
      !endDate.isValid() ||
      endDate.isBefore(startDate)
    ) {
      return res.status(400).json({ error: "Invalid booking dates." });
    }

    // --- Check Vehicle Availability (CRITICAL!) ---
    const vehicle = await vehicle.findById(bookingData.vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found." });
    }

    const isAvailable = !vehicle.bookings.some((booking) => {
      const bookingStart = moment(booking.startDate); // Assuming stored as full Date objects
      const bookingEnd = moment(booking.endDate);
      return startDate.isBefore(bookingEnd) && endDate.isAfter(bookingStart);
    });

    if (!isAvailable) {
      return res
        .status(409)
        .json({ error: "Vehicle is not available for the selected dates." }); // 409 Conflict
    }

    // --- Create Booking ---
    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();

    // --- Update Vehicle's Bookings Array ---
    vehicle.bookings.push({
      startDate: startDate.toDate(), // Store as Date object
      endDate: endDate.toDate(), // Store as Date object
    });
    await vehicle.save();

    res.status(201).json(savedBooking); // Return the created booking
  } catch (error) {
    console.error("Error creating booking:", error);
    // Mongoose validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res
      .status(500)
      .json({
        error: "Server error while creating booking.",
        details: error.message,
      });
  }
};

// Add other controller functions (get bookings, get single booking, update status etc.) later
// export const getAllBookings = ...
// export const getBookingById = ...
// export const updateBookingStatus = ...
