import express from "express";
import {
  adminGetAllVehicles,
  adminGetVehicleById,
  adminCreateVehicle,
  adminUpdateVehicle,
  adminDeleteVehicle,
} from "../controllers/admin/adminVehicleController.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/vehicles", verifyAdmin, adminGetAllVehicles);
router.get("/vehicles/:id", verifyAdmin, adminGetVehicleById);
router.post("/vehicles", verifyAdmin, adminCreateVehicle);
router.put("/vehicles/:id", verifyAdmin, adminUpdateVehicle);
router.delete("/vehicles/:id", verifyAdmin, adminDeleteVehicle);

export default router;
