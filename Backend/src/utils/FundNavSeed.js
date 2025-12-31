/**
 * Fund NAV Seed Data
 *
 * Historical monthly NAV data for ALL 50 mutual funds in FundReference
 * Period: Jan 2024 → Dec 2024 (12 months)
 *
 * NAV values are simulated with:
 * - Realistic starting points based on actual Indian MF NAV ranges
 * - Category-appropriate volatility and growth patterns
 * - 2024 Indian market context: Strong equity year, stable debt, gold rally
 * - No external API calls - purely simulated analysis-grade data
 *
 * Category-Based Assumptions (2024 Indian Market):
 * ─────────────────────────────────────────────────────────────────────
 * Large Cap:      ~12-14% annual return, ±1.5-2.5% monthly volatility
 * Mid Cap:        ~16-20% annual return, ±2-4% monthly volatility
 * Small Cap:      ~20-28% annual return, ±3-6% monthly volatility
 * Flexi Cap:      ~14-18% annual return, ±2-3.5% monthly volatility
 * Index:          ~12-14% annual return, ±1.5-2.5% monthly volatility
 * Hybrid:         ~10-13% annual return, ±1-2% monthly volatility
 * Debt:           ~5-7% annual return, ±0.3-0.6% monthly volatility
 * Gold:           ~12-16% annual return, ±1.5-3% monthly volatility
 *
 * Reference: Based on historical performance ranges of Indian mutual funds
 */

import fundReferenceSeedData from "./FundReferenceSeed.js";

// ═══════════════════════════════════════════════════════════════════════════
// MONTHLY RETURN PATTERNS (% change from previous month)
// Index 0 = Jan, Index 11 = Dec
// Based on 2024 Indian market behavior and seasonality
// ═══════════════════════════════════════════════════════════════════════════

const MONTHLY_PATTERNS = {
  // Large Cap: Steady growth, lower volatility (~13% annual)
  // Nifty 50 delivered ~13% in 2024
  LARGE_CAP: [0, 1.8, -0.9, 2.2, 1.4, 0.2, 1.6, 0.9, -1.2, 2.8, 1.1, 1.5],

  // Mid Cap: Higher growth, moderate volatility (~17% annual)
  // Nifty Midcap 150 outperformed large caps in 2024
  MID_CAP: [0, 2.5, -1.4, 3.2, 1.9, -0.3, 2.6, 1.3, -1.8, 3.8, 1.6, 2.1],

  // Small Cap: Highest growth, high volatility (~24% annual)
  // Small caps saw strong rallies with corrections
  SMALL_CAP: [0, 3.8, -2.2, 4.5, 2.4, -1.5, 3.9, 1.8, -2.8, 5.2, 2.3, 3.2],

  // Flexi Cap: Balanced approach, moderate volatility (~15% annual)
  FLEXI_CAP: [0, 2.1, -1.0, 2.8, 1.6, 0.1, 2.2, 1.1, -1.4, 3.2, 1.3, 1.8],

  // Index: Tracks benchmark closely, low volatility (~13% annual)
  INDEX: [0, 1.7, -0.8, 2.1, 1.3, 0.3, 1.5, 0.8, -1.0, 2.6, 1.0, 1.4],

  // Hybrid: Conservative, dampened equity volatility (~11% annual)
  HYBRID: [0, 1.3, -0.4, 1.8, 1.0, 0.4, 1.4, 0.7, -0.7, 2.1, 0.9, 1.2],

  // Debt: Very stable, minimal volatility (~6% annual)
  // RBI policy stable, yields ranged 6.5-7.5%
  DEBT: [0, 0.5, 0.45, 0.55, 0.48, 0.42, 0.52, 0.5, 0.45, 0.55, 0.48, 0.52],

  // Gold: 2024 was strong for gold (~14% annual)
  // Gold rallied on geopolitical tensions and central bank buying
  GOLD: [0, 1.5, 2.2, -0.6, 1.8, 0.5, 1.9, -0.3, 1.4, 2.0, 0.8, 1.6],
};

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY TO PATTERN MAPPING
// Maps FundReference categories to monthly patterns
// ═══════════════════════════════════════════════════════════════════════════

