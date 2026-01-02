import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * OAuth Callback Handler
 *
 * Handles the redirect from Google OAuth.
 * CRITICAL: This page does NOT call the backend.
 * It only:
 * 1. Reads token from URL
 * 2. Stores token via AuthContext
 * 3. Redirects to /onboarding
 */
export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthFromToken } = useAuth();
  const [status, setStatus] = useState("Processing...");
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    // Prevent double processing
    if (hasProcessed) return;

    const handleCallback = () => {
      setHasProcessed(true);
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        setStatus("Authentication failed. Redirecting...");
        setTimeout(() => {
          navigate("/signin?error=" + encodeURIComponent(error), {
            replace: true,
          });
        }, 1500);
        return;
      }

      if (!token) {
        setStatus("No token received. Redirecting...");
        setTimeout(() => {
          navigate("/signin?error=no_token", { replace: true });
        }, 1500);
        return;
      }

      // Store token - this does NOT call backend, just stores and triggers async fetch
      setStatus("Setting up your session...");
      setAuthFromToken(token);

      // Navigate to onboarding immediately
      // The ProtectedRoute will show loading while user data is being fetched
      setStatus("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/onboarding", { replace: true });
      }, 500);
    };

    handleCallback();
  }, [searchParams, navigate, setAuthFromToken, hasProcessed]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-app)" }}
    >
      <div
        className="p-8 rounded-2xl text-center"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        {/* Loading Spinner */}
        <div
          className="w-12 h-12 mx-auto mb-4 border-4 border-t-transparent rounded-full animate-spin"
          style={{
            borderColor: "var(--accent-purple)",
            borderTopColor: "transparent",
          }}
        />

        <h2
          className="text-xl font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {status}
        </h2>

        <p style={{ color: "var(--text-secondary)" }}>
          Please wait while we complete your sign-in.
        </p>
      </div>
    </div>
  );
}
