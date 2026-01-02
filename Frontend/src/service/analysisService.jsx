/**
 * Analysis API Service
 *
 * Handles all analysis-related API calls
 * - Generate analysis for a portfolio
 * - Generate sample analysis (no auth required)
 */

// API base URL - uses environment variable, no hardcoded fallback in production
const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : "");

/**
 * Get auth headers with JWT token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

/**
 * Generate analysis for a specific portfolio
 * @param {string} portfolioId - Portfolio ID to analyze
 * @returns {Promise<Object>} Analysis results
 */
export const generateAnalysis = async (portfolioId) => {
  const response = await fetch(`${API_URL}/analysis/generate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ portfolioId }),
  });

  return handleResponse(response);
};

/**
 * Generate sample analysis (no authentication required)
 * Uses predefined sample portfolio data
 * @returns {Promise<Object>} Sample analysis results
 */
export const generateSampleAnalysis = async () => {
  const response = await fetch(`${API_URL}/analysis/sample`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};

/**
 * Get portfolio summary (quick overview without full analysis)
 * @param {string} portfolioId - Portfolio ID
 * @returns {Promise<Object>} Portfolio summary
 */
export const getPortfolioSummary = async (portfolioId) => {
  const response = await fetch(`${API_URL}/analysis/summary/${portfolioId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};

export default {
  generateAnalysis,
  generateSampleAnalysis,
  getPortfolioSummary,
};
