/**
 * NAV Normalization Utility
 *
 * Functions to normalize and prepare monthly NAV data
 * for calculations across the analysis engine
 *
 * NAV Data Format (input):
 * {
 *   "2024-01": 145.23,
 *   "2024-02": 148.50,
 *   ...
 * }
 *
 * NO database queries
 * NO external dependencies
 * NO Express/UI logic
 */

import {
  generateMonthRange,
  compareKeys,
  parseKey,
  monthYearToKey,
} from "./date.util.js";

/**
 * Normalize NAV data object
 * - Ensures keys are in YYYY-MM format
 * - Sorts entries chronologically
 * - Validates NAV values
 *
 * @param {Object} navData - Raw NAV data { "YYYY-MM": navValue }
 * @returns {Object} Normalized NAV data
 *
 * @example
 * normalizeNavData({ "2024-02": 150, "2024-01": 145 })
 * // Returns sorted: { "2024-01": 145, "2024-02": 150 }
 */
export function normalizeNavData(navData) {
  if (!navData || typeof navData !== "object") {
    throw new Error("NAV data must be a non-null object");
  }

  const entries = Object.entries(navData);

  if (entries.length === 0) {
    return {};
  }

  // Validate and normalize each entry
  const normalized = {};

  for (const [key, value] of entries) {
    // Validate key format
    if (!/^\d{4}-\d{2}$/.test(key)) {
      throw new Error(`Invalid NAV key format: ${key}. Expected "YYYY-MM"`);
    }

    // Validate NAV value
    const navValue = Number(value);
    if (isNaN(navValue) || navValue <= 0) {
      throw new Error(
        `Invalid NAV value for ${key}: ${value}. Must be positive number`
      );
    }

    normalized[key] = navValue;
  }

  // Sort by key (chronological order)
  const sortedKeys = Object.keys(normalized).sort(compareKeys);
  const sorted = {};

  for (const key of sortedKeys) {
    sorted[key] = normalized[key];
  }

  return sorted;
}

/**
 * Get sorted array of NAV entries
 * @param {Object} navData - NAV data object
 * @returns {Array<{key: string, nav: number}>} Sorted array of entries
 *
 * @example
 * navToSortedArray({ "2024-01": 145, "2024-02": 150 })
 * // [{ key: "2024-01", nav: 145 }, { key: "2024-02", nav: 150 }]
 */
export function navToSortedArray(navData) {
  const normalized = normalizeNavData(navData);
  return Object.entries(normalized).map(([key, nav]) => ({ key, nav }));
}

/**
 * Get NAV range (earliest and latest dates)
 * @param {Object} navData - NAV data object
 * @returns {{ start: string, end: string, months: number }} Range info
 */
export function getNavRange(navData) {
  const keys = Object.keys(normalizeNavData(navData)).sort(compareKeys);

  if (keys.length === 0) {
    throw new Error("NAV data is empty");
  }

  return {
    start: keys[0],
    end: keys[keys.length - 1],
    months: keys.length,
  };
}

/**
 * Fill missing months in NAV data using interpolation
 *
 * Strategy:
 * - Linear interpolation for gaps
 * - Forward fill for missing start (uses first available)
 * - Backward fill for missing end (uses last available)
 *
 * @param {Object} navData - NAV data (may have gaps)
 * @param {string} startKey - Required start date
 * @param {string} endKey - Required end date
 * @returns {Object} NAV data with all months filled
 *
 * @example
 * fillMissingNavData(
 *   { "2024-01": 100, "2024-03": 110 },
 *   "2024-01",
 *   "2024-03"
 * )
 * // { "2024-01": 100, "2024-02": 105, "2024-03": 110 }
 */
export function fillMissingNavData(navData, startKey, endKey) {
  const normalized = normalizeNavData(navData);
  const requiredMonths = generateMonthRange(startKey, endKey);

  if (Object.keys(normalized).length === 0) {
    throw new Error("Cannot fill empty NAV data");
  }

  const filled = {};
  const availableKeys = Object.keys(normalized).sort(compareKeys);
  const firstAvailable = availableKeys[0];
  const lastAvailable = availableKeys[availableKeys.length - 1];

  for (const month of requiredMonths) {
    if (normalized[month] !== undefined) {
      // NAV exists for this month
      filled[month] = normalized[month];
    } else if (month < firstAvailable) {
      // Before first available: use first available (backward fill)
      filled[month] = normalized[firstAvailable];
    } else if (month > lastAvailable) {
      // After last available: use last available (forward fill)
      filled[month] = normalized[lastAvailable];
    } else {
      // Gap in the middle: interpolate
      filled[month] = interpolateNav(normalized, month);
    }
  }

  return filled;
}

