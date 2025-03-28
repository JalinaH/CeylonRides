// routes/bookingRoutes.js
import express from "express";
import {
  createBooking, /*, other booking controllers */
  getUserBookings,
} from "../controllers/bookingController.js";
import { verifyToken } from "../utils/verifyToken.js";
// Add authentication middleware if needed: import { verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

// Apply auth middleware if users must be logged in to book:
// router.post('/', verifyUser, createBooking);
router.post("/", verifyToken, createBooking); // If booking is open to anyone
router.get("/my-bookings", verifyToken, getUserBookings);

// Add routes for getting/updating bookings later
// router.get('/', ...);
// router.get('/:id', ...);
// router.patch('/:id/status', ...); // For admin to confirm/cancel

export default router;
