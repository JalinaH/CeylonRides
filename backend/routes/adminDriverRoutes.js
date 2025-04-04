import express from "express";
import { getAvailableDrivers } from "../controllers/adminDriverController.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/drivers/available", verifyAdmin, getAvailableDrivers);

export default router;
