import express from "express";
import passport from "passport";
import {
  googleCallback,
  oauthFailure,
} from "../controllers/oauth.controller.js";

/**
 * OAuth Routes (mounted at /auth, NOT /api/auth)
 *
 * These routes handle browser redirects for OAuth flows.
 * They MUST be at /auth/* (not /api/auth/*) because:
 * 1. Google OAuth callback URL must match exactly
 * 2. Browser redirects don't need /api prefix
 * 3. Cleaner separation from JSON API endpoints
 *
 * Routes:
 * - GET /auth/google - Start Google OAuth flow
 * - GET /auth/google/callback - Google OAuth callback (Google redirects here)
 * - GET /auth/google/failure - Handle OAuth failure
 */

const router = express.Router();

// Frontend URL for error redirects
const FRONTEND_URL = process.env.CORS_ORIGIN || "http://localhost:5173";

/**
 * @route   GET /auth/google
 * @desc    Start Google OAuth flow
 * @access  Public
 * @note    No rate limiting - OAuth involves redirects and retries
 */
router.get("/google", (req, res, next) => {
  try {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account", // Always show account picker
    })(req, res, next);
  } catch (err) {
    console.error("Google OAuth initiation error:", err);
    return res.redirect(`${FRONTEND_URL}/signin?error=oauth_init_failed`);
  }
});

/**
 * @route   GET /auth/google/callback
 * @desc    Google OAuth callback handler
 * @access  Public (Google redirects here)
 * @note    Uses session for OAuth handshake, then destroys it after issuing JWT
 */
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", {
      failureRedirect: "/auth/google/failure",
      session: false,
    })(req, res, (err) => {
      if (err) {
        console.error("Google OAuth authentication error:", err);
        return res.redirect(`${FRONTEND_URL}/signin?error=oauth_auth_failed`);
      }
      next();
    });
  },
  async (req, res) => {
    try {
      // Call the controller with error boundary
      await googleCallback(req, res);
    } catch (err) {
      console.error("Google OAuth callback error:", err);
      return res.redirect(`${FRONTEND_URL}/signin?error=oauth_callback_failed`);
    }
  }
);

/**
 * @route   GET /auth/google/failure
 * @desc    Handle OAuth failure
 * @access  Public
 */
router.get("/google/failure", oauthFailure);

export default router;
