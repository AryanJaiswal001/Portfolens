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

// Initialize Express app
const app = express();

// Environment
const NODE_ENV = process.env.NODE_ENV || "development";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// ===================
// SECURITY MIDDLEWARE
// ===================

app.use(helmet());

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ===================
// UTILITY MIDDLEWARE
// ===================

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ===================
// PASSPORT SETUP
// ===================

app.use(passport.initialize());
configureGoogleStrategy();

// ===================
// API ROUTES
// ===================

// Health check
app.use("/api/health", healthRoutes);

// Authentication
app.use("/api/auth", authRoutes);

// Portfolio management
app.use("/api/portfolio", portfolioRoutes);

// Fund reference data (read-only)
app.use("/api/funds", fundReferenceRoutes);

// Portfolio analysis
app.use("/api/analysis", analysisRoutes);

// Test endpoint
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

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
