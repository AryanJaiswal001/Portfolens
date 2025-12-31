/**
 * Diversification Analysis Service
 *
 * Analyzes portfolio diversification using:
 * - FundReference: Fund metadata (category, asset type)
 * - HoldingTemplate: Category-level sector/market cap exposure
 *
 * Outputs:
 * - Asset allocation breakdown
 * - Category distribution
 * - Sector exposure (aggregated)
 * - Market cap exposure
 * - Overlap/concentration warnings
 *
 * ⚠️ This service does NOT use NAV data
 * ⚠️ No Express/controller logic here
 */

import FundReference from "../../models/FundReferenceModel.js";
import HoldingTemplate from "../../models/HoldingTemplateModel.js";

/**
 * Analyze portfolio diversification
 *
 * @param {Array} funds - Portfolio funds array from portfolio model
 * @param {Object} fundMetadata - Map of fundName -> FundReference data
 * @param {Object} templates - Map of templateKey -> HoldingTemplate data
 * @returns {Object} Diversification analysis results
 */
export function analyzeDiversification(funds, fundMetadata, templates) {
  const results = {
    assetAllocation: {},
    categoryDistribution: {},
    sectorExposure: {},
    marketCapExposure: {
      LargeCap: 0,
      MidCap: 0,
      SmallCap: 0,
    },
    fundCount: funds.length,
    warnings: [],
    concentrationRisks: [],
  };

  // Calculate total invested for weighting
  let totalInvested = 0;
  const fundInvestments = [];

  for (const fund of funds) {
    const invested = calculateFundInvestment(fund);
    totalInvested += invested;
    fundInvestments.push({
      ...fund,
      invested,
    });
  }

  if (totalInvested === 0) {
    results.warnings.push("No investments found in portfolio");
    return results;
  }

  // Process each fund
  for (const fund of fundInvestments) {
    const weight = fund.invested / totalInvested;
    const meta = fundMetadata[fund.assetName];

    if (!meta) {
      // Fund not in reference data - use generic allocation
      addToAllocation(results.assetAllocation, "Other", weight);
      addToAllocation(results.categoryDistribution, "Unclassified", weight);
      continue;
    }

    // Asset allocation
    addToAllocation(results.assetAllocation, meta.assetType, weight);

    // Category distribution
    addToAllocation(results.categoryDistribution, meta.category, weight);

    // Get holding template for sector/market cap exposure
    const template = meta.holdingTemplateKey
      ? templates[meta.holdingTemplateKey]
      : null;

    if (template) {
      // Aggregate sector exposure
      if (template.sectorExposure) {
        for (const [sector, exposure] of Object.entries(
          template.sectorExposure
        )) {
          const weightedExposure = (exposure / 100) * weight;
          addToAllocation(results.sectorExposure, sector, weightedExposure);
        }
      }

      // Aggregate market cap exposure
      if (template.marketCapExposure) {
        results.marketCapExposure.LargeCap +=
          ((template.marketCapExposure.LargeCap || 0) / 100) * weight;
        results.marketCapExposure.MidCap +=
          ((template.marketCapExposure.MidCap || 0) / 100) * weight;
        results.marketCapExposure.SmallCap +=
          ((template.marketCapExposure.SmallCap || 0) / 100) * weight;
      }
    }
  }

  // Convert to percentages
  results.assetAllocation = toPercentages(results.assetAllocation);
  results.categoryDistribution = toPercentages(results.categoryDistribution);
  results.sectorExposure = toPercentages(results.sectorExposure);
  results.marketCapExposure = {
    LargeCap: roundTo(results.marketCapExposure.LargeCap * 100, 2),
    MidCap: roundTo(results.marketCapExposure.MidCap * 100, 2),
    SmallCap: roundTo(results.marketCapExposure.SmallCap * 100, 2),
  };

  // Analyze for warnings and concentration risks
  analyzeConcentrationRisks(results, fundInvestments, totalInvested);

  return results;
}

/**
 * Calculate total investment for a fund (SIPs + Lumpsums)
 * This is a simplified calculation for weighting purposes
 */
function calculateFundInvestment(fund) {
  let total = 0;

  // Sum all SIP contributions
  if (fund.sips && fund.sips.length > 0) {
    for (const sip of fund.sips) {
      const months = calculateSipMonths(sip);
      total += sip.amount * months;
    }
  }

  // Sum all lumpsums
  if (fund.lumpsums && fund.lumpsums.length > 0) {
    for (const lumpsum of fund.lumpsums) {
      total += lumpsum.amount;
    }
  }

  return total;
}

