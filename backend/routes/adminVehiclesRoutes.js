// routes/admin/vehicleAdminRoutes.js
import express from "express";
import { adminGetAllVehicles } from "../controllers/adminVehicleController.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/vehicles", verifyAdmin, adminGetAllVehicles);

export default router;
