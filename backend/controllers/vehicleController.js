import Vehicle from "../models/vehicle.js";

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
    // Decode URL parameters
    const pickupDate = decodeURIComponent(req.query.pickupDate);
    const returnDate = decodeURIComponent(req.query.returnDate);
    const vehicleType = req.query.vehicleType 
      ? decodeURIComponent(req.query.vehicleType) 
      : null;

    // Validate dates
    const startDate = new Date(pickupDate);
    const endDate = new Date(returnDate);
    
    if (isNaN(startDate)) {
      return res.status(400).json({ error: "Invalid pickupDate format" });
    }
    if (isNaN(endDate)) {
      return res.status(400).json({ error: "Invalid returnDate format" });
    }
    if (startDate >= endDate) {
      return res.status(400).json({ error: "returnDate must be after pickupDate" });
    }

    // Build query
    const query = {};
    if (vehicleType && vehicleType !== "Any Vehicle") {
      query.type = vehicleType;
    }

    // Find available vehicles
    const vehicles = await Vehicle.find(query);
    
    const availableVehicles = vehicles.filter(vehicle => {
      return !vehicle.bookings.some(booking => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);
        return startDate < bookingEnd && endDate > bookingStart;
      });
    });

    res.json(availableVehicles);
  } catch (error) {
    console.error("Error in getAvailableVehicles:", error);
    res.status(500).json({ 
      error: "Server error",
      details: error.message 
    });
  }
};