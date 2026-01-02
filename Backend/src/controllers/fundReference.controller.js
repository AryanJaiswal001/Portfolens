import FundReference from "../models/FundReferenceModel.js";
import {
  validateFund,
  validateFunds,
  getFundSuggestions,
  searchFunds,
  getFundsMetadata,
} from "../middleware/Fund.Validation_service.js";

/**
 * FundReference Controller
 *
 * READ-ONLY operations for fund reference data
 * This data is NOT editable by users
 * Only the seed script can populate/modify this data
 */

/**
 * @desc    Get all fund references with filters
 * @route   GET /api/funds
 * @access  Private
 */
export const getAllFunds = async (req, res) => {
  try {
    const { assetType, category, amc, limit = 100 } = req.query;

    const query = { isActive: true };

    if (assetType) query.assetType = assetType;
    if (category) query.category = category;
    if (amc) query.amc = { $regex: new RegExp(amc, "i") };

    const funds = await FundReference.find(query)
      .sort({ popularityRank: 1 })
      .limit(parseInt(limit))
      .select("-__v");

    return res.status(200).json({
      success: true,
      count: funds.length,
      data: { funds },
    });
  } catch (error) {
    console.error("Get funds error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching funds",
    });
  }
};

/**
 * @desc    Search funds by name (autocomplete)
 * @route   GET /api/funds/search?q=hdfc&limit=10
 * @access  Private
 */
export const searchFundsHandler = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: { funds: [] },
      });
    }

    const funds = await searchFunds(q, parseInt(limit));

    return res.status(200).json({
      success: true,
      count: funds.length,
      data: {
        funds: funds.map((f) => ({
          _id: f._id,
          fundName: f.fundName,
          assetType: f.assetType,
          category: f.category,
          amc: f.amc,
        })),
      },
    });
  } catch (error) {
    console.error("Search funds error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error searching funds",
    });
  }
};

/**
 * @desc    Validate a single fund name
 * @route   POST /api/funds/validate
 * @access  Private
 * @body    { fundName: "HDFC Top 100 Fund" }
 */
export const validateFundHandler = async (req, res) => {
  try {
    const { fundName } = req.body;

    if (!fundName) {
      return res.status(400).json({
        success: false,
        message: "Fund name is required",
      });
    }

    const result = await validateFund(fundName);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Validate fund error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error validating fund",
    });
  }
};

/**
 * @desc    Validate multiple funds (for portfolio)
 * @route   POST /api/funds/validate-portfolio
 * @access  Private
 * @body    { funds: [{ assetName: "Fund 1" }, { assetName: "Fund 2" }] }
 */
export const validatePortfolioFunds = async (req, res) => {
  try {
    const { funds } = req.body;

    if (!funds || !Array.isArray(funds)) {
      return res.status(400).json({
        success: false,
        message: "Funds array is required",
      });
    }

    const result = await validateFunds(funds);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Validate portfolio error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error validating portfolio funds",
    });
  }
};

/**
 * @desc    Get fund suggestions
 * @route   GET /api/funds/suggestions?assetType=Equity&category=Large Cap
 * @access  Private
 */
export const getSuggestionsHandler = async (req, res) => {
  try {
    const { assetType, category, amc, limit = 5 } = req.query;

    const suggestions = await getFundSuggestions(
      { assetType, category, amc },
      parseInt(limit)
    );

    return res.status(200).json({
      success: true,
      count: suggestions.length,
      data: { suggestions },
    });
  } catch (error) {
    console.error("Get suggestions error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error getting suggestions",
    });
  }
};

/**
 * @desc    Get available categories
 * @route   GET /api/funds/meta/categories
 * @access  Private
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await FundReference.getAllCategories();

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: { categories: categories.sort() },
    });
  } catch (error) {
    console.error("Get categories error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching categories",
    });
  }
};

/**
 * @desc    Get available asset types
 * @route   GET /api/funds/meta/asset-types
 * @access  Private
 */
export const getAssetTypes = async (req, res) => {
  try {
    const assetTypes = await FundReference.distinct("assetType", {
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      count: assetTypes.length,
      data: { assetTypes },
    });
  } catch (error) {
    console.error("Get asset types error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching asset types",
    });
  }
};

/**
 * @desc    Get available AMCs
 * @route   GET /api/funds/meta/amcs
 * @access  Private
 */
export const getAMCs = async (req, res) => {
  try {
    const amcs = await FundReference.getAllAMCs();

    return res.status(200).json({
      success: true,
      count: amcs.length,
      data: { amcs: amcs.sort() },
    });
  } catch (error) {
    console.error("Get AMCs error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching AMCs",
    });
  }
};

/**
 * @desc    Get fund by ID or name
 * @route   GET /api/funds/:identifier
 * @access  Private
 */
export const getFundByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;
    let fund = null;

    // Try by ObjectId first
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      fund = await FundReference.findById(identifier);
    }

    // Try by exact name
    if (!fund) {
      fund = await FundReference.findByName(identifier);
    }

    if (!fund) {
      return res.status(404).json({
        success: false,
        message: "Fund not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { fund },
    });
  } catch (error) {
    console.error("Get fund error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching fund",
    });
  }
};

/**
 * @desc    Analyze funds metadata (for portfolio analysis)
 * @route   POST /api/funds/analyze
 * @access  Private
 * @body    { fundNames: ["Fund 1", "Fund 2"] }
 */
export const analyzeFundsHandler = async (req, res) => {
  try {
    const { fundNames } = req.body;

    if (!fundNames || !Array.isArray(fundNames) || fundNames.length === 0) {
      return res.status(400).json({
        success: false,
        message: "fundNames array is required",
      });
    }

    const result = await getFundsMetadata(fundNames);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Analyze funds error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error analyzing funds",
    });
  }
};
