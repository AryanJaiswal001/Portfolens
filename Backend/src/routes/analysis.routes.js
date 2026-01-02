/**
 * Analysis Routes
 *
 * API endpoints for portfolio analysis
 *
 * POST   /api/analysis/generate        - Generate full analysis (auth required)
 * GET    /api/analysis/sample          - Generate sample analysis (no auth)
 * POST   /api/analysis/sample          - Generate sample analysis (no auth)
 * GET    /api/analysis/summary/:id     - Get portfolio summary (auth required)
 */

import express from "express";
import {
  generatePortfolioAnalysis,
  generateSamplePortfolioAnalysis,
  getPortfolioSummary,
} from "../controllers/analysis.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  analysisRateLimiter,
  validateObjectId,
} from "../middleware/security.middleware.js";

const router = express.Router();

// Apply analysis-specific rate limiting to all routes
router.use(analysisRateLimiter);

/**
 * @route   POST /api/analysis/generate
 * @desc    Generate complete portfolio analysis
 * @access  Private
 * @body    { portfolioId: string }
 */
router.post("/generate", protect, generatePortfolioAnalysis);

/**
 * @route   GET|POST /api/analysis/sample
 * @desc    Generate sample portfolio analysis (demo)
 * @access  Public
 */
router.get("/sample", generateSamplePortfolioAnalysis);
router.post("/sample", generateSamplePortfolioAnalysis);

/**
 * @route   GET /api/analysis/summary/:portfolioId
 * @desc    Get quick portfolio summary
 * @access  Private
 */
router.get(
  "/summary/:portfolioId",
  protect,
  validateObjectId("portfolioId"),
  getPortfolioSummary
);

export default router;
