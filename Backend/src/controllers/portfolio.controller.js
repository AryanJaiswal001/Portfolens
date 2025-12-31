import Portfolio from "../models/portfolioModel.js";

/**
 * Portfolio Controller
 *
 * Handles CRUD operations for user portfolios
 * - All routes are protected (req.user is available)
 * - userId is ALWAYS taken from req.user._id, never from request body
 */

/**
 * Transform stored portfolio data to frontend-compatible format
 * Used when sending data back for editing
 */
const transformForFrontend = (portfolio) => {
  const transformed = portfolio.toObject
    ? portfolio.toObject()
    : { ...portfolio };

  transformed.funds = transformed.funds.map((fund) => {
    // Get first SIP entry for backward compatibility
    const firstSip = fund.sips && fund.sips.length > 0 ? fund.sips[0] : null;

    return {
      ...fund,
      // For backward compatibility with frontend
      sip: firstSip ? firstSip.amount : null,
      investmentStartYear: firstSip
        ? firstSip.startYear
        : new Date().getFullYear(),
      // Transform lumpsums to frontend format
      lumpsums: (fund.lumpsums || []).map((l) => ({
        year: l.year,
        amount: l.amount,
        month: l.month,
      })),
    };
  });

  return transformed;
};

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
      if (!fund.assetType || !fund.assetName) {
        return res.status(400).json({
          success: false,
          message: `Fund ${
            i + 1
          } is missing required fields (assetType, assetName)`,
        });
      }

      // Must have either SIP or lumpsum (support both old and new formats)
      // New format: fund.sips array
      // Old format: fund.sip single value
      const hasSipsArray =
        fund.sips &&
        Array.isArray(fund.sips) &&
        fund.sips.some((s) => s.amount && parseFloat(s.amount) > 0);
      const hasSipSingle = fund.sip && parseFloat(fund.sip) > 0;
      const hasSip = hasSipsArray || hasSipSingle;

      const hasLumpsum =
        fund.lumpsums &&
        fund.lumpsums.some((l) => l.amount && parseFloat(l.amount) > 0);

      // ✅ SIP-only: allowed
      // ✅ Lumpsum-only: allowed
      // ❌ Neither: invalid
      if (!hasSip && !hasLumpsum) {
        return res.status(400).json({
          success: false,
          message: `Fund ${i + 1} must have either SIP or lumpsum investment`,
        });
      }
    }

    // Transform frontend data to new schema format
    const transformedFunds = funds.map((fund) => {
      const transformed = {
        assetType: fund.assetType,
        assetName: fund.assetName,
        sips: [],
        lumpsums: [],
      };

      // NEW FORMAT: Handle sips array from frontend
      if (fund.sips && Array.isArray(fund.sips) && fund.sips.length > 0) {
        transformed.sips = fund.sips
          .filter((s) => s.amount && parseFloat(s.amount) > 0)
          .map((s) => ({
            amount: parseFloat(s.amount),
            startMonth: parseInt(s.startMonth) || 1,
            startYear: parseInt(s.startYear) || 2024,
            isOngoing: s.isOngoing !== false, // Default to true
            endMonth: s.isOngoing === false ? parseInt(s.endMonth) : null,
            endYear: s.isOngoing === false ? parseInt(s.endYear) : null,
          }));
      }
      // OLD FORMAT: Convert single SIP amount to sips array entry (backward compatibility)
      else if (fund.sip && parseFloat(fund.sip) > 0) {
        const startYear = fund.investmentStartYear || new Date().getFullYear();
        transformed.sips.push({
          amount: parseFloat(fund.sip),
          startMonth: 1, // Default to January
          startYear: startYear,
          isOngoing: true,
        });
      }

      // Convert lumpsums (add month if missing)
      if (fund.lumpsums && fund.lumpsums.length > 0) {
        transformed.lumpsums = fund.lumpsums
          .filter((l) => l.amount && parseFloat(l.amount) > 0)
          .map((l) => ({
            amount: parseFloat(l.amount),
            month: parseInt(l.month) || 1, // Default to January if month not provided
            year: parseInt(l.year),
          }));
      }

      return transformed;
    });

    // Create portfolio
    const portfolio = await Portfolio.create({
      userId,
      name: name || "My Portfolio",
      funds: transformedFunds,
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

    // Transform each portfolio for frontend compatibility
    const transformedPortfolios = portfolios.map((p) =>
      transformForFrontend(p)
    );

    res.status(200).json({
      success: true,
      count: portfolios.length,
      data: {
        portfolios: transformedPortfolios,
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

    // Transform to frontend-compatible format for editing
    const transformedPortfolio = transformForFrontend(portfolio);

    res.status(200).json({
      success: true,
      data: {
        portfolio: transformedPortfolio,
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
      // Transform frontend data to new schema format
      portfolio.funds = funds.map((fund) => {
        const transformed = {
          assetType: fund.assetType,
          assetName: fund.assetName,
          sips: [],
          lumpsums: [],
        };

        // NEW FORMAT: Handle sips array from frontend
        if (fund.sips && Array.isArray(fund.sips) && fund.sips.length > 0) {
          transformed.sips = fund.sips
            .filter((s) => s.amount && parseFloat(s.amount) > 0)
            .map((s) => ({
              amount: parseFloat(s.amount),
              startMonth: parseInt(s.startMonth) || 1,
              startYear: parseInt(s.startYear) || 2024,
              isOngoing: s.isOngoing !== false, // Default to true
              endMonth: s.isOngoing === false ? parseInt(s.endMonth) : null,
              endYear: s.isOngoing === false ? parseInt(s.endYear) : null,
            }));
        }
        // OLD FORMAT: Convert single SIP amount to sips array entry (backward compatibility)
        else if (fund.sip && parseFloat(fund.sip) > 0) {
          const startYear =
            fund.investmentStartYear || new Date().getFullYear();
          transformed.sips.push({
            amount: parseFloat(fund.sip),
            startMonth: 1, // Default to January
            startYear: startYear,
            isOngoing: true,
          });
        }

        // Convert lumpsums (add month if missing)
        if (fund.lumpsums && fund.lumpsums.length > 0) {
          transformed.lumpsums = fund.lumpsums
            .filter((l) => l.amount && parseFloat(l.amount) > 0)
            .map((l) => ({
              amount: parseFloat(l.amount),
              month: parseInt(l.month) || 1, // Default to January if month not provided
              year: parseInt(l.year),
            }));
        }

        return transformed;
      });
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
