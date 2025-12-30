/**
 * Fund NAV Seed Data
 *
 * Historical monthly NAV data for mutual funds
 * Period: Jan 2024 → Dec 2024 (12 months)
 *
 * NAV values are simulated with:
 * - Realistic starting points based on actual fund ranges
 * - Category-appropriate volatility
 * - General upward trend with corrections
 * - No external API calls
 *
 * Categories & Volatility:
 * - Large Cap: Low volatility (±1-3% monthly)
 * - Mid Cap: Medium volatility (±2-5% monthly)
 * - Small Cap: High volatility (±3-7% monthly)
 * - Flexi Cap: Medium volatility (±2-4% monthly)
 * - Index: Low volatility (±1-3% monthly)
 * - Hybrid: Low-Medium volatility (±1-3% monthly)
 * - Debt: Very low volatility (±0.3-0.8% monthly)
 * - Gold: Medium volatility (±1-4% monthly)
 */

// Monthly return patterns (% change from previous month)
// These create realistic but not perfectly smooth curves
const MONTHLY_PATTERNS = {
  // 2024 was generally a good year for Indian equities
  EQUITY_BULL: [0, 2.1, -1.2, 3.5, 1.8, -0.5, 2.8, 1.2, -2.1, 4.2, 1.5, 2.3], // ~16% annual
  EQUITY_MODERATE: [0, 1.5, -0.8, 2.8, 1.2, 0.3, 1.9, 0.8, -1.5, 3.1, 1.0, 1.8], // ~12% annual
  EQUITY_VOLATILE: [
    0, 3.5, -2.5, 5.2, 2.1, -1.8, 4.1, 1.5, -3.2, 6.1, 2.0, 3.5,
  ], // ~22% annual
  DEBT_STABLE: [0, 0.5, 0.4, 0.6, 0.5, 0.4, 0.5, 0.6, 0.4, 0.5, 0.5, 0.6], // ~5.5% annual
  GOLD_TREND: [0, 1.2, 2.5, -0.8, 1.5, 0.8, 2.1, -0.5, 1.8, 2.2, 0.5, 1.5], // ~14% annual
  HYBRID_BALANCED: [0, 1.2, -0.3, 2.0, 1.0, 0.5, 1.5, 0.7, -0.8, 2.5, 0.8, 1.4], // ~11% annual
};

// Months for 2024
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

/**
 * Generate NAV series from starting NAV and monthly pattern
 * Adds small random noise for realism
 */
function generateNavSeries(startNav, pattern, noiseLevel = 0.3) {
  const navs = {};
  let currentNav = startNav;

  for (let i = 0; i < MONTHS_2024.length; i++) {
    // Add small random noise
    const noise = (Math.random() - 0.5) * noiseLevel;
    const monthlyChange = pattern[i] + noise;

    if (i === 0) {
      navs[MONTHS_2024[i]] = roundNav(currentNav);
    } else {
      currentNav = currentNav * (1 + monthlyChange / 100);
      navs[MONTHS_2024[i]] = roundNav(currentNav);
    }
  }

  return navs;
}

/**
 * Round NAV to 4 decimal places
 */
function roundNav(nav) {
  return Math.round(nav * 10000) / 10000;
}

/**
 * SAMPLE PORTFOLIO FUNDS (Priority 1)
 * These are the 8 funds in the sample portfolio - seed first
 */
export const SAMPLE_PORTFOLIO_NAV_DATA = [
  {
    fundName: "HDFC Mid-Cap Opportunities Fund",
    startNav: 145.5,
    pattern: MONTHLY_PATTERNS.EQUITY_BULL,
    category: "Mid Cap",
  },
  {
    fundName: "Axis Bluechip Fund",
    startNav: 52.25,
    pattern: MONTHLY_PATTERNS.EQUITY_MODERATE,
    category: "Large Cap",
  },
  {
    fundName: "SBI Small Cap Fund",
    startNav: 168.75,
    pattern: MONTHLY_PATTERNS.EQUITY_VOLATILE,
    category: "Small Cap",
  },
  {
    fundName: "ICICI Prudential Value Discovery Fund",
    startNav: 412.3,
    pattern: MONTHLY_PATTERNS.EQUITY_MODERATE,
    category: "Value/Flexi",
  },
  {
    fundName: "Parag Parikh Flexi Cap Fund",
    startNav: 72.8,
    pattern: MONTHLY_PATTERNS.EQUITY_BULL,
    category: "Flexi Cap",
  },
  {
    fundName: "Kotak Equity Hybrid Fund",
    startNav: 58.45,
    pattern: MONTHLY_PATTERNS.HYBRID_BALANCED,
    category: "Hybrid",
  },
  {
    fundName: "HDFC Corporate Bond Fund",
    startNav: 28.92,
    pattern: MONTHLY_PATTERNS.DEBT_STABLE,
    category: "Debt",
  },
  {
    fundName: "SBI Gold Fund",
    startNav: 18.65,
    pattern: MONTHLY_PATTERNS.GOLD_TREND,
    category: "Gold",
  },
];

