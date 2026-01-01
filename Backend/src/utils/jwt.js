import jwt from "jsonwebtoken";

// JWT configuration from environment
// NEVER use default secret in production - env validation catches this
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d"; // Default: 1 day (was 7d)

/**
 * Generate JWT token for a user
 * @param {string} userId - MongoDB user ID
 * @returns {string} JWT token
 */
export const generateToken = (userId) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    // Additional security options
    algorithm: "HS256",
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */
export const verifyToken = (token) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.verify(token, JWT_SECRET, {
    algorithms: ["HS256"], // Only allow expected algorithm
  });
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */
export const extractToken = (authHeader) => {
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7); // More efficient than split
  }
  return null;
};
