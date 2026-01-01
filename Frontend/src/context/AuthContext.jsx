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

// API base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // Store token and user
    localStorage.setItem("token", data.data.token);
    setToken(data.data.token);
    setUser(data.data.user);

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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Store token and user
    localStorage.setItem("token", data.data.token);
    setToken(data.data.token);
    setUser(data.data.user);

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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Google login failed");
    }

    localStorage.setItem("token", data.data.token);
    setToken(data.data.token);
    setUser(data.data.user);

    return data;
  };

  /**
   * Set auth from OAuth callback (token from URL)
   * Returns a promise that resolves with user data after hydration
   */
  const setAuthFromToken = async (newToken) => {
    // Set loading to true during token verification
    setIsLoading(true);

    localStorage.setItem("token", newToken);
    setToken(newToken);

    // Fetch user data
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
        setIsLoading(false);
        return data.data.user; // Return user data for caller
      } else {
        // Token invalid, clear state
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsLoading(false);
        throw new Error("Invalid token");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setIsLoading(false);
      throw error;
    }
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
