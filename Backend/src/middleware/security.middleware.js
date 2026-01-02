/**
 * Security Middleware
 *
 * Centralized security utilities for PortfoLens API
 * - Rate limiting
 * - Input sanitization
 * - NoSQL injection prevention
 */

import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

// ═══════════════════════════════════════════════════════════════
// RATE LIMITING
// ═══════════════════════════════════════════════════════════════

/**
 * Global API rate limiter
 * 200 requests per 15 minutes per IP
 * Skips health checks and OAuth routes
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    retryAfter: "15 minutes",
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    if (req.path === "/api/health") return true;
    // Skip rate limiting for OAuth routes (involve redirects and retries)
    // OAuth routes are now at /auth/* (mounted separately from /api/*)
    if (req.path.startsWith("/auth/google")) return true;
    if (req.path.startsWith("/google")) return true; // For router-relative paths
    return false;
  },
});

/**
 * Strict rate limiter for sensitive operations
 * 50 requests per 15 minutes per IP
 * Use for portfolio save, reports, insights, calculations
 */
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests to this endpoint. Please try again later.",
    retryAfter: "15 minutes",
  },
});

/**
 * Strict rate limiter for authentication routes
 * 20 requests per 15 minutes per IP
 * Prevents brute force attacks
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
    retryAfter: "15 minutes",
  },
});

/**
 * Analysis endpoint rate limiter
 * Analysis is CPU-intensive, limit to prevent abuse
 * 30 requests per 15 minutes per IP
 */
export const analysisRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many analysis requests. Please try again later.",
    retryAfter: "15 minutes",
  },
});

// ═══════════════════════════════════════════════════════════════
// NOSQL INJECTION PREVENTION
// ═══════════════════════════════════════════════════════════════

/**
 * Check if value contains MongoDB query operators
 * Prevents NoSQL injection attacks
 */
const containsQueryOperators = (value) => {
  if (typeof value !== "object" || value === null) return false;

  const dangerousOperators = [
    "$gt",
    "$gte",
    "$lt",
    "$lte",
    "$ne",
    "$in",
    "$nin",
    "$or",
    "$and",
    "$not",
    "$nor",
    "$exists",
    "$type",
    "$expr",
    "$regex",
    "$where",
    "$elemMatch",
  ];

  const checkObject = (obj) => {
    for (const key of Object.keys(obj)) {
      if (dangerousOperators.includes(key)) return true;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (checkObject(obj[key])) return true;
      }
    }
    return false;
  };

  return checkObject(value);
};

/**
 * Middleware to sanitize request body
 * Rejects requests containing MongoDB operators
 */
export const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    if (containsQueryOperators(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid input: query operators not allowed",
      });
    }
  }

  if (req.query && typeof req.query === "object") {
    if (containsQueryOperators(req.query)) {
      return res.status(400).json({
        success: false,
        message: "Invalid input: query operators not allowed",
      });
    }
  }

  next();
};

// ═══════════════════════════════════════════════════════════════
// MONGODB ID VALIDATION
// ═══════════════════════════════════════════════════════════════

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId
 */
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Middleware to validate :id parameter
 * Returns 400 if ID is invalid
 */
export const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id) {
      return res.status(400).json({
        success: false,
        message: `Missing required parameter: ${paramName}`,
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`,
      });
    }

    next();
  };
};

// ═══════════════════════════════════════════════════════════════
// ERROR SANITIZATION
// ═══════════════════════════════════════════════════════════════

/**
 * Production-safe error handler
 * Hides stack traces and internal details in production
 */
export const productionErrorHandler = (err, req, res, next) => {
  const NODE_ENV = process.env.NODE_ENV || "development";

  // Log error internally (but not sensitive data)
  console.error(`❌ [${new Date().toISOString()}] Error:`, {
    message: err.message,
    path: req.path,
    method: req.method,
    // Don't log: passwords, tokens, full error objects
  });

  const statusCode = err.statusCode || 500;

  // Sanitize error message for production
  let message = err.message || "Internal Server Error";

  // Hide internal errors in production
  if (NODE_ENV === "production" && statusCode === 500) {
    message = "An unexpected error occurred. Please try again later.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only include stack in development
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default {
  globalRateLimiter,
  strictRateLimiter,
  authRateLimiter,
  analysisRateLimiter,
  sanitizeInput,
  isValidObjectId,
  validateObjectId,
  productionErrorHandler,
};
