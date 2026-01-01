import express from "express";
import {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
} from "../controllers/portfolio.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validateObjectId } from "../middleware/security.middleware.js";
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
 */

const router = express.Router();

// All routes require authentication
router.use(protect);

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
