/**
 * Abuse Prevention Constants
 *
 * Defines limits to prevent platform abuse
 */

// ═══════════════════════════════════════════════════════════════
// USER LIMITS
// ═══════════════════════════════════════════════════════════════

/**
 * Maximum portfolios per user
 */
export const MAX_PORTFOLIOS_PER_USER = 5;

/**
 * Maximum funds per portfolio
 */
export const MAX_FUNDS_PER_PORTFOLIO = 20;

/**
 * Maximum SIPs per fund
 */
export const MAX_SIPS_PER_FUND = 10;

/**
 * Maximum lumpsums per fund
 */
export const MAX_LUMPSUMS_PER_FUND = 20;

// ═══════════════════════════════════════════════════════════════
// INPUT LIMITS
// ═══════════════════════════════════════════════════════════════

/**
 * Maximum portfolio name length
 */
export const MAX_PORTFOLIO_NAME_LENGTH = 100;

/**
 * Maximum fund name length
 */
export const MAX_FUND_NAME_LENGTH = 200;

/**
 * Maximum investment amount (₹10 Crore)
 */
export const MAX_INVESTMENT_AMOUNT = 100000000;

/**
 * Maximum SIP amount (₹1 Crore per month)
 */
export const MAX_SIP_AMOUNT = 10000000;

// ═══════════════════════════════════════════════════════════════
// ERROR MESSAGES
// ═══════════════════════════════════════════════════════════════

export const LIMIT_ERROR_MESSAGES = {
  MAX_PORTFOLIOS: `You have reached the maximum limit of ${MAX_PORTFOLIOS_PER_USER} portfolios. Please delete an existing portfolio to create a new one.`,
  MAX_FUNDS: `Portfolio cannot have more than ${MAX_FUNDS_PER_PORTFOLIO} funds. Please remove some funds or create a new portfolio.`,
  MAX_SIPS: `Fund cannot have more than ${MAX_SIPS_PER_FUND} SIP entries.`,
  MAX_LUMPSUMS: `Fund cannot have more than ${MAX_LUMPSUMS_PER_FUND} lumpsum entries.`,
  MAX_AMOUNT: `Investment amount exceeds maximum allowed limit of ₹${(
    MAX_INVESTMENT_AMOUNT / 10000000
  ).toFixed(0)} Cr.`,
};

export default {
  MAX_PORTFOLIOS_PER_USER,
  MAX_FUNDS_PER_PORTFOLIO,
  MAX_SIPS_PER_FUND,
  MAX_LUMPSUMS_PER_FUND,
  MAX_PORTFOLIO_NAME_LENGTH,
  MAX_FUND_NAME_LENGTH,
  MAX_INVESTMENT_AMOUNT,
  MAX_SIP_AMOUNT,
  LIMIT_ERROR_MESSAGES,
};