/**
 * Calculate number of SIP months
 * Uses NAV cutoff date (Dec 2024) for ongoing SIPs
 */
function calculateSipMonths(sip) {
  const NAV_CUTOFF_YEAR = 2024;
  const NAV_CUTOFF_MONTH = 12;

  const startDate = new Date(sip.startYear, sip.startMonth - 1, 1);

  let endDate;
  if (sip.isOngoing) {
    endDate = new Date(NAV_CUTOFF_YEAR, NAV_CUTOFF_MONTH - 1, 1);
  } else {
    endDate = new Date(sip.endYear, sip.endMonth - 1, 1);
  }

  // Calculate months between dates
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth()) +
    1;

  return Math.max(0, months);
}

/**
 * Add value to allocation object
 */
function addToAllocation(allocation, key, value) {
  if (!allocation[key]) {
    allocation[key] = 0;
  }
  allocation[key] += value;
}

/**
 * Convert raw weights to percentages
 */
function toPercentages(allocation) {
  const result = {};
  for (const [key, value] of Object.entries(allocation)) {
    result[key] = roundTo(value * 100, 2);
  }
  return result;
}

/**
 * Analyze portfolio for concentration risks
 */
function analyzeConcentrationRisks(results, fundInvestments, totalInvested) {
  // Check for over-concentration in single asset type
  for (const [assetType, percentage] of Object.entries(
    results.assetAllocation
  )) {
    if (percentage > 80) {
      results.warnings.push(
        `High concentration in ${assetType} (${percentage}%)`
      );
      results.concentrationRisks.push({
        type: "asset_concentration",
        asset: assetType,
        percentage,
        severity: "high",
      });
    } else if (percentage > 60) {
      results.concentrationRisks.push({
        type: "asset_concentration",
        asset: assetType,
        percentage,
        severity: "medium",
      });
    }
  }

  // Check for over-concentration in single category
  for (const [category, percentage] of Object.entries(
    results.categoryDistribution
  )) {
    if (percentage > 50) {
      results.warnings.push(
        `High concentration in ${category} category (${percentage}%)`
      );
      results.concentrationRisks.push({
        type: "category_concentration",
        category,
        percentage,
        severity: percentage > 70 ? "high" : "medium",
      });
    }
  }

  // Check for over-concentration in single sector
  for (const [sector, percentage] of Object.entries(results.sectorExposure)) {
    if (percentage > 30) {
      results.concentrationRisks.push({
        type: "sector_concentration",
        sector,
        percentage,
        severity: percentage > 40 ? "high" : "medium",
      });
    }
  }

  // Check for single fund dominance
  for (const fund of fundInvestments) {
    const fundPercentage = (fund.invested / totalInvested) * 100;
    if (fundPercentage > 40) {
      results.warnings.push(
        `Single fund ${fund.assetName} represents ${roundTo(
          fundPercentage,
          1
        )}% of portfolio`
      );
      results.concentrationRisks.push({
        type: "single_fund_dominance",
        fundName: fund.assetName,
        percentage: roundTo(fundPercentage, 1),
        severity: fundPercentage > 50 ? "high" : "medium",
      });
    }
  }

  // Check for under-diversification
  if (results.fundCount < 3) {
    results.warnings.push(
      "Portfolio has fewer than 3 funds - consider diversifying"
    );
  }
}

/**
 * Round number to decimal places
 */
function roundTo(value, decimals) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Fetch fund metadata for portfolio funds
 * Returns map of fundName -> FundReference data
 */
export async function fetchFundMetadata(fundNames) {
  const funds = await FundReference.find({
    fundName: { $in: fundNames },
  }).lean();

  const metadata = {};
  for (const fund of funds) {
    metadata[fund.fundName] = fund;
  }

  return metadata;
}

/**
 * Fetch holding templates
 * Returns map of templateKey -> HoldingTemplate data
 */
export async function fetchHoldingTemplates() {
  const templates = await HoldingTemplate.find({ isActive: true }).lean();

  const templateMap = {};
  for (const template of templates) {
    // Convert Map to plain object for sectorExposure
    templateMap[template.templateKey] = {
      ...template,
      sectorExposure:
        template.sectorExposure instanceof Map
          ? Object.fromEntries(template.sectorExposure)
          : template.sectorExposure,
    };
  }

  return templateMap;
}

export default {
  analyzeDiversification,
  fetchFundMetadata,
  fetchHoldingTemplates,
};
