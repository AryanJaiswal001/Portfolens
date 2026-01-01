import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

/**
 * NotFound (404) Page
 *
 * Displayed when user navigates to a route that doesn't exist.
 * Provides clear navigation options to prevent user from being trapped.
 */
export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--bg-app)" }}
    >
      <div
        className="max-w-md w-full p-8 rounded-2xl text-center"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        {/* 404 Illustration */}
        <div className="mb-6">
          <div
            className="text-8xl font-bold"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </div>
        </div>

        {/* Error Message */}
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Page Not Found
        </h1>
        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
              color: "white",
            }}
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200"
            style={{
              backgroundColor: "var(--bg-input)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
