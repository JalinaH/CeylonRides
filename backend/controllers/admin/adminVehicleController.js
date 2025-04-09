import Vehicle from "../models/vehicle.js";

export const adminGetAllVehicles = async (req, res) => {
  console.log("Attempting to fetch all vehicles (Admin)...");
  try {
    const vehicles = await Vehicle.find({}).sort({ brand: 1, model: 1 });

    console.log(`Found ${vehicles.length} vehicles.`);

    if (!vehicles) {
      console.error("Vehicle.find returned null/undefined unexpectedly.");
      return res
        .status(500)
        .json({ error: "Unexpected error fetching vehicles." });
    }

    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error in adminGetAllVehicles controller:", error);
    res.status(500).json({
      error: "Server error fetching vehicles.",
      details: error.message,
    });
  }
};

export const adminGetVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found." });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    console.error(`Error fetching vehicle ${req.params.id}:`, error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid Vehicle ID format." });
    }
    res.status(500).json({
      error: "Server error fetching vehicle.",
      details: error.message,
    });
  }
};

export const adminCreateVehicle = async (req, res) => {
  console.log("Attempting to create vehicle (Admin)... Data:", req.body);
  try {
    const newVehicle = new Vehicle(req.body);
    const savedVehicle = await newVehicle.save();
    console.log("Vehicle created successfully:", savedVehicle._id);
    res.status(201).json(savedVehicle);
  } catch (error) {
    console.error("Error creating vehicle:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Vehicle validation failed.",
        details: Object.values(error.errors).map((e) => e.message),
      });
    }
    res.status(500).json({
      error: "Server error creating vehicle.",
      details: error.message,
    });
  }
};

export const adminUpdateVehicle = async (req, res) => {
  const vehicleId = req.params.id;
  console.log(
    `Attempting to update vehicle ${vehicleId} (Admin)... Data:`,
    req.body
  );
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedVehicle) {
      return res.status(404).json({ error: "Vehicle not found." });
    }
    console.log("Vehicle updated successfully:", updatedVehicle._id);
    res.status(200).json(updatedVehicle);
  } catch (error) {
    console.error(`Error updating vehicle ${vehicleId}:`, error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid Vehicle ID format." });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Vehicle validation failed.",
        details: Object.values(error.errors).map((e) => e.message),
      });
    }
    res.status(500).json({
      error: "Server error updating vehicle.",
      details: error.message,
    });
  }
};

export const adminDeleteVehicle = async (req, res) => {
  const vehicleId = req.params.id;
  console.log(`Attempting to delete vehicle ${vehicleId} (Admin)...`);
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(vehicleId);
    if (!deletedVehicle) {
      return res.status(404).json({ error: "Vehicle not found." });
    }
    console.log("Vehicle deleted successfully:", vehicleId);
    res.status(200).json({ message: "Vehicle deleted successfully." });
  } catch (error) {
    console.error(`Error deleting vehicle ${vehicleId}:`, error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid Vehicle ID format." });
    }
    res.status(500).json({
      error: "Server error deleting vehicle.",
      details: error.message,
    });
  }
};
