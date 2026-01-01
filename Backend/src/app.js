import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";

// Import routes
import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/authroutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import fundReferenceRoutes from "./routes/fundReference.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";

// Import OAuth strategy
import configureGoogleStrategy from "./utils/OAuth.js";

// Import security middleware
import {
  sanitizeInput,
  productionErrorHandler,
  strictRateLimiter,
} from "./middleware/security.middleware.js";

// Initialize Express app
const app = express();

// Environment
const NODE_ENV = process.env.NODE_ENV || "development";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// ===================
// SECURITY MIDDLEWARE
// ===================

// Security headers (helmet defaults are production-ready)
app.use(helmet());

// CORS - Locked down to frontend domain only
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.) in dev
      if (!origin && NODE_ENV === "development") {
        return callback(null, true);
      }

      // Check against allowed origins
      const allowedOrigins = CORS_ORIGIN.split(",").map((o) => o.trim());
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Reject other origins
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// NOTE: Rate limiting is applied per-route group, NOT globally
// - OAuth routes: NO rate limiting (involves redirects and retries)
// - Auth routes (login/register): authRateLimiter (prevents brute force)
// - Portfolio routes: strictRateLimiter (prevents abuse)
// - Analysis routes: analysisRateLimiter (CPU-intensive)
// - Fund reference routes: strictRateLimiter (prevents abuse)

// NoSQL injection prevention
app.use(sanitizeInput);

// ===================
// UTILITY MIDDLEWARE
// ===================

// Request logging (safe - no sensitive data logged)
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  // Production: minimal logging, skip health checks
  app.use(
    morgan("combined", {
      skip: (req) => req.path === "/api/health",
    })
  );
}

// Body parsing with size limits
app.use(express.json({ limit: "1mb" })); // Reduced from 10mb
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ===================
// PASSPORT SETUP
// ===================

app.use(passport.initialize());
configureGoogleStrategy();

// ===================
// API ROUTES
// ===================

// Health check (no auth, no rate limit)
app.use("/api/health", healthRoutes);

// Authentication (rate limiting applied per-route in authroutes.js)
// - OAuth routes: NO rate limiting
// - Login/register: authRateLimiter
app.use("/api/auth", authRoutes);

// Portfolio management (protected, strict rate limiting applied in portfolioRoutes.js)
app.use("/api/portfolio", portfolioRoutes);

// Fund reference data (read-only, strict rate limiting)
app.use("/api/funds", strictRateLimiter, fundReferenceRoutes);

// Portfolio analysis (has its own rate limiting in analysis.routes.js)
app.use("/api/analysis", analysisRoutes);

// Test endpoint (dev only)
if (NODE_ENV === "development") {
  app.get("/api/test", (req, res) => {
    res.status(200).json({
      success: true,
      message: "API test endpoint working!",
      data: {
        name: "PortfoLens Backend",
        version: "1.0.0",
      },
    });
  });
}

// ===================
// ERROR HANDLING
// ===================

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Production-safe error handler
app.use(productionErrorHandler);

export default app;
