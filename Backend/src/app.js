import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Initialize Express app
const app = express();

// Environment
const NODE_ENV = process.env.NODE_ENV || "development";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// ===================
// MIDDLEWARE
// ===================

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Request logging (development only)
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ===================
// ROUTES
// ===================

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PortfoLens API is running",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

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

// TODO: Import and use routes when ready
// import authRoutes from './routes/auth.routes.js';
// import portfolioRoutes from './routes/portfolio.routes.js';
// app.use('/api/auth', authRoutes);
// app.use('/api/portfolio', portfolioRoutes);

// ===================
// ERROR HANDLING
// ===================

// 404 handler - Route not found
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
