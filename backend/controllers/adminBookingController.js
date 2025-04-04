import Booking from "../models/booking.js";

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
    res
      .status(500)
      .json({
        error: "Server error fetching bookings.",
        details: error.message,
      });
  }
};
