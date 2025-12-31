/**
 * Performance Analysis Service
 *
 * Calculates investment performance using:
 * - FundNAV: Historical NAV data
 * - NAV utilities: Returns, value calculations
 *
 * Outputs:
 * - Total invested
 * - Current value
 * - Absolute return
 * - CAGR
 * - XIRR
 * - Per-fund breakdown
 *
 * ⚠️ Each SIP entry is treated as an independent cashflow stream
 * ⚠️ Uses NAV cutoff date (Dec 2024) for calculations
 * ⚠️ No Express/controller logic here
 */

import FundNAV from "../../models/FundNAVModel.js";
import {
  monthYearToKey,
  generateMonthRange,
  normalizeNavData,
  fillMissingNavData,
  getNavRange,
  calculateXirr,
  calculateCagr,
  calculateAbsoluteReturn,
} from "../../utils/nav/index.js";

// NAV data cutoff - all calculations use this as "current" date
const NAV_CUTOFF_YEAR = 2024;
const NAV_CUTOFF_MONTH = 12;
export const NAV_CUTOFF_KEY = "2024-12";
export const NAV_START_KEY = "2024-01";

/**
 * Analyze portfolio performance
 *
 * @param {Array} funds - Portfolio funds array
 * @param {Object} navDataMap - Map of fundName -> NAV data object
 * @returns {Object} Performance analysis results
 */
export function analyzePerformance(funds, navDataMap) {
  const results = {
    summary: {
      totalInvested: 0,
      currentValue: 0,
      absoluteReturn: 0,
      absoluteReturnPercent: 0,
      xirr: null,
      cagr: null,
    },
    fundPerformance: [],
    cashflows: [],
    dataAsOf: `Dec ${NAV_CUTOFF_YEAR}`,
    periodStart: `Jan ${NAV_CUTOFF_YEAR}`,
    warnings: [],
  };

  // Collect all cashflows for portfolio-level XIRR
  const allCashflows = [];

  // Process each fund
  for (const fund of funds) {
    const navData = navDataMap[fund.assetName];

    if (!navData || Object.keys(navData).length === 0) {
      results.warnings.push(`NAV data not available for: ${fund.assetName}`);
      continue;
    }

    const fundResult = calculateFundPerformance(fund, navData);

    if (fundResult) {
      results.fundPerformance.push(fundResult);
      results.summary.totalInvested += fundResult.totalInvested;
      results.summary.currentValue += fundResult.currentValue;
      allCashflows.push(...fundResult.cashflows);
    }
  }

  // Calculate portfolio-level metrics
  if (results.summary.totalInvested > 0) {
    results.summary.absoluteReturn =
      results.summary.currentValue - results.summary.totalInvested;
    results.summary.absoluteReturnPercent = roundTo(
      calculateAbsoluteReturn(
        results.summary.totalInvested,
        results.summary.currentValue
      ),
      2
    );

    // Calculate portfolio XIRR
    if (allCashflows.length >= 2) {
      try {
        // Add final value as positive cashflow
        const finalCashflow = {
          date: new Date(NAV_CUTOFF_YEAR, NAV_CUTOFF_MONTH - 1, 1),
          amount: results.summary.currentValue,
        };

        const xirrCashflows = [
          ...allCashflows.map((cf) => ({
            ...cf,
            amount: -Math.abs(cf.amount),
          })),
          finalCashflow,
        ];

        results.summary.xirr = calculateXirr(xirrCashflows);
      } catch (error) {
        results.warnings.push(`XIRR calculation error: ${error.message}`);
      }
    }

    // Calculate CAGR (simplified - from earliest investment)
    const earliestCashflow = allCashflows.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    )[0];

    if (earliestCashflow) {
      const yearsElapsed =
        (new Date(NAV_CUTOFF_YEAR, NAV_CUTOFF_MONTH - 1, 1).getTime() -
          earliestCashflow.date.getTime()) /
        (365.25 * 24 * 60 * 60 * 1000);

      if (yearsElapsed > 0) {
        results.summary.cagr = roundTo(
          calculateCagr(
            results.summary.totalInvested,
            results.summary.currentValue,
            yearsElapsed
          ),
          2
        );
      }
    }
  }

  // Round summary values
  results.summary.totalInvested = roundTo(results.summary.totalInvested, 2);
  results.summary.currentValue = roundTo(results.summary.currentValue, 2);
  results.summary.absoluteReturn = roundTo(results.summary.absoluteReturn, 2);

  // Store cashflows for reference
  results.cashflows = allCashflows.map((cf) => ({
    date: cf.date.toISOString().slice(0, 7),
    amount: cf.amount,
    fundName: cf.fundName,
    type: cf.type,
  }));

  return results;
}

