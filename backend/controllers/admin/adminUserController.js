import User from "../../models/user.js";
import Vehicle from '../../models/vehicle.js'; 
import Booking from "../../models/booking.js";

export const adminGetAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Admin Get All Users Error:", error);
    res.status(500).json({ error: "Server error fetching users." });
  }
};

export const adminGetAllVehicles = async (req, res) => {
    console.log("Attempting to fetch all vehicles (Admin)...");
    try {
        const vehicles = await Vehicle.find({})
            .sort({ brand: 1, model: 1 });

        console.log(`Found ${vehicles.length} vehicles.`);

         if (!vehicles) {
             console.error("Vehicle.find returned null/undefined unexpectedly.");
             return res.status(500).json({ error: "Unexpected error fetching vehicles." });
         }

        res.status(200).json(vehicles);

    } catch (error) {
        console.error("Error in adminGetAllVehicles controller:", error);
        res.status(500).json({ error: "Server error fetching vehicles.", details: error.message });
    }
};


export const adminGetAllBookings = async (req, res) => {
    console.log("Attempting to fetch all bookings (Admin)...");
    try {
        const bookings = await Booking.find({})
            .populate({
                path: 'userId',
                select: 'username email' 
            })
            .populate({
                path: 'vehicleId',
                select: 'brand model type'
            })
            .sort({ createdAt: -1 }); 

        console.log(`Found ${bookings.length} bookings.`);

        if (!bookings) {
             console.error("Booking.find returned null/undefined unexpectedly.");
             return res.status(500).json({ error: "Unexpected error fetching bookings." });
        }

        res.status(200).json(bookings);

    } catch (error) {
        console.error("Error in adminGetAllBookings controller:", error);
        res.status(500).json({ error: "Server error fetching bookings.", details: error.message });
    }
};
