import Portfolio from "../models/portfolioModel.js";

/**
 * Portfolio Controller
 *
 * Handles CRUD operations for user portfolios
 * - All routes are protected (req.user is available)
 * - userId is ALWAYS taken from req.user._id, never from request body
 */

/**
 * @desc    Create a new portfolio
 * @route   POST /api/portfolio
 * @access  Private
 */
export const createPortfolio = async (req, res) => {
  try {
    const { name, funds } = req.body;
    const userId = req.user._id; // From auth middleware - NEVER from request body

    // Validation
    if (!funds || !Array.isArray(funds) || funds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Portfolio must contain at least one fund",
      });
    }

    // Validate each fund
    for (let i = 0; i < funds.length; i++) {
      const fund = funds[i];
      if (!fund.assetType || !fund.assetName || !fund.investmentStartYear) {
        return res.status(400).json({
          success: false,
          message: `Fund ${
            i + 1
          } is missing required fields (assetType, assetName, investmentStartYear)`,
        });
      }
    }

    // Create portfolio
    const portfolio = await Portfolio.create({
      userId,
      name: name || "My Portfolio",
      funds: funds.map((fund) => ({
        assetType: fund.assetType,
        assetName: fund.assetName,
        investmentStartYear: fund.investmentStartYear,
        sip: fund.sip || null,
        lumpsums: fund.lumpsums || [],
      })),
    });

    res.status(201).json({
      success: true,
      message: "Portfolio created successfully",
      data: {
        portfolio,
      },
    });
  } catch (error) {
    console.error("Create portfolio error:", error.message);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating portfolio",
    });
  }
};

/**
 * @desc    Get all portfolios for logged-in user
 * @route   GET /api/portfolio
 * @access  Private
 */
export const getPortfolios = async (req, res) => {
  try {
    const userId = req.user._id;

    const portfolios = await Portfolio.find({ userId })
      .sort({ createdAt: -1 }) // Latest first
      .lean();

    res.status(200).json({
      success: true,
      count: portfolios.length,
      data: {
        portfolios,
      },
    });
  } catch (error) {
    console.error("Get portfolios error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching portfolios",
    });
  }
};

/**
 * @desc    Get single portfolio by ID
 * @route   GET /api/portfolio/:id
 * @access  Private
 */
export const getPortfolioById = async (req, res) => {
  try {
    const userId = req.user._id;
    const portfolioId = req.params.id;

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId, // Ensure user owns this portfolio
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        portfolio,
      },
    });
  } catch (error) {
    console.error("Get portfolio error:", error.message);

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid portfolio ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error fetching portfolio",
    });
  }
};

/**
 * @desc    Update portfolio
 * @route   PUT /api/portfolio/:id
 * @access  Private
 */
export const updatePortfolio = async (req, res) => {
  try {
    const userId = req.user._id;
    const portfolioId = req.params.id;
    const { name, funds } = req.body;

    // Find portfolio and verify ownership
    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    // Update fields
    if (name) portfolio.name = name;
    if (funds && Array.isArray(funds) && funds.length > 0) {
      portfolio.funds = funds.map((fund) => ({
        assetType: fund.assetType,
        assetName: fund.assetName,
        investmentStartYear: fund.investmentStartYear,
        sip: fund.sip || null,
        lumpsums: fund.lumpsums || [],
      }));
    }

    await portfolio.save();

    res.status(200).json({
      success: true,
      message: "Portfolio updated successfully",
      data: {
        portfolio,
      },
    });
  } catch (error) {
    console.error("Update portfolio error:", error.message);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating portfolio",
    });
  }
};

/**
 * @desc    Delete portfolio
 * @route   DELETE /api/portfolio/:id
 * @access  Private
 */
export const deletePortfolio = async (req, res) => {
  try {
    const userId = req.user._id;
    const portfolioId = req.params.id;

    const portfolio = await Portfolio.findOneAndDelete({
      _id: portfolioId,
      userId, // Ensure user owns this portfolio
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Portfolio deleted successfully",
    });
  } catch (error) {
    console.error("Delete portfolio error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting portfolio",
    });
  }
};
