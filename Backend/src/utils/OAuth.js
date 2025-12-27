import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

/**
 * Google OAuth Strategy Configuration
 *
 * Flow:
 * 1. User clicks "Sign in with Google"
 * 2. Redirected to Google consent screen
 * 3. Google returns user profile
 * 4. We find/create user in our DB
 * 5. Generate JWT and redirect to frontend
 */

const configureGoogleStrategy = () => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const GOOGLE_CALLBACK_URL =
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:5000/api/auth/google/callback";

  // Validate credentials exist
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn(
      "⚠️ Google OAuth credentials not configured. Google login will be disabled."
    );
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract user info from Google profile
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;
          const avatar = profile.photos?.[0]?.value;

          if (!email) {
            return done(new Error("No email found in Google profile"), null);
          }

          // Check if user exists with this Google ID
          let user = await User.findOne({
            provider: "google",
            providerId: googleId,
          });

          if (user) {
            // User exists, update last login info
            user.avatar = avatar || user.avatar;
            await user.save();
            return done(null, user);
          }

          // Check if user exists with same email (local account)
          user = await User.findOne({ email: email.toLowerCase() });

          if (user) {
            // Link Google to existing account
            if (user.provider === "local") {
              user.provider = "google";
              user.providerId = googleId;
              user.avatar = avatar || user.avatar;
              user.isEmailVerified = true; // Google emails are verified
              await user.save();
              return done(null, user);
            }
            // User exists with different provider
            return done(null, user);
          }

          // Create new user
          user = await User.create({
            name,
            email: email.toLowerCase(),
            provider: "google",
            providerId: googleId,
            avatar,
            isEmailVerified: true, // Google emails are verified
          });

          return done(null, user);
        } catch (error) {
          console.error("Google OAuth error:", error);
          return done(error, null);
        }
      }
    )
  );

  // Serialize user for session (stores user ID in session)
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user from session (retrieves user from DB)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  console.log("✅ Google OAuth strategy configured");
};

export default configureGoogleStrategy;
