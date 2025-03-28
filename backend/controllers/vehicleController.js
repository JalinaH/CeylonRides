import Vehicle from "../models/vehicle.js";
import moment from "moment";

// Create a new vehicle
export const createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all vehicles
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single vehicle by ID
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a vehicle by ID
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a vehicle by ID
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getVehicleAvailability = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Format the bookings for the calendar
    const availability = vehicle.bookings.map((booking) => ({
      start: booking.startDate,
      end: booking.endDate,
      title: "Booked", // Optional: Add a title for the calendar event
    }));

    res.status(200).json(availability);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching availability" });
  }
};


// controllers/vehicleController.js
export const getAvailableVehicles = async (req, res) => {
  try {
    // Decode URL parameters safely, allowing them to be null
    const rawPickupDate = req.query.pickupDate
      ? decodeURIComponent(req.query.pickupDate)
      : null;
    const rawReturnDate = req.query.returnDate
      ? decodeURIComponent(req.query.returnDate)
      : null;
    const vehicleType = req.query.vehicleType
      ? decodeURIComponent(req.query.vehicleType)
      : null;

    let startDate, endDate;
    let areDatesProvidedAndValid = false; // Flag to check if we need to filter by date

    // --- Date Validation ---
    if (rawPickupDate && rawReturnDate) {
      startDate = moment(rawPickupDate); 
      endDate = moment(rawReturnDate);

      // Check if dates are valid Moment objects and in the correct order
      if (
        startDate.isValid() &&
        endDate.isValid() &&
        startDate.isBefore(endDate)
      ) {
        areDatesProvidedAndValid = true;
      } else {
        // Log a warning if dates were provided but invalid/out of order
        console.warn(
          "getAvailableVehicles: Invalid or out-of-order dates provided. Ignoring date filter."
        );
      }
    }

    // --- Build Base Query (for vehicle type) ---
    const query = {};
    if (vehicleType && vehicleType !== "Any Vehicle") {
      query.type = vehicleType;
    }

    // --- Find Vehicles Matching Type (or all if no type) ---
    const vehicles = await Vehicle.find(query);

    // --- Filter by Date Availability (only if valid dates were provided) ---
    const availableVehicles = vehicles.filter((vehicle) => {
      // If valid dates were NOT provided, consider the vehicle available (skip date check)
      if (!areDatesProvidedAndValid) {
        // Optional: You could add another check here if you have a general 'isArchived' or 'maintenance' status
        // return vehicle.isActive === true;
        return true; // Passes the date filter if no dates to check against
      }

      // If valid dates WERE provided, check for booking conflicts
      // Combine date and time for more precise checks if your Vehicle model stores times
      // For simplicity now, assuming bookings are full-day based on startDate/endDate Dates
      return !vehicle.bookings.some((booking) => {
        const bookingStart = moment(booking.startDate).startOf("day"); // Ensure comparison starts at beginning of day
        const bookingEnd = moment(booking.endDate).endOf("day"); // Ensure comparison ends at end of day

        // Check for overlap:
        // Requested start is before booking end AND Requested end is after booking start
        return startDate.isBefore(bookingEnd) && endDate.isAfter(bookingStart);
      });
    });

    res.json(availableVehicles);
  } catch (error) {
    console.error("Error in getAvailableVehicles:", error);
    res.status(500).json({
      error: "Server error while fetching available vehicles",
      details: error.message,
    });
  }
};