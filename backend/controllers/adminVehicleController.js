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
    res
      .status(500)
      .json({
        error: "Server error fetching vehicles.",
        details: error.message,
      });
  }
};