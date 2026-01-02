import User from "../models/User.js";
import { verifyToken, extractToken } from "../utils/jwt.js";

/**
 * Extract token from Authorization header OR auth_token cookie
 * Supports both header-based and cookie-based auth for flexibility
 */
const getTokenFromRequest = (req) => {
  // First try Authorization header (API clients, mobile apps)
  const headerToken = extractToken(req.headers.authorization);
  if (headerToken) return headerToken;

  // Then try cookie (browser-based OAuth flow)
  if (req.cookies && req.cookies.auth_token) {
    return req.cookies.auth_token;
  }

  return null;
};

export const protect = async (req, res, next) => {
  try {
    //Token extraction from header OR cookie
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }
    //Step 2:Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Authentication failed",
        });
      }
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Authentication failed",
        });
      }
      throw error;
    }
    //Find user and attach to request
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (token) {
      const decoded = verifyToken(token);
      req.user = await User.findById(decoded.userId).select("-password");
    }
    next();
  } catch (error) {
    next();
  }
};
