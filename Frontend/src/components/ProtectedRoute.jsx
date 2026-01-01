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
 * NOTE: Choice Screen (/onboarding) is shown after every login via the login flows,
 * not via route guards. This allows users to refresh the dashboard without being
 * sent back to the choice screen.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth - NEVER return null
  if (isLoading) {
    return <FullPageLoader message="Checking authentication..." />;
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // User is authenticated - allow access to all protected routes
  return children;
}
