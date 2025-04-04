import express from "express";
import { verifyAdmin } from "../utils/verifyToken.js";
import { adminGetAllUsers } from "../controllers/adminUserController.js";

const router = express.Router();

router.get("/users", verifyAdmin, adminGetAllUsers);

export default router;
