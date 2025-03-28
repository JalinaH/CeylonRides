// routes/vehicleRoutes.js (Correct Order)
import express from "express";
import {
  getAvailableVehicles,
  createVehicle,
  getAllVehicles,
  updateVehicle,
  deleteVehicle,
  getVehicleById,
  getVehicleAvailability,
} from "../controllers/vehicleController.js";

const router = express.Router();

// --- General Vehicle Routes ---
router.post("/vehicles", createVehicle);
router.get("/vehicles", getAllVehicles);

// --- Specific Routes Before Parameterized Routes ---
router.get("/vehicles/available", getAvailableVehicles); // <<< Moved UP: Specific path checked first

// --- Routes with :id Parameter ---
router.get("/vehicles/:id", getVehicleById); // <<< Now checked after /available
router.put("/vehicles/:id", updateVehicle);
router.delete("/vehicles/:id", deleteVehicle);
router.get("/vehicles/:id/availability", getVehicleAvailability); // This is also specific but comes after /:id is okay

export default router;
