/**
 * Analysis Service - Main Orchestrator
 *
 * Coordinates all analysis services to generate comprehensive
 * portfolio insights and reports.
 *
 * Flow:
 * 1. Fetch portfolio data
 * 2. Fetch reference data (FundReference, HoldingTemplates, NAV)
 * 3. Run diversification analysis
 * 4. Run performance analysis
 * 5. Build insights and reports
 * 6. Return unified response
 *
 * ⚠️ All data is demo/simulated
 * ⚠️ Controller should NOT contain business logic
 */

import Portfolio from "../../models/portfolioModel.js";
import {
  analyzeDiversification,
  fetchFundMetadata,
  fetchHoldingTemplates,
} from "./diversification.service.js";
import {
  analyzePerformance,
  fetchNavData,
  NAV_CUTOFF_KEY,
} from "./performance.service.js";
import { buildInsights, buildReportData } from "./insightBuilder.service.js";

// Demo mode constants
const IS_DEMO_MODE = true;
const DATA_AS_OF = "Dec 2024";
const NAV_PERIOD = "Jan 2024 - Dec 2024";

/**
 * Generate complete portfolio analysis
 *
 * @param {string} portfolioId - Portfolio document ID
 * @param {string} userId - User ID for authorization
 * @returns {Object} Complete analysis response
 */
export async function generateAnalysis(portfolioId, userId) {
  // 1. Fetch portfolio
  const portfolio = await Portfolio.findOne({
    _id: portfolioId,
    userId: userId,
  }).lean();

  if (!portfolio) {
    throw new Error("Portfolio not found or access denied");
  }

  // 2. Extract fund names for data fetching
  const fundNames = portfolio.funds.map((f) => f.assetName);

  // 3. Fetch all reference data in parallel
  const [fundMetadata, holdingTemplates, navData] = await Promise.all([
    fetchFundMetadata(fundNames),
    fetchHoldingTemplates(),
    fetchNavData(fundNames),
  ]);

  // 4. Run diversification analysis
  const diversification = analyzeDiversification(
    portfolio.funds,
    fundMetadata,
    holdingTemplates
  );

  // 5. Run performance analysis
  const performance = analyzePerformance(portfolio.funds, navData);

  // 6. Build insights
  const insights = buildInsights(performance, diversification, portfolio);

  // 7. Build report data
  const reports = buildReportData(
    performance,
    diversification,
    insights,
    portfolio
  );

  // 8. Build portfolio summary
  const portfolioSummary = {
    id: portfolio._id,
    name: portfolio.name,
    fundCount: portfolio.funds.length,
    isSample: portfolio.isSample || false,
    createdAt: portfolio.createdAt,
    updatedAt: portfolio.updatedAt,
    funds: portfolio.funds.map((f) => ({
      id: f._id,
      name: f.assetName,
      type: f.assetType,
      sipCount: f.sips?.length || 0,
      lumpsumCount: f.lumpsums?.length || 0,
      // Include fund metadata if available
      category: fundMetadata[f.assetName]?.category || "Unknown",
      amc: fundMetadata[f.assetName]?.amc || "Unknown",
    })),
  };

  // 9. Return unified response
  return {
    // Demo mode flags - MUST be included
    isDemoMode: IS_DEMO_MODE,
    dataAsOf: DATA_AS_OF,
    navPeriod: NAV_PERIOD,
    disclaimer: getDisclaimer(),

    // Analysis results
    portfolioSummary,
    diversification,
    performance,
    insights,
    reports,

    // Metadata
    generatedAt: new Date().toISOString(),
    analysisVersion: "1.0.0",
  };
}

/**
 * Generate analysis for sample portfolio (demo purposes)
 * Creates a temporary portfolio structure without saving
 *
 * @param {Object} samplePortfolioData - Sample portfolio data
 * @returns {Object} Complete analysis response
 */
