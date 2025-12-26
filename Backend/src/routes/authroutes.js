import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

/**
 * Auth Routes
 *
 * Public routes (no token required):
 * - POST /api/auth/register
 * - POST /api/auth/login
 *
 * Protected routes (token required):
 * - GET /api/auth/me
 * - PUT /api/auth/profile
 * - PUT /api/auth/password
 */

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);

export default router;
