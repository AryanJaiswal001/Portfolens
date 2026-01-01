import express from "express";
import {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
} from "../controllers/portfolio.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  validateObjectId,
  strictRateLimiter,
} from "../middleware/security.middleware.js";
import {
  validate,
  createPortfolioSchema,
  updatePortfolioSchema,
} from "../middleware/validation.schemas.js";

/**
 * Portfolio Routes
 *
 * All routes are protected - require valid JWT
 * userId is ALWAYS derived from req.user (JWT), never from request body
 * Strict rate limiting applied to prevent API abuse
 */

const router = express.Router();

// All routes require authentication and strict rate limiting
router.use(protect);
router.use(strictRateLimiter);

// Portfolio CRUD with validation
router
  .route("/")
  .post(validate(createPortfolioSchema), createPortfolio) // POST /api/portfolio - Create new portfolio
  .get(getPortfolios); // GET /api/portfolio - Get all user portfolios

router
  .route("/:id")
  .all(validateObjectId("id")) // Validate MongoDB ObjectId
  .get(getPortfolioById) // GET /api/portfolio/:id - Get single portfolio
  .put(validate(updatePortfolioSchema), updatePortfolio) // PUT /api/portfolio/:id - Update portfolio
  .delete(deletePortfolio); // DELETE /api/portfolio/:id - Delete portfolio

export default router;
