import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protected Route Component
 *
 * Wraps routes that require authentication.
 * Redirects to signin if not authenticated.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-app)" }}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 mx-auto mb-4 border-4 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: "var(--accent-purple)",
              borderTopColor: "transparent",
            }}
          />
          <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
