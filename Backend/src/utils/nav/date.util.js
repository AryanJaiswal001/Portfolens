/**
 * Date Utility Functions for NAV Calculations
 *
 * Pure utility functions for date manipulation
 * Used across NAV-based calculations
 *
 * Key Format: "YYYY-MM" (e.g., "2024-12")
 *
 * NO database queries
 * NO external dependencies
 * NO Express/UI logic
 */

/**
 * Convert Date object to YYYY-MM key format
 * @param {Date} date - JavaScript Date object
 * @returns {string} Key in "YYYY-MM" format
 *
 * @example
 * dateToKey(new Date(2024, 11, 15)) // "2024-12"
 */
export function dateToKey(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Convert YYYY-MM key to Date object (first day of month)
 * @param {string} key - Key in "YYYY-MM" format
 * @returns {Date} Date object for first day of that month
 *
 * @example
 * keyToDate("2024-12") // Date(2024, 11, 1)
 */
export function keyToDate(key) {
  if (!key || typeof key !== "string" || !/^\d{4}-\d{2}$/.test(key)) {
    throw new Error(`Invalid key format: ${key}. Expected "YYYY-MM"`);
  }

  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

/**
 * Convert month and year to YYYY-MM key
 * @param {number} year - Year (e.g., 2024)
 * @param {number} month - Month (1-12)
 * @returns {string} Key in "YYYY-MM" format
 *
 * @example
 * monthYearToKey(2024, 12) // "2024-12"
 */
export function monthYearToKey(year, month) {
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new Error(`Invalid year: ${year}`);
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}. Must be 1-12`);
  }

  return `${year}-${String(month).padStart(2, "0")}`;
}

/**
 * Parse YYYY-MM key into { year, month }
 * @param {string} key - Key in "YYYY-MM" format
 * @returns {{ year: number, month: number }} Parsed year and month
 *
 * @example
 * parseKey("2024-12") // { year: 2024, month: 12 }
 */
export function parseKey(key) {
  if (!key || typeof key !== "string" || !/^\d{4}-\d{2}$/.test(key)) {
    throw new Error(`Invalid key format: ${key}. Expected "YYYY-MM"`);
  }

  const [year, month] = key.split("-").map(Number);
  return { year, month };
}

/**
 * Calculate number of months between two dates/keys
 * @param {string|Date} start - Start date or key
 * @param {string|Date} end - End date or key
 * @returns {number} Number of months (can be negative if end < start)
 *
 * @example
 * monthsBetween("2024-01", "2024-12") // 11
 * monthsBetween("2024-06", "2024-01") // -5
 */
export function monthsBetween(start, end) {
  const startKey = typeof start === "string" ? start : dateToKey(start);
  const endKey = typeof end === "string" ? end : dateToKey(end);

  const { year: startYear, month: startMonth } = parseKey(startKey);
  const { year: endYear, month: endMonth } = parseKey(endKey);

  return (endYear - startYear) * 12 + (endMonth - startMonth);
}

/**
 * Generate array of YYYY-MM keys for a date range
 * @param {string} startKey - Start key (inclusive)
 * @param {string} endKey - End key (inclusive)
 * @returns {string[]} Array of keys in chronological order
 *
 * @example
 * generateMonthRange("2024-01", "2024-06")
 * // ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06"]
 */
export function generateMonthRange(startKey, endKey) {
  const months = monthsBetween(startKey, endKey);

  if (months < 0) {
    throw new Error("Start date must be before or equal to end date");
  }

  const result = [];
  const { year: startYear, month: startMonth } = parseKey(startKey);

  for (let i = 0; i <= months; i++) {
    const totalMonths = startYear * 12 + startMonth - 1 + i;
    const year = Math.floor(totalMonths / 12);
    const month = (totalMonths % 12) + 1;
    result.push(monthYearToKey(year, month));
  }

  return result;
}

/**
 * Add months to a key
 * @param {string} key - Starting key
 * @param {number} monthsToAdd - Months to add (can be negative)
 * @returns {string} New key
 *
 * @example
 * addMonths("2024-06", 3)  // "2024-09"
 * addMonths("2024-01", -2) // "2023-11"
 */
export function addMonths(key, monthsToAdd) {
  const { year, month } = parseKey(key);
  const totalMonths = year * 12 + month - 1 + monthsToAdd;
  const newYear = Math.floor(totalMonths / 12);
  const newMonth = (totalMonths % 12) + 1;
  return monthYearToKey(newYear, newMonth);
}

/**
 * Get the last N months from a given end date
 * @param {string} endKey - End key (inclusive)
 * @param {number} n - Number of months to go back
 * @returns {string[]} Array of keys from oldest to newest
 *
 * @example
 * getLastNMonths("2024-12", 6)
 * // ["2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"]
 */
export function getLastNMonths(endKey, n) {
  if (n < 1) {
    throw new Error("n must be at least 1");
  }

  const startKey = addMonths(endKey, -(n - 1));
  return generateMonthRange(startKey, endKey);
}

/**
 * Calculate years (as decimal) between two keys
 * Useful for CAGR calculations
 * @param {string} startKey - Start key
 * @param {string} endKey - End key
 * @returns {number} Years as decimal (e.g., 1.5 for 18 months)
 *
 * @example
 * yearsBetween("2023-01", "2024-07") // 1.5
 */
export function yearsBetween(startKey, endKey) {
  const months = monthsBetween(startKey, endKey);
  return months / 12;
}

/**
 * Check if a key is within a range (inclusive)
 * @param {string} key - Key to check
 * @param {string} startKey - Range start
 * @param {string} endKey - Range end
 * @returns {boolean} True if key is within range
 */
export function isKeyInRange(key, startKey, endKey) {
  return key >= startKey && key <= endKey;
}

/**
 * Get current month key
 * @returns {string} Current month in YYYY-MM format
 */
export function getCurrentMonthKey() {
  return dateToKey(new Date());
}

/**
 * Compare two keys
 * @param {string} keyA - First key
 * @param {string} keyB - Second key
 * @returns {number} -1 if keyA < keyB, 0 if equal, 1 if keyA > keyB
 */
export function compareKeys(keyA, keyB) {
  if (keyA < keyB) return -1;
  if (keyA > keyB) return 1;
  return 0;
}

export default {
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
};
