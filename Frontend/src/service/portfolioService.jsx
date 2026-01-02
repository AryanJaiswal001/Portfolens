/**
 * Portfolio API Service
 *
 * Handles all portfolio-related API calls
 * - Always includes JWT token in headers
 * - Never sends userId (backend extracts from token)
 */

// API base URL - uses environment variable, no hardcoded fallback in production
const API_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "");

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