/**
 * ADDITIONAL FUNDS (Priority 2)
 * Remaining funds from FundReference
 */
export const ADDITIONAL_FUNDS_NAV_DATA = [
  // Large Cap Funds
  {
    fundName: "HDFC Top 100 Fund",
    startNav: 985.2,
    pattern: MONTHLY_PATTERNS.EQUITY_MODERATE,
  },
  {
    fundName: "SBI Bluechip Fund",
    startNav: 82.45,
    pattern: MONTHLY_PATTERNS.EQUITY_MODERATE,
  },
  {
    fundName: "ICICI Prudential Bluechip Fund",
    startNav: 95.3,
    pattern: MONTHLY_PATTERNS.EQUITY_MODERATE,
  },
  {
    fundName: "Mirae Asset Large Cap Fund",
    startNav: 105.15,
    pattern: MONTHLY_PATTERNS.EQUITY_BULL,
  },
  {
    fundName: "Kotak Bluechip Fund",
    startNav: 512.8,
    pattern: MONTHLY_PATTERNS.EQUITY_MODERATE,
  },
  {
    fundName: "Canara Robeco Bluechip Equity Fund",
    startNav: 52.35,
    pattern: MONTHLY_PATTERNS.EQUITY_MODERATE,
  },
  {
    fundName: "DSP Top 100 Equity Fund",
    startNav: 412.6,
    pattern: MONTHLY_PATTERNS.EQUITY_MODERATE,
  },

  // Index Funds
  {
    fundName: "UTI Nifty 50 Index Fund",
    startNav: 165.42,
    pattern: MONTHLY_PATTERNS.EQUITY_MODERATE,
  },
  {
    fundName: "ICICI Prudential Nifty 50 Index Fund",
    startNav: 218.75,
    pattern: MONTHLY_PATTERNS.EQUITY_MODERATE,
  },
  {
    fundName: "HDFC Index Fund Nifty 50",
    startNav: 205.3,
    pattern: MONTHLY_PATTERNS.EQUITY_MODERATE,
  },
  {
    fundName: "SBI Nifty Index Fund",
    startNav: 198.65,
    pattern: MONTHLY_PATTERNS.EQUITY_MODERATE,
  },

  // Mid Cap Funds
  {
    fundName: "Axis Midcap Fund",
    startNav: 95.8,
    pattern: MONTHLY_PATTERNS.EQUITY_BULL,
  },
  {
    fundName: "Kotak Emerging Equity Fund",
    startNav: 118.25,
    pattern: MONTHLY_PATTERNS.EQUITY_BULL,
  },
  {
    fundName: "SBI Magnum Midcap Fund",
    startNav: 225.4,
    pattern: MONTHLY_PATTERNS.EQUITY_BULL,
  },
  {
    fundName: "Mirae Asset Midcap Fund",
    startNav: 32.15,
    pattern: MONTHLY_PATTERNS.EQUITY_BULL,
  },
  {
    fundName: "Nippon India Growth Fund",
    startNav: 3250.8,
    pattern: MONTHLY_PATTERNS.EQUITY_BULL,
  },
  {
    fundName: "PGIM India Midcap Opportunities Fund",
    startNav: 62.45,
    pattern: MONTHLY_PATTERNS.EQUITY_VOLATILE,
  },
  {
    fundName: "Edelweiss Mid Cap Fund",
    startNav: 85.2,
    pattern: MONTHLY_PATTERNS.EQUITY_BULL,
  },

  // Small Cap Funds
  {
    fundName: "Nippon India Small Cap Fund",
    startNav: 168.35,
    pattern: MONTHLY_PATTERNS.EQUITY_VOLATILE,
  },
  {
    fundName: "HDFC Small Cap Fund",
    startNav: 128.9,
    pattern: MONTHLY_PATTERNS.EQUITY_VOLATILE,
  },
  {
    fundName: "Axis Small Cap Fund",
    startNav: 95.45,
    pattern: MONTHLY_PATTERNS.EQUITY_VOLATILE,
  },
  {
    fundName: "Kotak Small Cap Fund",
    startNav: 252.15,
    pattern: MONTHLY_PATTERNS.EQUITY_VOLATILE,
  },
  {
    fundName: "DSP Small Cap Fund",
    startNav: 185.6,
    pattern: MONTHLY_PATTERNS.EQUITY_VOLATILE,
  },
  {
    fundName: "ICICI Prudential Smallcap Fund",
    startNav: 78.25,
    pattern: MONTHLY_PATTERNS.EQUITY_VOLATILE,
  },

  // Flexi Cap Funds
  {
    fundName: "HDFC Flexi Cap Fund",
    startNav: 1850.45,
    pattern: MONTHLY_PATTERNS.EQUITY_BULL,
  },
  {
    fundName: "UTI Flexi Cap Fund",
    startNav: 312.8,
    pattern: MONTHLY_PATTERNS.EQUITY_BULL,
  },
  {
    fundName: "SBI Flexi Cap Fund",
    startNav: 95.65,
    pattern: MONTHLY_PATTERNS.EQUITY_MODERATE,
  },
  {
    fundName: "Kotak Flexi Cap Fund",
    startNav: 72.3,
    pattern: MONTHLY_PATTERNS.EQUITY_BULL,
  },
  {
    fundName: "DSP Flexi Cap Fund",
    startNav: 85.15,
    pattern: MONTHLY_PATTERNS.EQUITY_MODERATE,
  },

  // Hybrid Funds
  {
    fundName: "ICICI Prudential Equity & Debt Fund",
    startNav: 325.4,
    pattern: MONTHLY_PATTERNS.HYBRID_BALANCED,
  },
  {
    fundName: "HDFC Balanced Advantage Fund",
    startNav: 425.8,
    pattern: MONTHLY_PATTERNS.HYBRID_BALANCED,
  },
  {
    fundName: "SBI Equity Hybrid Fund",
    startNav: 265.25,
    pattern: MONTHLY_PATTERNS.HYBRID_BALANCED,
  },
  {
    fundName: "Mirae Asset Hybrid Equity Fund",
    startNav: 28.45,
    pattern: MONTHLY_PATTERNS.HYBRID_BALANCED,
  },

  // Debt Funds - Short Duration
  {
    fundName: "HDFC Short Term Debt Fund",
    startNav: 28.15,
    pattern: MONTHLY_PATTERNS.DEBT_STABLE,
  },
  {
    fundName: "ICICI Prudential Short Term Fund",
    startNav: 55.8,
    pattern: MONTHLY_PATTERNS.DEBT_STABLE,
  },
  {
    fundName: "SBI Short Term Debt Fund",
    startNav: 28.95,
    pattern: MONTHLY_PATTERNS.DEBT_STABLE,
  },
  {
    fundName: "Axis Short Term Fund",
    startNav: 26.45,
    pattern: MONTHLY_PATTERNS.DEBT_STABLE,
  },
  {
    fundName: "Kotak Bond Short Term Fund",
    startNav: 48.25,
    pattern: MONTHLY_PATTERNS.DEBT_STABLE,
  },

  // Debt Funds - Corporate Bond
  {
    fundName: "ICICI Prudential Corporate Bond Fund",
    startNav: 26.85,
    pattern: MONTHLY_PATTERNS.DEBT_STABLE,
  },
  {
    fundName: "Kotak Corporate Bond Fund",
    startNav: 3450.2,
    pattern: MONTHLY_PATTERNS.DEBT_STABLE,
  },

  // Gold Funds
  {
    fundName: "HDFC Gold Fund",
    startNav: 19.25,
    pattern: MONTHLY_PATTERNS.GOLD_TREND,
  },
  {
    fundName: "ICICI Prudential Gold Fund",
    startNav: 21.15,
    pattern: MONTHLY_PATTERNS.GOLD_TREND,
  },
  {
    fundName: "Kotak Gold Fund",
    startNav: 25.8,
    pattern: MONTHLY_PATTERNS.GOLD_TREND,
  },
  {
    fundName: "Nippon India Gold Savings Fund",
    startNav: 24.65,
    pattern: MONTHLY_PATTERNS.GOLD_TREND,
  },
];

/**
 * Generate complete NAV seed data
 * Returns array of { fundName, date, nav } records
 */
export function generateFundNavSeedData(fundsConfig) {
  const records = [];

  for (const fund of fundsConfig) {
    const navSeries = generateNavSeries(
      fund.startNav,
      fund.pattern,
      fund.noiseLevel || 0.3
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
 * Get all NAV seed data (sample + additional)
 */
export function getAllFundNavSeedData() {
  const sampleRecords = generateFundNavSeedData(SAMPLE_PORTFOLIO_NAV_DATA);
  const additionalRecords = generateFundNavSeedData(ADDITIONAL_FUNDS_NAV_DATA);

  return [...sampleRecords, ...additionalRecords];
}

/**
 * Get sample portfolio NAV seed data only
 */
export function getSamplePortfolioNavSeedData() {
  return generateFundNavSeedData(SAMPLE_PORTFOLIO_NAV_DATA);
}

export default {
  SAMPLE_PORTFOLIO_NAV_DATA,
  ADDITIONAL_FUNDS_NAV_DATA,
  generateFundNavSeedData,
  getAllFundNavSeedData,
  getSamplePortfolioNavSeedData,
  MONTHS_2024,
};
