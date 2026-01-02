import { Navigate, useLocation } from "react-router-dom";

/**
 * Protected Route Component
 *
 * Wraps routes that require authentication.
 * CRITICAL: Only checks token existence in localStorage.
 * Does NOT fetch /me or validate token.
 * Does NOT redirect on API failure.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();

  // Only check token existence - no API calls, no loading states
  const token = localStorage.getItem("token");

  if (!token) {
    // No token - redirect to signin
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Token exists - allow access immediately
  return children;
}
