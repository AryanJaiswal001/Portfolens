import express from "express";
import {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
} from "../controllers/portfolio.controller.js";
import { protect } from "../middleware/auth.middleware.js";

/**
 * Portfolio Routes
 *
 * All routes are protected - require valid JWT
 * userId is ALWAYS derived from req.user (JWT), never from request body
 */

const router = express.Router();

// All routes require authentication
router.use(protect);

// Portfolio CRUD
router
  .route("/")
  .post(createPortfolio) // POST /api/portfolio - Create new portfolio
  .get(getPortfolios); // GET /api/portfolio - Get all user portfolios

router
  .route("/:id")
  .get(getPortfolioById) // GET /api/portfolio/:id - Get single portfolio
  .put(updatePortfolio) // PUT /api/portfolio/:id - Update portfolio
  .delete(deletePortfolio); // DELETE /api/portfolio/:id - Delete portfolio

export default router;
