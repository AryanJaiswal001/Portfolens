import { createContext, useContext, useState, useEffect } from "react";

/**
 * Auth Context
 *
 * Manages authentication state across the app:
 * - user: Current logged-in user object
 * - token: JWT token
 * - isAuthenticated: Boolean for quick checks
 * - isLoading: True while checking auth status
 */

import { API_BASE_URL } from "../config/api.js";

const AuthContext = createContext(null);

// Use centralized API configuration
const API_URL = API_BASE_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  // NOTE: This is optional - just fetches user data if token exists
  // It does NOT clear token on failure to prevent redirect loops
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      // Token exists - set it in state immediately
      setToken(storedToken);

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        // Defensive JSON parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          // Non-JSON response - just log and continue, don't clear token
          console.warn("Auth /me returned non-JSON response");
          setIsLoading(false);
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setUser(data.data.user);
        }
        // NOTE: We intentionally do NOT clear token on failure
        // This prevents redirect loops during OAuth callback
      } catch (error) {
        console.error("Auth verification error:", error);
        // NOTE: We intentionally do NOT clear token on error
        // This prevents redirect loops during OAuth callback
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  /**
   * Register a new user
   */
  const register = async (name, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    // Defensive JSON parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Non-JSON response received");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // Store token and user - using top-level fields per new contract
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);

    return data;
  };

  /**
   * Login user with email and password
   */
  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Defensive JSON parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Non-JSON response received");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Store token and user - using top-level fields per new contract
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);

    return data;
  };

  /**
   * Login with Google OAuth token
   */
  const loginWithGoogle = async (googleProfile) => {
    const response = await fetch(`${API_URL}/auth/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: "google",
        profile: googleProfile,
      }),
    });

    // Defensive JSON parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Non-JSON response received");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Google login failed");
    }

    // OAuth token exchange still uses data.data format
    localStorage.setItem("token", data.data.token);
    setToken(data.data.token);
    setUser(data.data.user);

    return data;
  };

  /**
   * Set auth from OAuth callback (token from URL)
   * CRITICAL: Does NOT call backend - just stores token
   * User data will be fetched lazily when needed
   */
  const setAuthFromToken = (newToken) => {
    // Store token in localStorage and state
    localStorage.setItem("token", newToken);
    setToken(newToken);
    // Don't set loading - let the page render immediately
    // User data can be fetched later if needed
    setIsLoading(false);
  };

  /**
   * Logout user
   */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  /**
   * Mark onboarding as complete
   */
  const completeOnboarding = async () => {
    const response = await fetch(`${API_URL}/auth/onboarding/complete`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Defensive JSON parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Non-JSON response received");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to complete onboarding");
    }

    setUser(data.data.user);
    return data;
  };

  /**
   * Update user profile
   */
  const updateProfile = async (updates) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    // Defensive JSON parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Non-JSON response received");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Update failed");
    }

    setUser(data.data.user);
    return data;
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    hasCompletedOnboarding: user?.onboardingComplete ?? false,
    register,
    login,
    loginWithGoogle,
    setAuthFromToken,
    logout,
    completeOnboarding,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
