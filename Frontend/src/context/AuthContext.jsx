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

const AuthContext = createContext(null);

// API base URL - uses environment variable, no hardcoded fallback in production
const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : "");

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        // Defensive JSON parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response");
        }

        if (response.ok) {
          const data = await response.json();
          setUser(data.data.user);
          setToken(storedToken);
        } else {
          // Token invalid, clear storage
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
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
   * CRITICAL: Does NOT call backend - just stores token and triggers user fetch
   * The useEffect verifyToken will handle fetching user data
   */
  const setAuthFromToken = (newToken) => {
    // Store token in localStorage and state
    localStorage.setItem("token", newToken);
    setToken(newToken);

    // Set loading to trigger re-verification on next render
    // The useEffect will pick up the token and fetch user data
    setIsLoading(true);

    // Trigger user fetch asynchronously
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });

        // Defensive JSON parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Non-JSON response received");
        }

        if (response.ok) {
          const data = await response.json();
          setUser(data.data.user);
        } else {
          // Token invalid, clear state
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    // Return immediately - caller doesn't wait for user fetch
    return Promise.resolve();
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
