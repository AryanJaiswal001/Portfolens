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
 * Handle API response with safe JSON parsing
 * - Checks content-type before parsing
 * - Logs non-JSON responses for debugging
 * - Shows user-friendly error messages
 */
const handleResponse = async (response) => {
  // Check content type before parsing
  const contentType = response.headers.get("content-type");
  
  if (!contentType || !contentType.includes("application/json")) {
    // Log non-JSON response for debugging
    const text = await response.text().catch(() => "[Could not read response]");
    console.error("Non-JSON response received:", {
      status: response.status,
      contentType,
      body: text.substring(0, 200), // First 200 chars for debugging
    });
    throw new Error("Server returned an invalid response. Please try again.");
  }

  // Safely parse JSON
  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    throw new Error("Failed to parse server response. Please try again.");
  }

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
