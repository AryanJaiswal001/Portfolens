/**
 * Environment Configuration
 *
 * Validates and exports environment variables
 * Fails fast if required variables are missing
 */

// Required environment variables (support both naming conventions)
const REQUIRED_ENV_VARS = [
  "JWT_SECRET",
  ["MONGO_URI", "MONGODB_URI"], // Accept either
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
];

// Optional but recommended in production
const RECOMMENDED_ENV_VARS = ["CORS_ORIGIN", "NODE_ENV"];

/**
 * Validate environment variables at startup
 * Throws error if required variables are missing
 */
export const validateEnv = () => {
  const missing = [];
  const warnings = [];

  // Check required variables
  for (const envVar of REQUIRED_ENV_VARS) {
    if (Array.isArray(envVar)) {
      // Accept any of the alternatives
      const found = envVar.some((v) => process.env[v]);
      if (!found) {
        missing.push(envVar[0]); // Report first name
      }
    } else if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Check recommended variables
  for (const envVar of RECOMMENDED_ENV_VARS) {
    if (!process.env[envVar]) {
      warnings.push(envVar);
    }
  }

  // Fail if required vars are missing
  if (missing.length > 0) {
    console.error("\n❌ FATAL: Missing required environment variables:");
    missing.forEach((v) => console.error(`   - ${v}`));
    console.error("\nPlease set these variables in your .env file.\n");
    process.exit(1);
  }

  // Warn about missing recommended vars
  if (warnings.length > 0 && process.env.NODE_ENV === "production") {
    console.warn("\n⚠️  Warning: Missing recommended environment variables:");
    warnings.forEach((v) => console.warn(`   - ${v}`));
    console.warn("");
  }

  // Security warnings
  if (process.env.JWT_SECRET === "your-super-secret-jwt-key") {
    console.warn(
      "⚠️  Warning: Using default JWT_SECRET. Set a secure secret in production!"
    );
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn(
      "⚠️  Warning: JWT_SECRET should be at least 32 characters for security."
    );
  }

  return true;
};

/**
 * Get environment configuration object
 */
export const getEnvConfig = () => ({
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGO_URI || process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
  },
});

/**
 * Check if running in production
 */
export const isProduction = () => process.env.NODE_ENV === "production";

/**
 * Check if running in development
 */
export const isDevelopment = () =>
  process.env.NODE_ENV === "development" || !process.env.NODE_ENV;

export default {
  validateEnv,
  getEnvConfig,
  isProduction,
  isDevelopment,
};
