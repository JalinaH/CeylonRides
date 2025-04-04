// routes/admin/bookingAdminRoutes.js
import express from "express";
import { adminGetAllBookings } from "../controllers/adminBookingController.js"; 
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/bookings", verifyAdmin, adminGetAllBookings);

export default router;
