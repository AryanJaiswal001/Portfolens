/**
 * Investment Value Calculation Utilities
 *
 * Calculate current value of investments based on NAV history
 * Supports: Lumpsum, SIP (monthly), and mixed investments
 *
 * Key Formulas:
 * - Units = Amount / NAV at purchase date
 * - Current Value = Total Units × Current NAV
 *
 * Assumptions:
 * - All investments are made on the 1st of each month
 * - NAV data is monthly (YYYY-MM format)
 * - Reinvestment of dividends is reflected in NAV (growth option)
 *
 * NO database queries
 * NO external dependencies
 * NO Express/UI logic
 */

import {
  monthYearToKey,
  generateMonthRange,
  monthsBetween,
  addMonths,
} from "./date.util.js";
import {
  normalizeNavData,
  fillMissingNavData,
  getLatestNav,
  getNavRange,
} from "./normalizeNav.util.js";

/**
 * Calculate current value of a lumpsum investment
 *
 * Formula: Current Value = (Amount / NAV at purchase) × Current NAV
 *
 * @param {number} amount - Investment amount
 * @param {string} purchaseMonth - Month of purchase (YYYY-MM)
 * @param {Object} navData - NAV data object
 * @returns {Object} Investment details
 *
 * @example
 * calculateLumpsumValue(100000, "2024-01", {
 *   "2024-01": 100,
 *   "2024-12": 120
 * })
 * // {
 * //   investedAmount: 100000,
 * //   unitsPurchased: 1000,
 * //   purchaseNav: 100,
 * //   currentNav: 120,
 * //   currentValue: 120000,
 * //   absoluteReturn: 20000,
 * //   absoluteReturnPercent: 20
 * // }
 */
export function calculateLumpsumValue(amount, purchaseMonth, navData) {
  // Validate inputs
  if (!amount || amount <= 0) {
    throw new Error("Investment amount must be a positive number");
  }

  if (!purchaseMonth || !/^\d{4}-\d{2}$/.test(purchaseMonth)) {
    throw new Error("Purchase month must be in YYYY-MM format");
  }

  const normalized = normalizeNavData(navData);
  const { end: currentMonth } = getNavRange(navData);

  // Get NAV at purchase date
  // If exact month not available, try to fill/interpolate
  let purchaseNav = normalized[purchaseMonth];

  if (purchaseNav === undefined) {
    // Try to fill missing data
    const filled = fillMissingNavData(normalized, purchaseMonth, currentMonth);
    purchaseNav = filled[purchaseMonth];

    if (purchaseNav === undefined) {
      throw new Error(`NAV not available for purchase month: ${purchaseMonth}`);
    }
  }

  const currentNav = normalized[currentMonth];

  // Calculate units purchased
  const unitsPurchased = amount / purchaseNav;

  // Calculate current value
  const currentValue = unitsPurchased * currentNav;

  // Calculate returns
  const absoluteReturn = currentValue - amount;
  const absoluteReturnPercent = (absoluteReturn / amount) * 100;

  return {
    investedAmount: amount,
    unitsPurchased: roundTo(unitsPurchased, 4),
    purchaseMonth,
    purchaseNav: roundTo(purchaseNav, 4),
    currentMonth,
    currentNav: roundTo(currentNav, 4),
    currentValue: roundTo(currentValue, 2),
    absoluteReturn: roundTo(absoluteReturn, 2),
    absoluteReturnPercent: roundTo(absoluteReturnPercent, 2),
  };
}

/**
 * Calculate current value of SIP investments
 *
 * SIP = Systematic Investment Plan (monthly fixed amount)
 *
 * Each monthly installment buys units at that month's NAV.
 * Total value = Sum of all units × Current NAV
 *
 * @param {number} monthlyAmount - Monthly SIP amount
 * @param {string} startMonth - First SIP month (YYYY-MM)
 * @param {Object} navData - NAV data object
 * @param {string} [endMonth] - Last SIP month (defaults to latest available)
 * @returns {Object} SIP investment details
 *
 * @example
 * calculateSipValue(10000, "2024-01", navData, "2024-06")
 */
