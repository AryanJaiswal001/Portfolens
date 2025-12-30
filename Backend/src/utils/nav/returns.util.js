/**
 * Returns Calculation Utilities
 *
 * Calculate investment returns: Absolute, CAGR, XIRR
 * All functions are pure and testable - no DB/Express/UI dependencies
 *
 * Key Formulas:
 * - Absolute Return: ((Final - Initial) / Initial) × 100
 * - CAGR: ((Final / Initial)^(1/years) - 1) × 100
 * - XIRR: Internal Rate of Return for irregular cash flows
 *
 * Assumptions:
 * - NAV data is monthly (YYYY-MM format)
 * - All calculations use monthly granularity
 * - XIRR uses Newton-Raphson approximation
 */

import { monthsBetween, yearsBetween } from "./date.util.js";
import {
  normalizeNavData,
  getNavRange,
  getNavForMonth,
  getLatestNav,
  getEarliestNav,
} from "./normalizeNav.util.js";

/**
 * Calculate absolute return percentage
 *
 * Formula: ((Final Value - Initial Value) / Initial Value) × 100
 *
 * @param {number} initialValue - Starting value
 * @param {number} finalValue - Ending value
 * @returns {number} Absolute return percentage
 *
 * @example
 * calculateAbsoluteReturn(100000, 120000) // 20
 */
export function calculateAbsoluteReturn(initialValue, finalValue) {
  if (initialValue <= 0) {
    throw new Error("Initial value must be positive");
  }

  return roundTo(((finalValue - initialValue) / initialValue) * 100, 2);
}

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 *
 * Formula: ((Final / Initial)^(1/years) - 1) × 100
 *
 * @param {number} initialValue - Starting value
 * @param {number} finalValue - Ending value
 * @param {number} years - Investment period in years (can be fractional)
 * @returns {number} CAGR percentage
 *
 * @example
 * calculateCagr(100000, 161051, 5) // ~10%
 */
export function calculateCagr(initialValue, finalValue, years) {
  if (initialValue <= 0) {
    throw new Error("Initial value must be positive");
  }

  if (years <= 0) {
    throw new Error("Investment period must be positive");
  }

  // Handle edge case where final < initial (negative returns)
  if (finalValue <= 0) {
    return -100; // Complete loss
  }

  const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;

  return roundTo(cagr, 2);
}

/**
 * Calculate CAGR from NAV data over a period
 *
 * @param {Object} navData - NAV data object
 * @param {string} startMonth - Start month (YYYY-MM)
 * @param {string} endMonth - End month (YYYY-MM)
 * @returns {number} CAGR percentage
 */
export function calculateNavCagr(navData, startMonth, endMonth) {
  const normalized = normalizeNavData(navData);

  const startNav = normalized[startMonth];
  const endNav = normalized[endMonth];

  if (startNav === undefined) {
    throw new Error(`NAV not available for start month: ${startMonth}`);
  }

  if (endNav === undefined) {
    throw new Error(`NAV not available for end month: ${endMonth}`);
  }

  const years = yearsBetween(startMonth, endMonth);

  if (years <= 0) {
    return 0; // Same month or invalid range
  }

  return calculateCagr(startNav, endNav, years);
}

/**
 * Calculate trailing returns for standard periods
 *
 * @param {Object} navData - NAV data object
 * @returns {Object} Returns for 1M, 3M, 6M, 1Y periods
 */
export function calculateTrailingReturns(navData) {
  const normalized = normalizeNavData(navData);
  const { end: currentMonth } = getNavRange(navData);
  const currentNav = normalized[currentMonth];

  const periods = [
    { key: "1M", months: 1 },
    { key: "3M", months: 3 },
    { key: "6M", months: 6 },
    { key: "1Y", months: 12 },
  ];

  const returns = {};

  for (const { key, months } of periods) {
    // Calculate start month
    const currentDate = new Date(
      parseInt(currentMonth.slice(0, 4)),
      parseInt(currentMonth.slice(5, 7)) - 1,
      1
    );

    currentDate.setMonth(currentDate.getMonth() - months);

    const startYear = currentDate.getFullYear();
    const startMonthNum = currentDate.getMonth() + 1;
    const startMonth = `${startYear}-${String(startMonthNum).padStart(2, "0")}`;

    const startNav = normalized[startMonth];

    if (startNav !== undefined) {
      const absoluteReturn = calculateAbsoluteReturn(startNav, currentNav);

      // Annualize if period < 1 year
      const years = months / 12;
      const annualized =
        years < 1 ? calculateCagr(startNav, currentNav, years) : absoluteReturn;

      returns[key] = {
        startMonth,
        startNav: roundTo(startNav, 4),
        endMonth: currentMonth,
        endNav: roundTo(currentNav, 4),
        absoluteReturn,
        annualizedReturn: roundTo(annualized, 2),
      };
    } else {
      returns[key] = null;
    }
  }

  return returns;
}

