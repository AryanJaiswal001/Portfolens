import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";

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

// Custom Origin enforcement middleware
// OAuth redirect routes bypass Origin validation (browser redirects don't include Origin)
// All other routes require strict CORS enforcement
app.use((req, res, next) => {
  const origin = req.headers.origin;

  const isAuthRoute =
    req.path.startsWith("/auth") || req.path.startsWith("/api/auth");

  // ✅ Allow OAuth redirects without Origin
  if (!origin && isAuthRoute) {
    return next();
  }

  // Allow requests with no origin in development only
  if (!origin) {
    if (NODE_ENV === "development") {
      return next();
    }
    // ❌ Block non-auth requests without Origin in production
    return res.status(403).json({
      success: false,
      message: "CORS: Origin header required",
    });
  }

  // ❌ Block unknown origins
  if (!ALLOWED_ORIGINS.includes(origin)) {
    console.warn(`CORS blocked origin: ${origin}`);
    return res.status(403).json({
      success: false,
      message: "CORS: Origin not allowed",
    });
  }

  // ✅ Set CORS headers for allowed origins
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

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

// Cookie parser (required for auth_token cookie)
app.use(cookieParser());

// ===================
// SESSION (for OAuth handshake only)
// ===================
// Session is required for Passport OAuth to maintain state during redirect.
// After OAuth completes, session is destroyed to keep app stateless (JWT-based).
app.use(
  session({
    secret: process.env.JWT_SECRET || "oauth-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      maxAge: 10 * 60 * 1000, // 10 minutes - just enough for OAuth handshake
    },
  })
);

// ===================
// PASSPORT SETUP
// ===================

app.use(passport.initialize());
app.use(passport.session()); // Required for OAuth handshake
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

// Global catch-all error handler (MANDATORY - prevents 502)
// This is the last line of defense against unhandled errors
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  // Prevent sending response if headers already sent
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;
