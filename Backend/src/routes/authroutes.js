import express from "express";
import passport from "passport";
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  completeOnboarding,
} from "../controllers/auth.controller.js";
import { exchangeOAuthToken } from "../controllers/oauth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authRateLimiter } from "../middleware/security.middleware.js";
import {
  validate,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  oauthTokenSchema,
} from "../middleware/validation.schemas.js";

/**
 * Auth Routes
 *
 * Public routes:
 * - POST /api/auth/register - Email registration
 * - POST /api/auth/login - Email login
 * - POST /api/auth/oauth/token - Exchange OAuth token (for frontend OAuth)
 *
 * NOTE: Google OAuth routes are now at /auth/* (not /api/auth/*)
 * See oauthRoutes.js for:
 * - GET /auth/google - Start Google OAuth
 * - GET /auth/google/callback - Google OAuth callback
 *
 * Protected routes:
 * - GET /api/auth/me - Get current user
 * - PUT /api/auth/profile - Update profile
 * - PUT /api/auth/password - Change password
 */

const router = express.Router();

// ========================
// LOCAL AUTH ROUTES (with rate limiting)
// ========================

router.post("/register", authRateLimiter, validate(registerSchema), register);

router.post("/login", authRateLimiter, validate(loginSchema), login);

// ========================
// OAUTH TOKEN EXCHANGE
// ========================
// NOTE: Google OAuth browser redirects are at /auth/* (see oauthRoutes.js)
// This route is for frontend-initiated token exchange only

/**
 * @route   POST /api/auth/oauth/token
 * @desc    Exchange frontend OAuth token for JWT
 * @access  Public
 *
 * Use this for:
 * - Google One Tap sign-in
 * - Frontend-initiated OAuth popup
 */
router.post(
  "/oauth/token",
  authRateLimiter,
  validate(oauthTokenSchema),
  exchangeOAuthToken
);

// ========================
// PROTECTED ROUTES
// ========================

router.get("/me", protect, getMe);
router.put("/profile", protect, validate(updateProfileSchema), updateProfile);
router.put(
  "/password",
  protect,
  validate(changePasswordSchema),
  changePassword
);
router.put("/onboarding/complete", protect, completeOnboarding);

export default router;
