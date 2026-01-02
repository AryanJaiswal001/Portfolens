/**
 * Analysis Controller
 *
 * Handles HTTP requests for portfolio analysis
 * - POST /api/analysis/generate - Generate full analysis
 * - POST /api/analysis/sample - Generate sample portfolio analysis
 *
 * ⚠️ Controllers should NOT contain business logic
 * ⚠️ All logic lives in services
 */

import {
  generateAnalysis,
  generateSampleAnalysis,
  validatePortfolioForAnalysis,
} from "../services/analysis/index.js";
import Portfolio from "../models/portfolioModel.js";

/**
 * Generate portfolio analysis
 * POST /api/analysis/generate
 *
 * Request body: { portfolioId: string }
 * Response: Complete analysis object
 */
export const generatePortfolioAnalysis = async (req, res) => {
  try {
    const { portfolioId } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!portfolioId) {
      return res.status(400).json({
        success: false,
        message: "Portfolio ID is required",
      });
    }

    // Fetch portfolio for validation
    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId: userId,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found or access denied",
      });
    }

    // Validate portfolio has required data
    const validation = validatePortfolioForAnalysis(portfolio);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Portfolio validation failed",
        errors: validation.errors,
      });
    }

    // Generate analysis
    const analysis = await generateAnalysis(portfolioId, userId);

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Analysis generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate analysis",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Generate sample portfolio analysis
 * POST /api/analysis/sample
 *
 * Uses predefined sample portfolio data
 * Does not require authentication
 */
export const generateSamplePortfolioAnalysis = async (req, res) => {
  try {
    // Sample portfolio data (matching frontend sample)
    const samplePortfolio = {
      portfolioName: "Sample Investment Portfolio",
      funds: [
        {
          id: 1,
          name: "HDFC Mid-Cap Opportunities Fund",
          category: "Equity - Mid Cap",
          invested: 312500,
        },
        {
          id: 2,
          name: "Axis Bluechip Fund",
          category: "Equity - Large Cap",
          invested: 250000,
        },
        {
          id: 3,
          name: "SBI Small Cap Fund",
          category: "Equity - Small Cap",
          invested: 187500,
        },
        {
          id: 4,
          name: "ICICI Prudential Flexi Cap Fund",
          category: "Equity - Flexi Cap",
          invested: 187500,
        },
        {
          id: 5,
          name: "Parag Parikh Flexi Cap Fund",
          category: "Equity - Flexi Cap",
          invested: 125000,
        },
        {
          id: 6,
          name: "Kotak Equity Hybrid Fund",
          category: "Hybrid - Aggressive",
          invested: 125000,
        },
        {
          id: 7,
          name: "HDFC Corporate Bond Fund",
          category: "Debt - Corporate Bond",
          invested: 37500,
        },
        {
          id: 8,
          name: "SBI Gold Fund",
          category: "Commodity - Gold",
          invested: 25000,
        },
      ],
    };

    const analysis = await generateSampleAnalysis(samplePortfolio);

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Sample analysis generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate sample analysis",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Quick portfolio summary (lightweight)
 * GET /api/analysis/summary/:portfolioId
 *
 * Returns basic metrics without full analysis
 */
export const getPortfolioSummary = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const userId = req.user._id;

    // Validate portfolioId parameter
    if (!portfolioId) {
      return res.status(400).json({
        success: false,
        message: "Portfolio ID is required",
      });
    }

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId: userId,
    }).lean();

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    // Handle empty portfolio case
    if (!portfolio.funds || portfolio.funds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          portfolioId: portfolio._id,
          name: portfolio.name,
          fundCount: 0,
          sipCount: 0,
          lumpsumCount: 0,
          totalInvested: 0,
          createdAt: portfolio.createdAt,
          updatedAt: portfolio.updatedAt,
        },
        message: "Portfolio has no funds",
      });
    }

    // Calculate basic summary
    let totalInvested = 0;
    let sipCount = 0;
    let lumpsumCount = 0;

    for (const fund of portfolio.funds) {
      // Sum SIPs (safely handle null/undefined)
      if (fund.sips && Array.isArray(fund.sips)) {
        for (const sip of fund.sips) {
          if (sip && sip.amount > 0) {
            sipCount++;
            const months = calculateSipMonths(sip);
            totalInvested += sip.amount * months;
          }
        }
      }

      // Sum lumpsums (safely handle null/undefined)
      if (fund.lumpsums && Array.isArray(fund.lumpsums)) {
        for (const lumpsum of fund.lumpsums) {
          if (lumpsum && lumpsum.amount > 0) {
            lumpsumCount++;
            totalInvested += lumpsum.amount;
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        portfolioId: portfolio._id,
        name: portfolio.name,
        fundCount: portfolio.funds.length,
        sipCount,
        lumpsumCount,
        totalInvested,
        createdAt: portfolio.createdAt,
        updatedAt: portfolio.updatedAt,
      },
    });
  } catch (error) {
    console.error("Portfolio summary error:", error);

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid portfolio ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to get portfolio summary",
    });
  }
};

/**
 * Calculate SIP months for summary
 * Returns 0 if SIP data is invalid
 */
function calculateSipMonths(sip) {
  // Validate SIP has required fields
  if (!sip || !sip.startYear || !sip.startMonth) {
    return 0;
  }

  const NAV_CUTOFF_YEAR = 2024;
  const NAV_CUTOFF_MONTH = 12;

  const startDate = new Date(sip.startYear, sip.startMonth - 1, 1);

  let endDate;
  if (sip.isOngoing) {
    endDate = new Date(NAV_CUTOFF_YEAR, NAV_CUTOFF_MONTH - 1, 1);
  } else {
    // Validate end date fields for non-ongoing SIPs
    if (!sip.endYear || !sip.endMonth) {
      // Default to cutoff if end date not specified
      endDate = new Date(NAV_CUTOFF_YEAR, NAV_CUTOFF_MONTH - 1, 1);
    } else {
      endDate = new Date(sip.endYear, sip.endMonth - 1, 1);
    }
  }

  // Ensure start date is not after end date
  if (startDate > endDate) {
    return 0;
  }

  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth()) +
    1;

  return Math.max(0, months);
}

export default {
  generatePortfolioAnalysis,
  generateSamplePortfolioAnalysis,
  getPortfolioSummary,
};
