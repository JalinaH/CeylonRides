import express from "express";
import { getAvailableDrivers } from "../controllers/adminDriverController.js";
import { adminUpdateBooking } from "../controllers/adminBookingController.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/drivers/available", verifyAdmin, getAvailableDrivers);
router.patch("/bookings/:id", verifyAdmin, adminUpdateBooking);

export default router;
