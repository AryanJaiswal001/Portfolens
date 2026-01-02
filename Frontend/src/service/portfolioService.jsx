/**
 * Portfolio API Service
 *
 * Handles all portfolio-related API calls
 * - Always includes JWT token in headers
 * - Never sends userId (backend extracts from token)
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
 * Create a new portfolio
 * @param {Object} portfolioData - { name, funds }
 */
export const createPortfolio = async (portfolioData) => {
  const response = await fetch(`${API_URL}/portfolio`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(portfolioData),
  });

  return handleResponse(response);
};

/**
 * Get all portfolios for logged-in user
 */
export const getPortfolios = async () => {
  const response = await fetch(`${API_URL}/portfolio`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};

/**
 * Get single portfolio by ID
 * @param {string} portfolioId
 */
export const getPortfolioById = async (portfolioId) => {
  const response = await fetch(`${API_URL}/portfolio/${portfolioId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};

/**
 * Update portfolio
 * @param {string} portfolioId
 * @param {Object} updates - { name?, funds? }
 */
export const updatePortfolio = async (portfolioId, updates) => {
  const response = await fetch(`${API_URL}/portfolio/${portfolioId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  return handleResponse(response);
};

/**
 * Delete portfolio
 * @param {string} portfolioId
 */
export const deletePortfolio = async (portfolioId) => {
  const response = await fetch(`${API_URL}/portfolio/${portfolioId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};

export default {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
};
