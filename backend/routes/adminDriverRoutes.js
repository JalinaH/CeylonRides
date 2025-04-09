import express from "express";
import {
  getAvailableDrivers,
  adminDeleteDriver,
  adminGetAllDrivers,
  adminGetDriverById,
  adminUpdateDriver,
  adminCreateDriver,
} from "../controllers/admin/adminDriverController.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/drivers/available", verifyAdmin, getAvailableDrivers);
router.get("/drivers", verifyAdmin, adminGetAllDrivers);
router.get("/drivers/:id", verifyAdmin, adminGetDriverById);
router.put("/drivers/:id", verifyAdmin, adminUpdateDriver);
router.delete("/drivers/:id", verifyAdmin, adminDeleteDriver);
router.post("/drivers", verifyAdmin, adminCreateDriver);

export default router;
