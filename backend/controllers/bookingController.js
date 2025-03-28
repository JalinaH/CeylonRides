import Booking from "../models/booking.js";
import moment from "moment";
import Vehicle from "../models/vehicle.js"; 

export const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    console.log("Received booking data:", bookingData); // Keep for debugging

    if (
      !bookingData.vehicleId ||
      !bookingData.pickupDate ||
      !bookingData.returnDate /* ... add other checks ... */
    ) {
      console.error("Validation Error: Missing required fields");
      return res
        .status(400)
        .json({ error: "Missing required booking information." });
    }

    // Use moment for date parsing and validation
    const startDate = moment(
      `${bookingData.pickupDate} ${bookingData.pickupTime || "00:00"}`
    );
    const endDate = moment(
      `${bookingData.returnDate} ${bookingData.returnTime || "23:59"}`
    );
    console.log(
      "Parsed Start:",
      startDate.toISOString(),
      "Valid:",
      startDate.isValid()
    );
    console.log(
      "Parsed End:",
      endDate.toISOString(),
      "Valid:",
      endDate.isValid()
    );

    if (
      !startDate.isValid() ||
      !endDate.isValid() ||
      endDate.isSameOrBefore(startDate)
    ) {
      // Use isSameOrBefore for stricter check
      console.error("Validation Error: Invalid booking dates.");
      return res
        .status(400)
        .json({ error: "Invalid or out-of-order booking dates/times." });
    }

    // --- Check Vehicle Availability (CRITICAL!) ---
    // Use the Capitalized Model 'Vehicle' here
    const vehicleDoc = await Vehicle.findById(bookingData.vehicleId); // <-- Use Vehicle, assign to different variable name
    console.log("Found Vehicle:", vehicleDoc ? vehicleDoc._id : "Not Found");

    if (!vehicleDoc) {
      // Check the result variable
      return res.status(404).json({ error: "Vehicle not found." });
    }

    // Ensure vehicleDoc.bookings is an array before using .some()
    const existingBookings = vehicleDoc.bookings || [];
    console.log("Checking availability against:", existingBookings);

    const isAvailable = !existingBookings.some((booking) => {
      // Robust check for valid dates within the bookings array
      if (!booking || !booking.startDate || !booking.endDate) {
        console.warn("Skipping invalid booking record in vehicle:", booking);
        return false; // Ignore invalid booking records in the vehicle doc
      }
      const bookingStart = moment(booking.startDate);
      const bookingEnd = moment(booking.endDate);

      // Log comparison details if needed
      // console.log(`Comparing Req:[${startDate.toISOString()}-${endDate.toISOString()}] vs Booked:[${bookingStart.toISOString()}-${bookingEnd.toISOString()}]`);

      // Overlap check: requested start is strictly before booking end AND requested end is strictly after booking start
      return startDate.isBefore(bookingEnd) && endDate.isAfter(bookingStart);
    });

    console.log("Is Available:", isAvailable);

    if (!isAvailable) {
      return res
        .status(409)
        .json({ error: "Vehicle is not available for the selected dates." }); // 409 Conflict
    }

    // --- Create Booking ---
    // Ensure dates are correctly formatted if schema expects Date type
    const bookingPayload = {
      ...bookingData,
      pickupDate: startDate.toDate(), // Convert moment object to JS Date for saving
      returnDate: endDate.toDate(), // Convert moment object to JS Date for saving
    };
    const newBooking = new Booking(bookingPayload);
    console.log("Attempting to save booking:", newBooking);
    const savedBooking = await newBooking.save();
    console.log("Booking saved successfully:", savedBooking._id);

    // --- Update Vehicle's Bookings Array ---
    vehicleDoc.bookings.push({
      // Use vehicleDoc here
      startDate: startDate.toDate(), // Store as Date object
      endDate: endDate.toDate(), // Store as Date object
      // Optionally add booking ID reference: bookingRef: savedBooking._id
    });
    console.log("Attempting to update vehicle bookings array");
    await vehicleDoc.save(); // Use vehicleDoc here
    console.log("Vehicle bookings updated successfully");

    res.status(201).json(savedBooking); // Return the created booking
  } catch (error) {
    console.error("--- ERROR IN CREATE BOOKING ---:", error); // Log the full error object
    // Mongoose validation error
    if (error.name === "ValidationError") {
      // Log specific validation errors
      console.error("Validation Errors:", error.errors);
      return res.status(400).json({
        error: "Booking validation failed.",
        details: Object.values(error.errors).map((e) => e.message), // Extract messages
      });
    }
    // Default server error
    res.status(500).json({
      error: "Server error while creating booking.",
      details: error.message, // Send back the specific error message
    });
  }
};

export const getUserBookings = async (req, res) => {
  // We get the userId from the authenticated request (added by middleware later)
  const userId = req.userId; // Assumes authentication middleware adds userId to req

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User ID not found." });
  }

  try {
    // Find bookings where the userId matches
    // Sort by pickupDate descending (most recent first) - adjust as needed
    const bookings = await Booking.find({ userId: userId }).sort({
      pickupDate: -1,
    });

    if (!bookings) {
      // This case might not happen with find, it would return []
      // but good practice to handle potentially null/undefined results
      return res
        .status(404)
        .json({ error: "No bookings found for this user." });
    }

    res.status(200).json(bookings); // Send the array of bookings
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      error: "Server error while fetching bookings.",
      details: error.message,
    });
  }
};