/**
 * Axios API Client
 *
 * Centralized Axios instance for all API calls
 * - Uses centralized API configuration
 * - Enables credentials for cross-origin requests
 * - Can be extended with interceptors for auth, error handling, etc.
 */

import axios from "axios";
import { API_BASE_URL } from "../config/api.js";

// Use centralized API configuration
const baseURL = API_BASE_URL;

/**
 * Configured Axios instance
 * - baseURL: API server URL from environment
 * - withCredentials: true for cookie/session support across origins
 * - timeout: 30 seconds default
 */
const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * - Adds JWT token to Authorization header if available
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Handles common error scenarios
 * - Can be extended for token refresh, logout on 401, etc.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error codes
    if (error.response) {
      const { status } = error.response;

      // Unauthorized - token expired or invalid
      if (status === 401) {
        // Could trigger logout or token refresh here
        console.warn("Unauthorized request - token may be expired");
      }

      // Forbidden - user doesn't have permission
      if (status === 403) {
        console.warn("Forbidden - insufficient permissions");
      }

      // Server error
      if (status >= 500) {
        console.error(
          "Server error:",
          error.response.data?.message || "Unknown error"
        );
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      console.error("Network error - no response received");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
