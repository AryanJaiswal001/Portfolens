import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * OAuth Callback Handler
 *
 * Handles the redirect from Google OAuth.
 * CRITICAL: This page does NOT call the backend.
 * It only:
 * 1. Reads token from URL query param
 * 2. Stores token in localStorage
 * 3. Redirects directly to /onboarding
 */
export default function OAuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Processing...");
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    // Prevent double processing
    if (hasProcessed) return;
    setHasProcessed(true);

    // Read token from URL query param
    const token = new URLSearchParams(window.location.search).get("token");
    const error = new URLSearchParams(window.location.search).get("error");

    if (error) {
      setStatus("Authentication failed. Redirecting...");
      setTimeout(() => {
        navigate("/signin?error=" + encodeURIComponent(error), { replace: true });
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

    // Store token in localStorage - NO backend call
    localStorage.setItem("token", token);
    
    // Redirect directly to /onboarding
    setStatus("Login successful! Redirecting...");
    setTimeout(() => {
      navigate("/onboarding", { replace: true });
    }, 500);
  }, [navigate, hasProcessed]);

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