const CATEGORY_PATTERN_MAP = {
  "Large Cap": "LARGE_CAP",
  "Mid Cap": "MID_CAP",
  "Small Cap": "SMALL_CAP",
  "Flexi Cap": "FLEXI_CAP",
  Index: "INDEX",
  Hybrid: "HYBRID",
  "Corporate Bond": "DEBT",
  "Short Duration": "DEBT",
  "Medium Duration": "DEBT",
  "Dynamic Bond": "DEBT",
  Gold: "GOLD",
};

// ═══════════════════════════════════════════════════════════════════════════
// REALISTIC STARTING NAV VALUES BY FUND
// Based on actual NAV ranges of popular Indian mutual funds (Jan 2024)
// Sources: AMFI, fund house websites (for reference, not fetched)
// ═══════════════════════════════════════════════════════════════════════════

const FUND_START_NAVS = {
  // Large Cap (₹50-1000 range typical)
  "HDFC Top 100 Fund": 985.2,
  "SBI Bluechip Fund": 82.45,
  "ICICI Prudential Bluechip Fund": 95.3,
  "Axis Bluechip Fund": 52.25,
  "Mirae Asset Large Cap Fund": 105.15,
  "Kotak Bluechip Fund": 512.8,
  "Canara Robeco Bluechip Equity Fund": 52.35,
  "DSP Top 100 Equity Fund": 412.6,

  // Index (₹150-250 range typical)
  "UTI Nifty 50 Index Fund": 165.42,
  "ICICI Prudential Nifty 50 Index Fund": 218.75,
  "HDFC Index Fund Nifty 50": 205.3,
  "SBI Nifty Index Fund": 198.65,

  // Mid Cap (₹30-3500 range - high variance)
  "Axis Midcap Fund": 95.8,
  "Kotak Emerging Equity Fund": 118.25,
  "HDFC Mid-Cap Opportunities Fund": 145.5,
  "SBI Magnum Midcap Fund": 225.4,
  "Mirae Asset Midcap Fund": 32.15,
  "Nippon India Growth Fund": 3250.8,
  "PGIM India Midcap Opportunities Fund": 62.45,
  "Edelweiss Mid Cap Fund": 85.2,

  // Small Cap (₹75-270 range typical)
  "SBI Small Cap Fund": 168.75,
  "Nippon India Small Cap Fund": 168.35,
  "HDFC Small Cap Fund": 128.9,
  "Axis Small Cap Fund": 95.45,
  "Kotak Small Cap Fund": 252.15,
  "DSP Small Cap Fund": 185.6,

  // Flexi Cap (₹70-2000 range)
  "Parag Parikh Flexi Cap Fund": 72.8,
  "Kotak Flexi Cap Fund": 72.3,
  "HDFC Flexi Cap Fund": 1850.45,
  "ICICI Prudential Flexi Cap Fund": 528.65,
  "Canara Robeco Flexi Cap Fund": 315.8,
  "JM Flexi Cap Fund": 98.45,

  // Hybrid (₹25-450 range)
  "ICICI Prudential Balanced Advantage Fund": 62.85,
  "HDFC Balanced Advantage Fund": 425.8,
  "Kotak Equity Hybrid Fund": 58.45,
  "SBI Equity Hybrid Fund": 265.25,
  "Axis Equity Hybrid Fund": 28.15,

  // Debt - Corporate Bond (₹25-40 range typical)
  "HDFC Corporate Bond Fund": 28.92,
  "ICICI Prudential Corporate Bond Fund": 26.85,
  "SBI Corporate Bond Fund": 35.42,

  // Debt - Short Duration (₹25-60 range)
  "Axis Short Term Fund": 26.45,
  "ICICI Prudential Short Term Fund": 55.8,
  "HDFC Short Term Debt Fund": 28.15,

  // Debt - Other (Medium/Dynamic)
  "Kotak Bond Fund": 72.35,
  "Nippon India Strategic Debt Fund": 15.82,

  // Gold (₹18-26 range typical)
  "SBI Gold Fund": 18.65,
  "HDFC Gold Fund": 19.25,
  "ICICI Prudential Gold Fund": 21.15,
  "Axis Gold Fund": 18.92,
  "Nippon India Gold Savings Fund": 24.65,
};

