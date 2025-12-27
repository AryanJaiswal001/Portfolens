import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * OAuth Callback Handler
 *
 * Handles the redirect from Google OAuth.
 * Extracts the token from URL and stores it via AuthContext.
 */
export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthFromToken } = useAuth();
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        setStatus("Authentication failed. Redirecting...");
        setTimeout(() => {
          navigate("/signin?error=" + error);
        }, 2000);
        return;
      }

      if (token) {
        try {
          await setAuthFromToken(token);
          setStatus("Login successful! Redirecting...");
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        } catch (err) {
          setStatus("Error processing login. Redirecting...");
          setTimeout(() => {
            navigate("/signin?error=token_error");
          }, 2000);
        }
      } else {
        setStatus("No token received. Redirecting...");
        setTimeout(() => {
          navigate("/signin?error=no_token");
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setAuthFromToken]);

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