export async function generateSampleAnalysis(samplePortfolioData) {
  // Validate input
  if (!samplePortfolioData) {
    throw new Error("Sample portfolio data is required");
  }

  if (!samplePortfolioData.funds || !Array.isArray(samplePortfolioData.funds)) {
    throw new Error("Sample portfolio must have a funds array");
  }

  if (samplePortfolioData.funds.length === 0) {
    throw new Error("Sample portfolio must have at least one fund");
  }

  // Convert sample data to portfolio structure
  const portfolio = {
    _id: "sample-portfolio",
    name: samplePortfolioData.portfolioName || "Sample Portfolio",
    isSample: true,
    funds: samplePortfolioData.funds.map((f) => convertSampleFund(f)),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Extract fund names
  const fundNames = portfolio.funds.map((f) => f.assetName);

  // Fetch reference data
  const [fundMetadata, holdingTemplates, navData] = await Promise.all([
    fetchFundMetadata(fundNames),
    fetchHoldingTemplates(),
    fetchNavData(fundNames),
  ]);

  // Run analysis
  const diversification = analyzeDiversification(
    portfolio.funds,
    fundMetadata,
    holdingTemplates
  );

  const performance = analyzePerformance(portfolio.funds, navData);
  const insights = buildInsights(performance, diversification, portfolio);
  const reports = buildReportData(
    performance,
    diversification,
    insights,
    portfolio
  );

  const portfolioSummary = {
    id: "sample",
    name: portfolio.name,
    fundCount: portfolio.funds.length,
    isSample: true,
    funds: portfolio.funds.map((f) => ({
      name: f.assetName,
      type: f.assetType,
      category: fundMetadata[f.assetName]?.category || "Unknown",
    })),
  };

  return {
    isDemoMode: IS_DEMO_MODE,
    dataAsOf: DATA_AS_OF,
    navPeriod: NAV_PERIOD,
    disclaimer: getDisclaimer(),
    portfolioSummary,
    diversification,
    performance,
    insights,
    reports,
    generatedAt: new Date().toISOString(),
    analysisVersion: "1.0.0",
  };
}

/**
 * Convert sample fund format to portfolio fund format
 */
function convertSampleFund(sampleFund) {
  // Sample funds have: name, category, invested, allocation
  // Convert to portfolio format with SIP assumption

  // Assume SIP started Jan 2024, monthly amount = invested / 12
  const monthlyAmount = Math.round(sampleFund.invested / 12);

  return {
    _id: `sample-fund-${sampleFund.id || Math.random().toString(36).slice(2)}`,
    assetType: "Mutual Fund",
    assetName: sampleFund.name,
    sips: [
      {
        amount: monthlyAmount,
        startMonth: 1,
        startYear: 2024,
        isOngoing: true,
      },
    ],
    lumpsums: [],
  };
}

/**
 * Get demo disclaimer text
 */
function getDisclaimer() {
  return {
    short: "Demo mode - Simulated data for educational purposes only.",
    full: "PortfoLens is currently in demo mode. Insights and performance metrics are generated using simulated historical data for educational and analytical purposes only. This is not financial advice. Past performance does not guarantee future results. Please consult a qualified financial advisor for investment decisions.",
    highlights: [
      "Simulated NAV data (Jan 2024 - Dec 2024)",
      "For educational purposes only",
      "Not financial advice",
    ],
  };
}

/**
 * Validate portfolio for analysis
 * Checks if portfolio has required data
 */
export function validatePortfolioForAnalysis(portfolio) {
  const errors = [];

  if (!portfolio.funds || portfolio.funds.length === 0) {
    errors.push("Portfolio must have at least one fund");
  }

  for (const fund of portfolio.funds || []) {
    const hasSips = fund.sips && fund.sips.length > 0;
    const hasLumpsums = fund.lumpsums && fund.lumpsums.length > 0;

    if (!hasSips && !hasLumpsums) {
      errors.push(
        `Fund "${fund.assetName}" has no investments (SIP or lumpsum)`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export default {
  generateAnalysis,
  generateSampleAnalysis,
  validatePortfolioForAnalysis,
};
