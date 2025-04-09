import express from "express";
import {
  adminGetAllBookings,
  adminUpdateBooking,
} from "../controllers/admin/adminBookingController.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/bookings", verifyAdmin, adminGetAllBookings);
router.patch("/bookings/:id", verifyAdmin, adminUpdateBooking);

export default router;
