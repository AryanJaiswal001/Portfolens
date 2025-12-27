import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

/**
 * OAuth Controller
 *
 * Handles OAuth callbacks and token generation
 */

// Frontend URL for redirects
const FRONTEND_URL = process.env.CORS_ORIGIN || "http://localhost:5173";

/**
 * @desc    Handle Google OAuth callback
 * @route   GET /api/auth/google/callback
 * @access  Public (Google redirects here)
 */
export const googleCallback = async (req, res) => {
  try {
    // req.user is set by Passport after successful authentication
    const user = req.user;

    if (!user) {
      return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Redirect to frontend with token
    // Frontend will extract token from URL and store it
    res.redirect(`${FRONTEND_URL}/oauth/callback?token=${token}`);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(`${FRONTEND_URL}/login?error=oauth_error`);
  }
};

/**
 * @desc    Handle OAuth failure
 * @route   GET /api/auth/google/failure
 * @access  Public
 */
export const oauthFailure = (req, res) => {
  res.redirect(`${FRONTEND_URL}/login?error=oauth_denied`);
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