export function calculateSipValue(
  monthlyAmount,
  startMonth,
  navData,
  endMonth = null
) {
  // Validate inputs
  if (!monthlyAmount || monthlyAmount <= 0) {
    throw new Error("Monthly SIP amount must be a positive number");
  }

  if (!startMonth || !/^\d{4}-\d{2}$/.test(startMonth)) {
    throw new Error("Start month must be in YYYY-MM format");
  }

  const normalized = normalizeNavData(navData);
  const { end: latestMonth } = getNavRange(navData);
  const sipEndMonth = endMonth || latestMonth;

  // Validate end month is not before start month
  if (sipEndMonth < startMonth) {
    throw new Error("End month cannot be before start month");
  }

  // Generate SIP months
  const sipMonths = generateMonthRange(startMonth, sipEndMonth);

  // Fill any missing NAV data
  const filled = fillMissingNavData(normalized, startMonth, latestMonth);

  const currentNav = filled[latestMonth];

  // Calculate units for each installment
  const installments = [];
  let totalUnits = 0;
  let totalInvested = 0;

  for (const month of sipMonths) {
    const nav = filled[month];

    if (nav === undefined) {
      throw new Error(`NAV not available for month: ${month}`);
    }

    const units = monthlyAmount / nav;
    totalUnits += units;
    totalInvested += monthlyAmount;

    installments.push({
      month,
      amount: monthlyAmount,
      nav: roundTo(nav, 4),
      units: roundTo(units, 4),
    });
  }

  // Calculate current value
  const currentValue = totalUnits * currentNav;
  const absoluteReturn = currentValue - totalInvested;
  const absoluteReturnPercent = (absoluteReturn / totalInvested) * 100;

  // Calculate average NAV (cost basis)
  const averageNav = totalInvested / totalUnits;

  return {
    monthlyAmount,
    startMonth,
    endMonth: sipEndMonth,
    installmentCount: sipMonths.length,
    totalInvested: roundTo(totalInvested, 2),
    totalUnits: roundTo(totalUnits, 4),
    averageNav: roundTo(averageNav, 4),
    currentMonth: latestMonth,
    currentNav: roundTo(currentNav, 4),
    currentValue: roundTo(currentValue, 2),
    absoluteReturn: roundTo(absoluteReturn, 2),
    absoluteReturnPercent: roundTo(absoluteReturnPercent, 2),
    installments,
  };
}

/**
 * Calculate value of multiple lumpsum investments
 *
 * @param {Array<{amount: number, month: string}>} lumpsums - Array of lumpsum investments
 * @param {Object} navData - NAV data object
 * @returns {Object} Combined lumpsum details
 */
export function calculateMultipleLumpsums(lumpsums, navData) {
  if (!Array.isArray(lumpsums) || lumpsums.length === 0) {
    throw new Error("Lumpsums must be a non-empty array");
  }

  const normalized = normalizeNavData(navData);
  const { end: currentMonth } = getNavRange(navData);
  const currentNav = normalized[currentMonth];

  let totalInvested = 0;
  let totalUnits = 0;
  const investments = [];

  for (const { amount, month } of lumpsums) {
    const result = calculateLumpsumValue(amount, month, navData);

    totalInvested += amount;
    totalUnits += result.unitsPurchased;

    investments.push({
      amount,
      month,
      nav: result.purchaseNav,
      units: result.unitsPurchased,
    });
  }

  const currentValue = totalUnits * currentNav;
  const absoluteReturn = currentValue - totalInvested;
  const absoluteReturnPercent = (absoluteReturn / totalInvested) * 100;
  const averageNav = totalInvested / totalUnits;

  return {
    investmentCount: lumpsums.length,
    totalInvested: roundTo(totalInvested, 2),
    totalUnits: roundTo(totalUnits, 4),
    averageNav: roundTo(averageNav, 4),
    currentMonth,
    currentNav: roundTo(currentNav, 4),
    currentValue: roundTo(currentValue, 2),
    absoluteReturn: roundTo(absoluteReturn, 2),
    absoluteReturnPercent: roundTo(absoluteReturnPercent, 2),
    investments,
  };
}

/**
 * Calculate combined value of SIP + Lumpsum investments
 *
 * @param {Object} sipConfig - { monthlyAmount, startMonth, endMonth? }
 * @param {Array<{amount: number, month: string}>} lumpsums - Lumpsum investments
 * @param {Object} navData - NAV data object
 * @returns {Object} Combined investment details
 */
