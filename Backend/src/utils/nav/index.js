/**
 * NAV Utilities - Index
 *
 * Central export for all NAV calculation utilities
 *
 * Modules:
 * - date.util.js: Date manipulation for monthly NAV keys
 * - normalizeNav.util.js: NAV data normalization and validation
 * - investmentValue.util.js: Investment value calculations (lumpsum, SIP)
 * - returns.util.js: Return calculations (absolute, CAGR, XIRR)
 */

// Date utilities
export {
  dateToKey,
  keyToDate,
  monthYearToKey,
  parseKey,
  monthsBetween,
  generateMonthRange,
  addMonths,
  getLastNMonths,
  yearsBetween,
  isKeyInRange,
  getCurrentMonthKey,
  compareKeys,
} from "./date.util.js";

// NAV normalization utilities
export {
  normalizeNavData,
  navToSortedArray,
  getNavRange,
  fillMissingNavData,
  extractMonths,
  getNavForMonth,
  getLatestNav,
  getEarliestNav,
  validateNavCoverage,
  mergeNavData,
} from "./normalizeNav.util.js";

// Investment value utilities
export {
  calculateLumpsumValue,
  calculateSipValue,
  calculateMultipleLumpsums,
  calculateCombinedValue,
  generateCashFlows,
} from "./investmentValue.util.js";

// Returns calculation utilities
export {
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
} from "./returns.util.js";