// ═══════════════════════════════════════════════════════════════════════════
// MONTHS FOR 2024
// ═══════════════════════════════════════════════════════════════════════════

const MONTHS_2024 = [
  "2024-01",
  "2024-02",
  "2024-03",
  "2024-04",
  "2024-05",
  "2024-06",
  "2024-07",
  "2024-08",
  "2024-09",
  "2024-10",
  "2024-11",
  "2024-12",
];

// ═══════════════════════════════════════════════════════════════════════════
// SAMPLE PORTFOLIO FUND NAMES (Priority 1)
// These 8 funds are used in the sample portfolio demo
// ═══════════════════════════════════════════════════════════════════════════

const SAMPLE_PORTFOLIO_FUND_NAMES = [
  "HDFC Mid-Cap Opportunities Fund",
  "Axis Bluechip Fund",
  "SBI Small Cap Fund",
  "Parag Parikh Flexi Cap Fund",
  "Kotak Equity Hybrid Fund",
  "HDFC Corporate Bond Fund",
  "SBI Gold Fund",
  "ICICI Prudential Flexi Cap Fund", // Mapped from sample's "Value Discovery"
];

// ═══════════════════════════════════════════════════════════════════════════
// NAV GENERATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a deterministic hash from fund name
 * Used for consistent but varied noise across funds
 */