export function calculateCombinedValue(sipConfig, lumpsums, navData) {
  const normalized = normalizeNavData(navData);
  const { end: currentMonth } = getNavRange(navData);
  const currentNav = normalized[currentMonth];

  let sipResult = null;
  let lumpsumResult = null;
  let totalInvested = 0;
  let totalUnits = 0;

  // Calculate SIP if provided
  if (sipConfig && sipConfig.monthlyAmount > 0) {
    sipResult = calculateSipValue(
      sipConfig.monthlyAmount,
      sipConfig.startMonth,
      navData,
      sipConfig.endMonth
    );
    totalInvested += sipResult.totalInvested;
    totalUnits += sipResult.totalUnits;
  }

  // Calculate lumpsums if provided
  if (lumpsums && lumpsums.length > 0) {
    lumpsumResult = calculateMultipleLumpsums(lumpsums, navData);
    totalInvested += lumpsumResult.totalInvested;
    totalUnits += lumpsumResult.totalUnits;
  }

  const currentValue = totalUnits * currentNav;
  const absoluteReturn = currentValue - totalInvested;
  const absoluteReturnPercent =
    totalInvested > 0 ? (absoluteReturn / totalInvested) * 100 : 0;

  return {
    sip: sipResult,
    lumpsums: lumpsumResult,
    combined: {
      totalInvested: roundTo(totalInvested, 2),
      totalUnits: roundTo(totalUnits, 4),
      currentMonth,
      currentNav: roundTo(currentNav, 4),
      currentValue: roundTo(currentValue, 2),
      absoluteReturn: roundTo(absoluteReturn, 2),
      absoluteReturnPercent: roundTo(absoluteReturnPercent, 2),
    },
  };
}

/**
 * Generate cash flows for XIRR calculation
 *
 * Returns array of { date, amount } where:
 * - Investments are negative
 * - Current value is positive
 *
 * @param {Object} sipConfig - SIP configuration (optional)
 * @param {Array} lumpsums - Lumpsum investments (optional)
 * @param {Object} navData - NAV data
 * @returns {Array<{date: Date, amount: number}>} Cash flows
 */
export function generateCashFlows(sipConfig, lumpsums, navData) {
  const normalized = normalizeNavData(navData);
  const { end: currentMonth } = getNavRange(navData);

  const cashFlows = [];

  // Add SIP cash flows
  if (sipConfig && sipConfig.monthlyAmount > 0) {
    const sipMonths = generateMonthRange(
      sipConfig.startMonth,
      sipConfig.endMonth || currentMonth
    );

    for (const month of sipMonths) {
      cashFlows.push({
        date: new Date(
          parseInt(month.slice(0, 4)),
          parseInt(month.slice(5, 7)) - 1,
          1
        ),
        amount: -sipConfig.monthlyAmount, // Negative for outflow
      });
    }
  }

  // Add lumpsum cash flows
  if (lumpsums && lumpsums.length > 0) {
    for (const { amount, month } of lumpsums) {
      cashFlows.push({
        date: new Date(
          parseInt(month.slice(0, 4)),
          parseInt(month.slice(5, 7)) - 1,
          1
        ),
        amount: -amount, // Negative for outflow
      });
    }
  }

  // Add current value as positive cash flow (final inflow)
  const combinedValue = calculateCombinedValue(sipConfig, lumpsums, navData);
  cashFlows.push({
    date: new Date(
      parseInt(currentMonth.slice(0, 4)),
      parseInt(currentMonth.slice(5, 7)) - 1,
      1
    ),
    amount: combinedValue.combined.currentValue, // Positive for inflow
  });

  // Sort by date
  cashFlows.sort((a, b) => a.date.getTime() - b.date.getTime());

  return cashFlows;
}

/**
 * Round number to specified decimal places
 * @param {number} value - Value to round
 * @param {number} decimals - Decimal places
 * @returns {number} Rounded value
 */
function roundTo(value, decimals) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

export default {
  calculateLumpsumValue,
  calculateSipValue,
  calculateMultipleLumpsums,
  calculateCombinedValue,
  generateCashFlows,
};
