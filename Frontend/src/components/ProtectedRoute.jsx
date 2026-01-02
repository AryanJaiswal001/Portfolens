import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FullPageLoader from "./FullPageLoader";

/**
 * Protected Route Component
 *
 * Wraps routes that require authentication.
 * NEVER returns null - always shows loading, redirect, or children.
 * Redirects to signin if not authenticated.
 *
 * Flow:
 * 1. If loading (checking auth or fetching user), show loader
 * 2. If no token, redirect to signin
 * 3. If token exists (even if user not yet loaded), show children
 *    - This allows onboarding to render while user data loads
 */
export default function ProtectedRoute({ children }) {
  const { token, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth - NEVER return null
  if (isLoading) {
    return <FullPageLoader message="Checking authentication..." />;
  }

  // Check for token presence first (for OAuth callback flow)
  // Token exists but user might still be loading - that's OK for onboarding
  if (!token) {
    // No token at all - redirect to signin
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Token exists - allow access (user data may still be loading in background)
  return children;
}