/**
 * Calculate XIRR (Extended Internal Rate of Return)
 *
 * XIRR handles irregular cash flows at irregular intervals.
 * Uses Newton-Raphson method for approximation.
 *
 * Formula: Sum of (Cash Flow / (1 + rate)^(days/365)) = 0
 *
 * @param {Array<{date: Date, amount: number}>} cashFlows - Cash flows (negative = outflow, positive = inflow)
 * @param {number} [guess=0.1] - Initial guess for rate (10%)
 * @param {number} [tolerance=0.0001] - Convergence tolerance
 * @param {number} [maxIterations=100] - Maximum iterations
 * @returns {number} XIRR as percentage (e.g., 12.5 for 12.5%)
 *
 * @example
 * calculateXirr([
 *   { date: new Date("2024-01-01"), amount: -100000 },
 *   { date: new Date("2024-06-01"), amount: -100000 },
 *   { date: new Date("2024-12-01"), amount: 220000 }
 * ]) // ~20%
 */
export function calculateXirr(
  cashFlows,
  guess = 0.1,
  tolerance = 0.0001,
  maxIterations = 100
) {
  // Validate cash flows
  if (!Array.isArray(cashFlows) || cashFlows.length < 2) {
    throw new Error("XIRR requires at least 2 cash flows");
  }

  // Check for at least one positive and one negative cash flow
  const hasPositive = cashFlows.some((cf) => cf.amount > 0);
  const hasNegative = cashFlows.some((cf) => cf.amount < 0);

  if (!hasPositive || !hasNegative) {
    throw new Error("XIRR requires both positive and negative cash flows");
  }

  // Sort cash flows by date
  const sorted = [...cashFlows].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  // Get first date as base
  const baseDate = sorted[0].date;

  // Calculate years from base date for each cash flow
  const flows = sorted.map((cf) => ({
    amount: cf.amount,
    years:
      (cf.date.getTime() - baseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
  }));

  // Newton-Raphson iteration
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    // Calculate NPV and its derivative at current rate
    let npv = 0;
    let derivative = 0;

    for (const { amount, years } of flows) {
      const discountFactor = Math.pow(1 + rate, years);
      npv += amount / discountFactor;
      derivative -= (years * amount) / (discountFactor * (1 + rate));
    }

    // Check convergence
    if (Math.abs(npv) < tolerance) {
      return roundTo(rate * 100, 2);
    }

    // Update rate (prevent division by zero)
    if (Math.abs(derivative) < 1e-10) {
      break;
    }

    const newRate = rate - npv / derivative;

    // Bound the rate to prevent divergence
    if (newRate < -0.99) {
      rate = (rate + -0.99) / 2;
    } else if (newRate > 10) {
      rate = (rate + 10) / 2;
    } else {
      rate = newRate;
    }
  }

  // If we didn't converge, return best estimate with warning
  console.warn("XIRR: Max iterations reached, result may be approximate");
  return roundTo(rate * 100, 2);
}

/**
 * Approximate XIRR for monthly SIP investments
 *
 * Simplified calculation optimized for regular monthly investments.
 * Uses midpoint approximation method.
 *
 * @param {number} monthlyAmount - Monthly SIP amount
 * @param {number} totalMonths - Number of months
 * @param {number} currentValue - Current portfolio value
 * @returns {number} Approximate XIRR percentage
 */