/**
 * Interpolate NAV for a missing month
 * Uses linear interpolation between surrounding known values
 *
 * @param {Object} navData - NAV data with some values
 * @param {string} targetKey - Month to interpolate
 * @returns {number} Interpolated NAV value
 */
function interpolateNav(navData, targetKey) {
  const keys = Object.keys(navData).sort(compareKeys);

  // Find surrounding keys
  let beforeKey = null;
  let afterKey = null;

  for (const key of keys) {
    if (key < targetKey) {
      beforeKey = key;
    } else if (key > targetKey && afterKey === null) {
      afterKey = key;
      break;
    }
  }

  if (!beforeKey || !afterKey) {
    // This shouldn't happen if called correctly from fillMissingNavData
    throw new Error(
      `Cannot interpolate ${targetKey}: missing surrounding data`
    );
  }

  // Linear interpolation
  const beforeNav = navData[beforeKey];
  const afterNav = navData[afterKey];

  // Calculate position (0 to 1) of target between before and after
  const { year: beforeYear, month: beforeMonth } = parseKey(beforeKey);
  const { year: afterYear, month: afterMonth } = parseKey(afterKey);
  const { year: targetYear, month: targetMonth } = parseKey(targetKey);

  const beforeTotal = beforeYear * 12 + beforeMonth;
  const afterTotal = afterYear * 12 + afterMonth;
  const targetTotal = targetYear * 12 + targetMonth;

  const ratio = (targetTotal - beforeTotal) / (afterTotal - beforeTotal);

  // Interpolated value
  return beforeNav + (afterNav - beforeNav) * ratio;
}

/**
 * Extract NAV for specific months
 * @param {Object} navData - Full NAV data
 * @param {string[]} months - Array of month keys to extract
 * @returns {Object} Filtered NAV data
 */
export function extractMonths(navData, months) {
  const normalized = normalizeNavData(navData);
  const result = {};

  for (const month of months) {
    if (normalized[month] !== undefined) {
      result[month] = normalized[month];
    }
  }

  return result;
}

/**
 * Get NAV for a specific month
 * @param {Object} navData - NAV data object
 * @param {string} month - Month key
 * @returns {number|null} NAV value or null if not found
 */
export function getNavForMonth(navData, month) {
  const normalized = normalizeNavData(navData);
  return normalized[month] ?? null;
}

/**
 * Get latest NAV (most recent month)
 * @param {Object} navData - NAV data object
 * @returns {{ key: string, nav: number }} Latest NAV entry
 */
export function getLatestNav(navData) {
  const range = getNavRange(navData);
  const normalized = normalizeNavData(navData);

  return {
    key: range.end,
    nav: normalized[range.end],
  };
}

/**
 * Get earliest NAV (oldest month)
 * @param {Object} navData - NAV data object
 * @returns {{ key: string, nav: number }} Earliest NAV entry
 */
export function getEarliestNav(navData) {
  const range = getNavRange(navData);
  const normalized = normalizeNavData(navData);

  return {
    key: range.start,
    nav: normalized[range.start],
  };
}

/**
 * Validate that NAV data covers required period
 * @param {Object} navData - NAV data object
 * @param {string} requiredStart - Required start month
 * @param {string} requiredEnd - Required end month
 * @returns {{ isValid: boolean, missing: string[], coverage: number }}
 */
export function validateNavCoverage(navData, requiredStart, requiredEnd) {
  const normalized = normalizeNavData(navData);
  const requiredMonths = generateMonthRange(requiredStart, requiredEnd);
  const available = new Set(Object.keys(normalized));

  const missing = requiredMonths.filter((m) => !available.has(m));
  const coverage =
    ((requiredMonths.length - missing.length) / requiredMonths.length) * 100;

  return {
    isValid: missing.length === 0,
    missing,
    coverage: Math.round(coverage * 100) / 100,
  };
}

/**
 * Merge multiple NAV data objects
 * Later values override earlier ones
 * @param  {...Object} navDataSets - NAV data objects to merge
 * @returns {Object} Merged NAV data
 */
export function mergeNavData(...navDataSets) {
  const merged = {};

  for (const navData of navDataSets) {
    if (navData && typeof navData === "object") {
      const normalized = normalizeNavData(navData);
      Object.assign(merged, normalized);
    }
  }

  return normalizeNavData(merged);
}

export default {
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
};
