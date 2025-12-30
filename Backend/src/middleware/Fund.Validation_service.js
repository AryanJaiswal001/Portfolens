import FundReference from "../models/FundReferenceModel.js";

/**
 * Fund Validation Service
 *
 * Handles validation of user-entered fund names
 * Determines coverage level and provides suggestions
 *
 * Coverage Levels:
 * - full: Fund exists in FundReference (complete analysis possible)
 * - partial: Fund not found but asset type inferred (limited analysis)
 * - unsupported: Cannot classify fund (block or suggest alternatives)
 */

/**
 * Validate a single fund name
 * @param {string} fundName - User-entered fund name
 * @returns {Object} Validation result with coverage info
 */
export async function validateFund(fundName) {
  if (!fundName || typeof fundName !== "string") {
    return {
      isValid: false,
      inputName: fundName,
      analysisCoverage: "unsupported",
      error: "Fund name is required",
    };
  }

  const trimmedName = fundName.trim();

  // Try to find exact match (case-insensitive)
  const fund = await FundReference.findByName(trimmedName);

  if (fund) {
    return {
      isValid: true,
      inputName: trimmedName,
      matchedFund: {
        _id: fund._id,
        fundName: fund.fundName,
        assetType: fund.assetType,
        category: fund.category,
        amc: fund.amc,
        benchmark: fund.benchmark,
      },
      analysisCoverage: "full",
      message: "Fund found in reference database",
    };
  }

  // Try to infer asset type from name
  const inferredType = inferAssetTypeFromName(trimmedName);

  if (inferredType) {
    // Get suggestions for similar funds
    const suggestions = await FundReference.getSuggestions(
      inferredType,
      null,
      5
    );

    return {
      isValid: true, // Allow save with partial coverage
      inputName: trimmedName,
      inferredAssetType: inferredType,
      analysisCoverage: "partial",
      message: `Fund not in database. Asset type inferred as ${inferredType}. Limited analysis available.`,
      suggestions: suggestions.map((s) => ({
        fundName: s.fundName,
        assetType: s.assetType,
        category: s.category,
        amc: s.amc,
      })),
    };
  }

  // Cannot classify - get general suggestions
  const suggestions = await FundReference.find({ isActive: true })
    .sort({ popularityRank: 1 })
    .limit(5)
    .select("fundName assetType category amc");

  return {
    isValid: false,
    inputName: trimmedName,
    analysisCoverage: "unsupported",
    message:
      "Fund cannot be classified. Please select from suggested funds or provide asset type.",
    suggestions: suggestions.map((s) => ({
      fundName: s.fundName,
      assetType: s.assetType,
      category: s.category,
      amc: s.amc,
    })),
  };
}

/**
 * Validate multiple funds at once
 * @param {Array<Object>} funds - Array of fund objects with assetName
 * @returns {Object} Validation results with summary
 */
export async function validateFunds(funds) {
  if (!Array.isArray(funds) || funds.length === 0) {
    return {
      isValid: false,
      error: "At least one fund is required",
      results: [],
    };
  }

  const results = {
    isValid: true,
    totalFunds: funds.length,
    fullCoverage: [],
    partialCoverage: [],
    unsupported: [],
    validatedFunds: [],
  };

  for (const fund of funds) {
    const fundName = fund.assetName || fund.fundName;
    const validation = await validateFund(fundName);

    // Add original fund data to validation result
    const enrichedResult = {
      ...validation,
      originalFund: fund,
    };

    results.validatedFunds.push(enrichedResult);

    if (validation.analysisCoverage === "full") {
      results.fullCoverage.push(enrichedResult);
    } else if (validation.analysisCoverage === "partial") {
      results.partialCoverage.push(enrichedResult);
    } else {
      results.unsupported.push(enrichedResult);
      results.isValid = false; // Block if any unsupported
    }
  }

  // Add summary
  results.summary = {
    full: results.fullCoverage.length,
    partial: results.partialCoverage.length,
    unsupported: results.unsupported.length,
    coveragePercentage: Math.round(
      ((results.fullCoverage.length + results.partialCoverage.length) /
        results.totalFunds) *
        100
    ),
  };

  return results;
}

/**
 * Get fund suggestions based on criteria
 * @param {Object} criteria - { assetType, category, amc }
 * @param {number} limit - Max suggestions to return
 * @returns {Array} Suggested funds
 */
export async function getFundSuggestions(criteria = {}, limit = 5) {
  const query = { isActive: true };

  if (criteria.assetType) {
    query.assetType = criteria.assetType;
  }

  if (criteria.category) {
    query.category = criteria.category;
  }

  if (criteria.amc) {
    query.amc = { $regex: new RegExp(criteria.amc, "i") };
  }

  return FundReference.find(query)
    .sort({ popularityRank: 1 })
    .limit(limit)
    .select("fundName assetType category amc benchmark popularityRank");
}

