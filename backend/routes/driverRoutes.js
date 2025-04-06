import express from "express";
import {
  getDriverBookings,
  driverUpdateBookingStatus,
  getDriverProfile,
} from "../controllers/driverController.js";
import { verifyDriver } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/my-bookings", verifyDriver, getDriverBookings);

router.patch("/bookings/:id/status", verifyDriver, driverUpdateBookingStatus);

router.get("/profile", verifyDriver, getDriverProfile);

export default router;
