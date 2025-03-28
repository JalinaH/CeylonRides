// routes/bookingRoutes.js
import express from "express";
import {
  createBooking /*, other booking controllers */,
} from "../controllers/bookingController.js";
// Add authentication middleware if needed: import { verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

// Apply auth middleware if users must be logged in to book:
// router.post('/', verifyUser, createBooking);
router.post("/", createBooking); // If booking is open to anyone

// Add routes for getting/updating bookings later
// router.get('/', ...);
// router.get('/:id', ...);
// router.patch('/:id/status', ...); // For admin to confirm/cancel

export default router;
