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

export const getAvailableVehicles = async (req, res) => {
  try {
    const { pickupDate, returnDate, vehicleType } = req.query;

    const query = {};

    if (vehicleType && vehicleType !== "Any Vehicle") {
      query.type = vehicleType;
    }

    const vehicles = await Vehicle.find(query);

    const availableVehicles = vehicles.filter((vehicle) => {
      const isAvailable = vehicle.bookings.every((booking) => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);
        const selectedStart = new Date(pickupDate);
        const selectedEnd = new Date(returnDate);

        return selectedEnd < bookingStart || selectedStart > bookingEnd;
      });

      return isAvailable;
    });

    res.status(200).json(availableVehicles);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching available vehicles" });
  }
};
