import express from "express";
import * as driverController from "../controllers/driverController.js";

const router = express.Router();

router.post("/drivers", driverController.createDriver);
router.get("/drivers", driverController.getAllDrivers);
router.get("/drivers/:id", driverController.getDriverById);
router.put("/drivers/:id", driverController.updateDriver);
router.delete("/drivers/:id", driverController.deleteDriver);

export default router;
