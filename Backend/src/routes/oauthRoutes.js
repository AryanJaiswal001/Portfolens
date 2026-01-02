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
 * IMPORTANT: This is JWT-only - no express-session dependency.
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
 * @note    session: false - we don't use sessions, only JWT
 */
router.get("/google", (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    session: false, // No session - JWT only
  })(req, res, next);
});

/**
 * @route   GET /auth/google/callback
 * @desc    Google OAuth callback handler
 * @access  Public (Google redirects here)
 * @note    JWT-only - no session, user is passed directly from passport
 */
router.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    {
      session: false, // No session - JWT only
      failureRedirect: "/auth/google/failure",
    },
    async (err, user, info) => {
      // Handle authentication errors
      if (err) {
        console.error("Google OAuth authentication error:", err);
        return res.redirect(`${FRONTEND_URL}/signin?error=oauth_auth_failed`);
      }

      // Handle no user (authentication failed)
      if (!user) {
        console.error("Google OAuth: No user returned", info);
        return res.redirect(`${FRONTEND_URL}/signin?error=oauth_no_user`);
      }

      try {
        // Pass user directly to controller - no req.user dependency
        await googleCallback(req, res, user);
      } catch (callbackErr) {
        console.error("Google OAuth callback error:", callbackErr);
        return res.redirect(
          `${FRONTEND_URL}/signin?error=oauth_callback_failed`
        );
      }
    }
  )(req, res, next);
});

/**
 * @route   GET /auth/google/failure
 * @desc    Handle OAuth failure
 * @access  Public
 */
router.get("/google/failure", oauthFailure);

export default router;