/**
 * Calculate performance for a single fund
 *
 * @param {Object} fund - Fund object from portfolio
 * @param {Object} navData - NAV data for this fund
 * @returns {Object} Fund performance metrics
 */
function calculateFundPerformance(fund, navData) {
  const normalized = normalizeNavData(navData);
  const filled = fillMissingNavData(normalized, NAV_START_KEY, NAV_CUTOFF_KEY);

  const currentNav = filled[NAV_CUTOFF_KEY];
  if (!currentNav) {
    return null;
  }

  let totalInvested = 0;
  let totalUnits = 0;
  const cashflows = [];
  const sipDetails = [];
  const lumpsumDetails = [];

  // Process all SIPs
  if (fund.sips && fund.sips.length > 0) {
    for (const sip of fund.sips) {
      const sipResult = processSip(sip, filled, fund.assetName);
      if (sipResult) {
        totalInvested += sipResult.invested;
        totalUnits += sipResult.units;
        cashflows.push(...sipResult.cashflows);
        sipDetails.push(sipResult.details);
      }
    }
  }

  // Process all lumpsums
  if (fund.lumpsums && fund.lumpsums.length > 0) {
    for (const lumpsum of fund.lumpsums) {
      const lumpsumResult = processLumpsum(lumpsum, filled, fund.assetName);
      if (lumpsumResult) {
        totalInvested += lumpsumResult.invested;
        totalUnits += lumpsumResult.units;
        cashflows.push(...lumpsumResult.cashflows);
        lumpsumDetails.push(lumpsumResult.details);
      }
    }
  }

  if (totalInvested === 0) {
    return null;
  }

  const currentValue = totalUnits * currentNav;
  const absoluteReturn = currentValue - totalInvested;
  const absoluteReturnPercent = (absoluteReturn / totalInvested) * 100;

  // Calculate fund-level XIRR
  let xirr = null;
  if (cashflows.length >= 1) {
    try {
      const xirrCashflows = [
        ...cashflows.map((cf) => ({ ...cf, amount: -Math.abs(cf.amount) })),
        {
          date: new Date(NAV_CUTOFF_YEAR, NAV_CUTOFF_MONTH - 1, 1),
          amount: currentValue,
        },
      ];
      xirr = calculateXirr(xirrCashflows);
    } catch {
      // XIRR calculation failed
    }
  }

  return {
    fundName: fund.assetName,
    assetType: fund.assetType,
    totalInvested: roundTo(totalInvested, 2),
    currentValue: roundTo(currentValue, 2),
    totalUnits: roundTo(totalUnits, 4),
    currentNav: roundTo(currentNav, 4),
    absoluteReturn: roundTo(absoluteReturn, 2),
    absoluteReturnPercent: roundTo(absoluteReturnPercent, 2),
    xirr,
    sipCount: sipDetails.length,
    lumpsumCount: lumpsumDetails.length,
    sips: sipDetails,
    lumpsums: lumpsumDetails,
    cashflows,
  };
}

