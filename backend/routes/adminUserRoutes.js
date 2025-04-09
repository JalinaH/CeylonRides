import express from "express";
import { verifyAdmin } from "../utils/verifyToken.js";
import { adminGetAllUsers } from "../controllers/admin/adminUserController.js";

const router = express.Router();

router.get("/users", verifyAdmin, adminGetAllUsers);

export default router;