export function approximateSipXirr(monthlyAmount, totalMonths, currentValue) {
  if (monthlyAmount <= 0 || totalMonths <= 0) {
    throw new Error("Monthly amount and total months must be positive");
  }

  const totalInvested = monthlyAmount * totalMonths;

  if (currentValue <= 0) {
    return -100; // Complete loss
  }

  // Average holding period = (n+1)/2 months for SIP
  const avgHoldingYears = (totalMonths + 1) / (2 * 12);

  // Use CAGR as approximation
  return calculateCagr(totalInvested, currentValue, avgHoldingYears);
}

/**
 * Calculate rolling returns over a period
 *
 * @param {Object} navData - NAV data object
 * @param {number} windowMonths - Rolling window in months
 * @returns {Array<{startMonth: string, endMonth: string, return: number}>}
 */
export function calculateRollingReturns(navData, windowMonths) {
  const normalized = normalizeNavData(navData);
  const months = Object.keys(normalized).sort();

  const results = [];

  for (let i = windowMonths; i < months.length; i++) {
    const startMonth = months[i - windowMonths];
    const endMonth = months[i];

    const startNav = normalized[startMonth];
    const endNav = normalized[endMonth];

    const absoluteReturn = calculateAbsoluteReturn(startNav, endNav);

    results.push({
      startMonth,
      endMonth,
      return: absoluteReturn,
    });
  }

  return results;
}

/**
 * Calculate return statistics (min, max, avg, stddev)
 *
 * @param {Array<number>} returns - Array of return values
 * @returns {Object} Statistics
 */
export function calculateReturnStatistics(returns) {
  if (!Array.isArray(returns) || returns.length === 0) {
    throw new Error("Returns must be a non-empty array");
  }

  const n = returns.length;
  const sum = returns.reduce((a, b) => a + b, 0);
  const avg = sum / n;

  const sorted = [...returns].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[n - 1];
  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];

  // Standard deviation
  const squaredDiffs = returns.map((r) => Math.pow(r - avg, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / n;
  const stdDev = Math.sqrt(variance);

  return {
    count: n,
    min: roundTo(min, 2),
    max: roundTo(max, 2),
    average: roundTo(avg, 2),
    median: roundTo(median, 2),
    standardDeviation: roundTo(stdDev, 2),
  };
}

/**
 * Calculate Sharpe Ratio approximation
 *
 * Sharpe Ratio = (Return - Risk-Free Rate) / Standard Deviation
 *
 * @param {number} returnPercent - Portfolio return percentage
 * @param {number} riskFreeRate - Risk-free rate percentage (default 6% for India)
 * @param {number} standardDeviation - Standard deviation of returns
 * @returns {number} Sharpe ratio
 */
export function calculateSharpeRatio(
  returnPercent,
  riskFreeRate = 6,
  standardDeviation
) {
  if (standardDeviation <= 0) {
    return 0; // Cannot calculate with zero volatility
  }

  return roundTo((returnPercent - riskFreeRate) / standardDeviation, 2);
}

/**
 * Compare returns of multiple investments
 *
 * @param {Array<{name: string, initialValue: number, finalValue: number, years: number}>} investments
 * @returns {Array} Investments sorted by CAGR with comparison data
 */
export function compareInvestments(investments) {
  if (!Array.isArray(investments) || investments.length === 0) {
    throw new Error("Investments must be a non-empty array");
  }

  const results = investments.map(
    ({ name, initialValue, finalValue, years }) => ({
      name,
      initialValue: roundTo(initialValue, 2),
      finalValue: roundTo(finalValue, 2),
      absoluteReturn: calculateAbsoluteReturn(initialValue, finalValue),
      cagr: calculateCagr(initialValue, finalValue, years),
      years: roundTo(years, 2),
    })
  );

  // Sort by CAGR descending
  results.sort((a, b) => b.cagr - a.cagr);

  // Add rank
  results.forEach((r, i) => {
    r.rank = i + 1;
  });

  return results;
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
  calculateAbsoluteReturn,
  calculateCagr,
  calculateNavCagr,
  calculateTrailingReturns,
  calculateXirr,
  approximateSipXirr,
  calculateRollingReturns,
  calculateReturnStatistics,
  calculateSharpeRatio,
  compareInvestments,
};