/**
 * Process a single SIP entry
 *
 * @param {Object} sip - SIP entry from portfolio
 * @param {Object} navData - Filled NAV data
 * @param {string} fundName - Fund name for tracking
 * @returns {Object} SIP processing result
 */
function processSip(sip, navData, fundName) {
  const startKey = monthYearToKey(sip.startYear, sip.startMonth);

  // Determine end date
  let endKey;
  if (sip.isOngoing) {
    endKey = NAV_CUTOFF_KEY;
  } else {
    endKey = monthYearToKey(sip.endYear, sip.endMonth);
    // Ensure end doesn't exceed cutoff
    if (endKey > NAV_CUTOFF_KEY) {
      endKey = NAV_CUTOFF_KEY;
    }
  }

  // Ensure start is within NAV range
  if (startKey > NAV_CUTOFF_KEY) {
    return null; // SIP hasn't started yet within our data range
  }

  // Adjust start if before NAV data start
  const effectiveStart = startKey < NAV_START_KEY ? NAV_START_KEY : startKey;

  // Generate months for SIP
  const sipMonths = generateMonthRange(effectiveStart, endKey);

  let invested = 0;
  let units = 0;
  const cashflows = [];
  const installments = [];

  for (const month of sipMonths) {
    const nav = navData[month];
    if (nav && nav > 0) {
      const monthUnits = sip.amount / nav;
      invested += sip.amount;
      units += monthUnits;

      cashflows.push({
        date: new Date(
          parseInt(month.slice(0, 4)),
          parseInt(month.slice(5, 7)) - 1,
          1
        ),
        amount: sip.amount,
        fundName,
        type: "sip",
      });

      installments.push({
        month,
        amount: sip.amount,
        nav: roundTo(nav, 4),
        units: roundTo(monthUnits, 4),
      });
    }
  }

  return {
    invested,
    units,
    cashflows,
    details: {
      amount: sip.amount,
      startMonth: startKey,
      endMonth: endKey,
      isOngoing: sip.isOngoing,
      installmentCount: installments.length,
      totalInvested: roundTo(invested, 2),
      unitsAcquired: roundTo(units, 4),
    },
  };
}

/**
 * Process a single lumpsum entry
 *
 * @param {Object} lumpsum - Lumpsum entry from portfolio
 * @param {Object} navData - Filled NAV data
 * @param {string} fundName - Fund name for tracking
 * @returns {Object} Lumpsum processing result
 */
function processLumpsum(lumpsum, navData, fundName) {
  const monthKey = monthYearToKey(lumpsum.year, lumpsum.month);

  // Ensure within NAV range
  if (monthKey > NAV_CUTOFF_KEY) {
    return null; // Investment after cutoff
  }

  // Adjust if before NAV data start
  const effectiveMonth = monthKey < NAV_START_KEY ? NAV_START_KEY : monthKey;

  const nav = navData[effectiveMonth];
  if (!nav || nav <= 0) {
    return null;
  }

  const units = lumpsum.amount / nav;

  return {
    invested: lumpsum.amount,
    units,
    cashflows: [
      {
        date: new Date(
          parseInt(effectiveMonth.slice(0, 4)),
          parseInt(effectiveMonth.slice(5, 7)) - 1,
          1
        ),
        amount: lumpsum.amount,
        fundName,
        type: "lumpsum",
      },
    ],
    details: {
      month: monthKey,
      amount: lumpsum.amount,
      nav: roundTo(nav, 4),
      unitsAcquired: roundTo(units, 4),
    },
  };
}

/**
 * Round number to decimal places
 */
function roundTo(value, decimals) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Fetch NAV data for multiple funds
 * Returns map of fundName -> { date: nav }
 */
export async function fetchNavData(fundNames) {
  return FundNAV.getMultipleFundNavs(fundNames);
}

export default {
  analyzePerformance,
  fetchNavData,
  NAV_CUTOFF_KEY,
  NAV_START_KEY,
};
