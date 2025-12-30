import express from "express";
import {
  getAllFunds,
  searchFundsHandler,
  validateFundHandler,
  validatePortfolioFunds,
  getSuggestionsHandler,
  getCategories,
  getAssetTypes,
  getAMCs,
  getFundByIdentifier,
  analyzeFundsHandler,
} from "../controllers/fundReference.controller.js";
import { protect } from "../middleware/auth.middleware.js";

/**
 * FundReference Routes
 *
 * READ-ONLY routes for fund reference data
 * All routes require authentication
 * No create/update/delete routes - data is seeded only
 */

const router = express.Router();

// All routes require authentication
router.use(protect);

// ==================
// METADATA ROUTES
// ==================
router.get("/meta/categories", getCategories);
router.get("/meta/asset-types", getAssetTypes);
router.get("/meta/amcs", getAMCs);

// ==================
// SEARCH & SUGGESTIONS
// ==================
router.get("/search", searchFundsHandler);
router.get("/suggestions", getSuggestionsHandler);

// ==================
// VALIDATION ROUTES
// ==================
router.post("/validate", validateFundHandler);
router.post("/validate-portfolio", validatePortfolioFunds);

// ==================
// ANALYSIS ROUTES
// ==================
router.post("/analyze", analyzeFundsHandler);

// ==================
// BASE ROUTES
// ==================
router.get("/", getAllFunds);
router.get("/:identifier", getFundByIdentifier);

export default router;
