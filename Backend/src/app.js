import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";

// Import routes
import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/authroutes.js";
import oauthRoutes from "./routes/oauthRoutes.js";
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

// ===================
// ALLOWED ORIGINS (explicit whitelist)
// ===================
const ALLOWED_ORIGINS = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:3000", // Alternative local dev
  "https://portfolens.vercel.app", // Production frontend on Vercel
];

// ===================
// TRUST PROXY (required for Render/Vercel behind reverse proxy)
// ===================
// Must be set before rate limiting and other middleware that use req.ip
app.set("trust proxy", 1);

// ===================
// SECURITY MIDDLEWARE
// ===================

// Security headers (helmet defaults are production-ready)
app.use(helmet());

// CORS - Strict whitelist of allowed origins
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl) ONLY in development
      if (!origin) {
        if (NODE_ENV === "development") {
          return callback(null, true);
        }
        // In production, reject requests without origin header
        return callback(new Error("CORS: Origin header required"));
      }

      // Check against explicit whitelist
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      // Reject all other origins
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["X-Total-Count"], // For pagination if needed
    maxAge: 86400, // Cache preflight for 24 hours
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
// OAUTH ROUTES (at /auth, NOT /api/auth)
// ===================
// Google OAuth routes are mounted at /auth/* for cleaner URLs
// and to match Google Cloud Console callback URL exactly
app.use("/auth", oauthRoutes);

// ===================
// API ROUTES
// ===================

// Health check (no auth, no rate limit)
app.use("/api/health", healthRoutes);

// Authentication (rate limiting applied per-route in authroutes.js)
// - Login/register: authRateLimiter
// - OAuth routes moved to /auth/*
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
