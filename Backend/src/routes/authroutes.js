import express from "express";
import passport from "passport";
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";
import {
  googleCallback,
  oauthFailure,
  exchangeOAuthToken,
} from "../controllers/oauth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

/**
 * Auth Routes
 *
 * Public routes:
 * - POST /api/auth/register - Email registration
 * - POST /api/auth/login - Email login
 * - GET /api/auth/google - Start Google OAuth
 * - GET /api/auth/google/callback - Google OAuth callback
 * - POST /api/auth/oauth/token - Exchange OAuth token (for frontend OAuth)
 *
 * Protected routes:
 * - GET /api/auth/me - Get current user
 * - PUT /api/auth/profile - Update profile
 * - PUT /api/auth/password - Change password
 */

const router = express.Router();

// ========================
// LOCAL AUTH ROUTES
// ========================

router.post("/register", register);
router.post("/login", login);

// ========================
// GOOGLE OAUTH ROUTES
// ========================

/**
 * @route   GET /api/auth/google
 * @desc    Start Google OAuth flow
 * @access  Public
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", // Always show account picker
  })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback handler
 * @access  Public (Google redirects here)
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/google/failure",
  }),
  googleCallback
);

/**
 * @route   GET /api/auth/google/failure
 * @desc    Handle OAuth failure
 * @access  Public
 */
router.get("/google/failure", oauthFailure);

/**
 * @route   POST /api/auth/oauth/token
 * @desc    Exchange frontend OAuth token for JWT
 * @access  Public
 *
 * Use this for:
 * - Google One Tap sign-in
 * - Frontend-initiated OAuth popup
 */
router.post("/oauth/token", exchangeOAuthToken);

// ========================
// PROTECTED ROUTES
// ========================

router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);

export default router;
