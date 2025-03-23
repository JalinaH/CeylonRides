import express from "express";
import * as vehicleController from "../controllers/vehicleController.js";

const router = express.Router();

router.post("/vehicles", vehicleController.createVehicle);
router.get("/vehicles", vehicleController.getAllVehicles);
router.get("/vehicles/:id", vehicleController.getVehicleById);
router.put("/vehicles/:id", vehicleController.updateVehicle);
router.delete("/vehicles/:id", vehicleController.deleteVehicle);
router.get("/vehicles/:id/availability", vehicleController.getVehicleAvailability);

export default router;
