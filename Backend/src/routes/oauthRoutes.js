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

/**
 * @route   GET /auth/google
 * @desc    Start Google OAuth flow
 * @access  Public
 * @note    No rate limiting - OAuth involves redirects and retries
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", // Always show account picker
  })
);

/**
 * @route   GET /auth/google/callback
 * @desc    Google OAuth callback handler
 * @access  Public (Google redirects here)
 * @note    Uses session for OAuth handshake, then destroys it after issuing JWT
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
  }),
  googleCallback
);

/**
 * @route   GET /auth/google/failure
 * @desc    Handle OAuth failure
 * @access  Public
 */
router.get("/google/failure", oauthFailure);

export default router;
