import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.post("/users", userController.createUser);
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
router.post("/users/login", userController.loginUser);

export default router;
