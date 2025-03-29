// routes/contactRoutes.js
import express from "express";
import { createContactMessage } from "../controllers/contactController.js";
// Optional: Import admin verification middleware if needed for management routes
// import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// POST /api/contact - Submit a new contact message (public)
router.post("/", createContactMessage);

// Optional: Routes for admin to manage messages (protected)
// router.get('/', verifyAdmin, getAllMessages);
// router.patch('/:id/read', verifyAdmin, markMessageAsRead);
// router.delete('/:id', verifyAdmin, deleteMessage);

export default router;
