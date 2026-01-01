import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * OAuth Callback Handler
 *
 * Handles the redirect from Google OAuth.
 * Extracts the token from URL and stores it via AuthContext.
 * CRITICAL: Only navigates AFTER auth state is fully hydrated.
 * Redirects to onboarding if first-time user, otherwise to dashboard.
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

    const handleCallback = async () => {
      setHasProcessed(true);
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        setStatus("Authentication failed. Redirecting...");
        setTimeout(() => {
          navigate("/signin?error=" + encodeURIComponent(error), {
            replace: true,
          });
        }, 2000);
        return;
      }

      if (!token) {
        setStatus("No token received. Redirecting...");
        setTimeout(() => {
          navigate("/signin?error=no_token", { replace: true });
        }, 2000);
        return;
      }

      try {
        setStatus("Verifying credentials...");

        // CRITICAL: Wait for setAuthFromToken to complete and return user
        const userData = await setAuthFromToken(token);

        setStatus("Login successful! Redirecting...");

        // Always navigate to Choice Screen after login
        setTimeout(() => {
          navigate("/onboarding", { replace: true });
        }, 500);
      } catch (err) {
        console.error("OAuth callback error:", err);
        setStatus("Error processing login. Redirecting...");
        setTimeout(() => {
          navigate("/signin?error=token_error", { replace: true });
        }, 2000);
      }
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