function hashFundName(fundName) {
  let hash = 0;
  for (let i = 0; i < fundName.length; i++) {
    const char = fundName.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Seeded random number generator for reproducibility
 */
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Round NAV to 4 decimal places
 */
function roundNav(nav) {
  return Math.round(nav * 10000) / 10000;
}

/**
 * Get pattern for a fund based on its category
 */
function getPatternForCategory(category) {
  const patternKey = CATEGORY_PATTERN_MAP[category];
  if (patternKey && MONTHLY_PATTERNS[patternKey]) {
    return MONTHLY_PATTERNS[patternKey];
  }
  // Default to hybrid (moderate) if category unknown
  return MONTHLY_PATTERNS.HYBRID;
}

/**
 * Get starting NAV for a fund
 * Falls back to category-based defaults if not specified
 */
function getStartNav(fundName, category) {
  if (FUND_START_NAVS[fundName]) {
    return FUND_START_NAVS[fundName];
  }

  // Category-based defaults
  const categoryDefaults = {
    "Large Cap": 85.0,
    "Mid Cap": 95.0,
    "Small Cap": 125.0,
    "Flexi Cap": 150.0,
    Index: 180.0,
    Hybrid: 55.0,
    "Corporate Bond": 28.0,
    "Short Duration": 30.0,
    "Medium Duration": 45.0,
    "Dynamic Bond": 18.0,
    Gold: 20.0,
  };

  return categoryDefaults[category] || 50.0;
}

/**
 * Generate NAV series from starting NAV and monthly pattern
 * Uses deterministic seeded random for reproducible results
 *
 * @param {number} startNav - Starting NAV value
 * @param {Array} pattern - Monthly return pattern (12 values)
 * @param {number} noiseLevel - Random variation level (default 0.25)
 * @param {number} seed - Seed for deterministic randomness
 * @returns {Object} NAV series { "YYYY-MM": nav }
 */
function generateNavSeries(startNav, pattern, noiseLevel = 0.25, seed = 0) {
  const navs = {};
  let currentNav = startNav;

  for (let i = 0; i < MONTHS_2024.length; i++) {
    if (i === 0) {
      navs[MONTHS_2024[i]] = roundNav(currentNav);
    } else {
      // Add deterministic noise based on seed + month
      const noise = (seededRandom(seed + i * 7) - 0.5) * noiseLevel * 2;
      const monthlyChange = pattern[i] + noise;
      currentNav = currentNav * (1 + monthlyChange / 100);
      navs[MONTHS_2024[i]] = roundNav(currentNav);
    }
  }

  return navs;
}

// ═══════════════════════════════════════════════════════════════════════════
// DYNAMIC NAV CONFIG BUILDERS
// Automatically generates config for ALL funds from FundReference
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build NAV config for ALL 50 funds in FundReference
 * Automatically assigns patterns based on category
 */
export function buildAllFundsNavConfig() {
  return fundReferenceSeedData.map((fund) => {
    const pattern = getPatternForCategory(fund.category);
    const startNav = getStartNav(fund.fundName, fund.category);
    const seed = hashFundName(fund.fundName);

    return {
      fundName: fund.fundName,
      category: fund.category,
      assetType: fund.assetType,
      startNav,
      pattern,
      seed,
    };
  });
}

/**
 * Build NAV config for sample portfolio funds only
 */
export function buildSamplePortfolioNavConfig() {
  return fundReferenceSeedData
    .filter((fund) => SAMPLE_PORTFOLIO_FUND_NAMES.includes(fund.fundName))
    .map((fund) => {
      const pattern = getPatternForCategory(fund.category);
      const startNav = getStartNav(fund.fundName, fund.category);
      const seed = hashFundName(fund.fundName);

      return {
        fundName: fund.fundName,
        category: fund.category,
        assetType: fund.assetType,
        startNav,
        pattern,
        seed,
      };
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// SEED DATA GENERATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate NAV seed records from fund config
 * Returns array of { fundName, date, nav } records ready for MongoDB
 */
export function generateFundNavSeedData(fundsConfig) {
  const records = [];

  for (const fund of fundsConfig) {
    const navSeries = generateNavSeries(
      fund.startNav,
      fund.pattern,
      0.25,
      fund.seed || 0
    );

    for (const [date, nav] of Object.entries(navSeries)) {
      records.push({
        fundName: fund.fundName,
        date,
        nav,
      });
    }
  }

  return records;
}

/**
 * Get all NAV seed data (all 50 funds from FundReference)
 * Total records: 50 funds × 12 months = 600 records
 */
export function getAllFundNavSeedData() {
  const config = buildAllFundsNavConfig();
  return generateFundNavSeedData(config);
}

/**
 * Get sample portfolio NAV seed data only
 * Total records: 8 funds × 12 months = 96 records
 */
export function getSamplePortfolioNavSeedData() {
  const config = buildSamplePortfolioNavConfig();
  return generateFundNavSeedData(config);
}

/**
 * Get NAV config summary for verification
 */
export function getNavConfigSummary() {
  const config = buildAllFundsNavConfig();

  const byCategory = {};
  for (const fund of config) {
    const cat = fund.category;
    if (!byCategory[cat]) {
      byCategory[cat] = [];
    }
    byCategory[cat].push({
      name: fund.fundName,
      startNav: fund.startNav,
    });
  }

  return {
    totalFunds: config.length,
    totalRecords: config.length * 12,
    period: `${MONTHS_2024[0]} → ${MONTHS_2024[MONTHS_2024.length - 1]}`,
    byCategory,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// BACKWARD COMPATIBLE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

// Legacy exports for existing seed scripts
export const SAMPLE_PORTFOLIO_NAV_DATA = buildSamplePortfolioNavConfig();
export const ADDITIONAL_FUNDS_NAV_DATA = buildAllFundsNavConfig().filter(
  (f) => !SAMPLE_PORTFOLIO_FUND_NAMES.includes(f.fundName)
);

export { MONTHS_2024, MONTHLY_PATTERNS, CATEGORY_PATTERN_MAP };

export default {
  SAMPLE_PORTFOLIO_NAV_DATA,
  ADDITIONAL_FUNDS_NAV_DATA,
  generateFundNavSeedData,
  getAllFundNavSeedData,
  getSamplePortfolioNavSeedData,
  buildAllFundsNavConfig,
  buildSamplePortfolioNavConfig,
  getNavConfigSummary,
  MONTHS_2024,
  MONTHLY_PATTERNS,
};
