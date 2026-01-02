import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

/**
 * OAuth Controller
 *
 * Handles OAuth callbacks and token generation
 * IMPORTANT: This is JWT-only - no session dependencies
 */

// Frontend URL for redirects
const FRONTEND_URL = process.env.CORS_ORIGIN || "http://localhost:5173";
const NODE_ENV = process.env.NODE_ENV || "development";

// Cookie configuration for cross-site auth (Render backend + Vercel frontend)
const getCookieOptions = () => ({
  httpOnly: true,
  secure: NODE_ENV === "production", // HTTPS only in production
  sameSite: NODE_ENV === "production" ? "none" : "lax", // Cross-site in production
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
});

/**
 * @desc    Handle Google OAuth callback
 * @route   GET /auth/google/callback
 * @access  Public (Google redirects here)
 * @note    JWT-only - no session, no req.user, no req.logout
 *          The user object is passed directly from passport verify callback
 */
export const googleCallback = async (req, res, user) => {
  try {
    // User is passed directly from the route handler (from passport callback)
    if (!user) {
      return res.redirect(`${FRONTEND_URL}/signin?error=oauth_failed`);
    }

    // Generate JWT token using JWT_SECRET
    const token = generateToken(user._id);

    // Set JWT as httpOnly cookie for security
    res.cookie("auth_token", token, getCookieOptions());

    // Redirect to frontend with token in URL
    // Frontend extracts token and stores it
    return res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error("Google callback error:", error);
    return res.redirect(`${FRONTEND_URL}/signin?error=oauth_error`);
  }
};

/**
 * @desc    Handle OAuth failure
 * @route   GET /auth/google/failure
 * @access  Public
 */
export const oauthFailure = (req, res) => {
  return res.redirect(`${FRONTEND_URL}/signin?error=oauth_denied`);
};

/**
 * @desc    Get OAuth user info (for token exchange)
 * @route   POST /api/auth/oauth/token
 * @access  Public
 * @body    { provider: 'google', credential: 'google_id_token' }
 *
 * Alternative flow for frontend-initiated OAuth (e.g., Google One Tap)
 */
export const exchangeOAuthToken = async (req, res) => {
  try {
    const { provider, credential, profile } = req.body;

    if (!provider || !profile) {
      return res.status(400).json({
        success: false,
        message: "Provider and profile are required",
      });
    }

    if (provider !== "google") {
      return res.status(400).json({
        success: false,
        message: "Invalid provider",
      });
    }

    const { id, email, name, picture } = profile;

    if (!email || !id) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile data",
      });
    }

    // Find or create user
    let user = await User.findOne({ provider: "google", providerId: id });

    if (!user) {
      // Check for existing email
      user = await User.findOne({ email: email.toLowerCase() });

      if (user && user.provider === "local") {
        // Link Google to existing local account
        user.provider = "google";
        user.providerId = id;
        user.avatar = picture || user.avatar;
        user.isEmailVerified = true;
        await user.save();
      } else if (!user) {
        // Create new user
        user = await User.create({
          name,
          email: email.toLowerCase(),
          provider: "google",
          providerId: id,
          avatar: picture,
          isEmailVerified: true,
        });
      }
    }

    // Generate JWT
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "OAuth login successful",
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error("OAuth token exchange error:", error);
    res.status(500).json({
      success: false,
      message: "OAuth authentication failed",
    });
  }
};
