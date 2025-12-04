import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
import {
  signup,
  createWorkerByAdmin,
  createAdmin,
  login,
  logout,
} from "../controllers/auth.controller.js";

const router = express.Router();

// PUBLIC SIGNUP - Citizen only
router.post("/signup", signup);

// ADMIN ONLY - Create Worker
router.post(
  "/create-worker",
  authMiddleware,
  allowRoles("admin"),
  createWorkerByAdmin
);

// ADMIN ONLY - Create Admin
router.post(
  "/create-admin",
  authMiddleware,
  allowRoles("admin"),
  createAdmin
);

// LOGIN
router.post("/login", login);

// LOGOUT
router.post("/logout", logout);

export default router;
