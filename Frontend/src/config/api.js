/**
 * API Configuration
 *
 * Single source of truth for API base URL across the application.
 * All services should import API_BASE_URL from this file.
 *
 * Production: https://portfolens.onrender.com/api
 * Development: http://localhost:5000/api
 */

// Get API base URL from environment variable
const envApiUrl = import.meta.env.VITE_API_BASE_URL;

// Determine if we're in development mode
const isDev = import.meta.env.DEV;

// Production backend URL (used when env var is missing in production)
const PRODUCTION_API_URL = "https://portfolens.onrender.com/api";
const DEV_API_URL = "http://localhost:5000/api";

/**
 * API Base URL
 *
 * Priority:
 * 1. VITE_API_BASE_URL environment variable (if set)
 * 2. Development fallback (if in dev mode)
 * 3. Production fallback (if in production and env var missing)
 */
export const API_BASE_URL =
  envApiUrl || (isDev ? DEV_API_URL : PRODUCTION_API_URL);

// Safety check: Log warning if environment variable is not defined
if (!envApiUrl) {
  console.warn(
    `[API Config] VITE_API_BASE_URL is not defined. Using ${
      isDev ? "development" : "production"
    } fallback: ${API_BASE_URL}`
  );
}

/**
 * Backend Base URL (without /api suffix)
 * Used for OAuth redirects which go to /auth/* not /api/auth/*
 */
export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/, "");

// Log the configured URLs in development for debugging
if (isDev) {
  console.log("[API Config] API_BASE_URL:", API_BASE_URL);
  console.log("[API Config] BACKEND_BASE_URL:", BACKEND_BASE_URL);
}

export default {
  API_BASE_URL,
  BACKEND_BASE_URL,
};