/**
 * Search funds by name (for autocomplete)
 * @param {string} searchTerm - Partial fund name
 * @param {number} limit - Max results
 * @returns {Array} Matching funds
 */
export async function searchFunds(searchTerm, limit = 10) {
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }

  return FundReference.searchByName(searchTerm, limit);
}

/**
 * Get fund metadata for analysis
 * @param {Array<string>} fundNames - Array of fund names
 * @returns {Object} Fund metadata with distributions
 */
export async function getFundsMetadata(fundNames) {
  const validation = await validateFunds(
    fundNames.map((name) => ({ assetName: name }))
  );

  // Calculate distributions only from full coverage funds
  const fullCoverageFunds = validation.fullCoverage.map((f) => f.matchedFund);

  // Category distribution
  const categoryMap = {};
  fullCoverageFunds.forEach((fund) => {
    if (!categoryMap[fund.category]) {
      categoryMap[fund.category] = { count: 0, funds: [] };
    }
    categoryMap[fund.category].count++;
    categoryMap[fund.category].funds.push(fund.fundName);
  });

  // Asset type distribution
  const assetTypeMap = {};
  fullCoverageFunds.forEach((fund) => {
    if (!assetTypeMap[fund.assetType]) {
      assetTypeMap[fund.assetType] = { count: 0, funds: [] };
    }
    assetTypeMap[fund.assetType].count++;
    assetTypeMap[fund.assetType].funds.push(fund.fundName);
  });

  // AMC distribution
  const amcMap = {};
  fullCoverageFunds.forEach((fund) => {
    if (!amcMap[fund.amc]) {
      amcMap[fund.amc] = { count: 0, funds: [] };
    }
    amcMap[fund.amc].count++;
    amcMap[fund.amc].funds.push(fund.fundName);
  });

  return {
    validation,
    distributions: {
      byCategory: Object.entries(categoryMap)
        .map(([category, data]) => ({
          category,
          ...data,
        }))
        .sort((a, b) => b.count - a.count),

      byAssetType: Object.entries(assetTypeMap)
        .map(([assetType, data]) => ({
          assetType,
          ...data,
        }))
        .sort((a, b) => b.count - a.count),

      byAMC: Object.entries(amcMap)
        .map(([amc, data]) => ({
          amc,
          ...data,
        }))
        .sort((a, b) => b.count - a.count),
    },
  };
}

// ==================
// HELPER FUNCTIONS
// ==================

/**
 * Infer asset type from fund name
 * Used for partial coverage when fund not in reference
 */
function inferAssetTypeFromName(fundName) {
  const name = fundName.toLowerCase();

  // Equity indicators
  const equityKeywords = [
    "equity",
    "bluechip",
    "large cap",
    "largecap",
    "mid cap",
    "midcap",
    "small cap",
    "smallcap",
    "flexi cap",
    "flexicap",
    "multicap",
    "multi cap",
    "index fund",
    "nifty",
    "sensex",
    "elss",
    "tax saver",
    "growth fund",
    "value fund",
    "focused fund",
    "contra fund",
    "dividend yield",
    "opportunities fund",
    "emerging",
  ];

  if (equityKeywords.some((kw) => name.includes(kw))) {
    return "Equity";
  }

  // Debt indicators
  const debtKeywords = [
    "debt",
    "bond",
    "gilt",
    "liquid",
    "money market",
    "short term",
    "short duration",
    "medium term",
    "medium duration",
    "long term",
    "long duration",
    "corporate",
    "credit risk",
    "overnight",
    "ultra short",
    "low duration",
    "banking",
    "psu",
    "floater",
    "income fund",
    "fixed maturity",
  ];

  if (debtKeywords.some((kw) => name.includes(kw))) {
    return "Debt";
  }

  // Hybrid indicators
  const hybridKeywords = [
    "hybrid",
    "balanced",
    "aggressive",
    "conservative",
    "dynamic asset",
    "equity savings",
    "arbitrage",
    "multi asset",
    "asset allocation",
  ];

  if (hybridKeywords.some((kw) => name.includes(kw))) {
    return "Hybrid";
  }

  // Gold indicators
  const goldKeywords = ["gold", "precious metal", "silver"];

  if (goldKeywords.some((kw) => name.includes(kw))) {
    return "Gold";
  }

  return null;
}

export default {
  validateFund,
  validateFunds,
  getFundSuggestions,
  searchFunds,
  getFundsMetadata,
};
