import { Component } from "react";
import { Link } from "react-router-dom";

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in child component tree and
 * displays a fallback UI instead of a blank screen.
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console (and optionally to error reporting service)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });

    // TODO: Send to error reporting service (Sentry, LogRocket, etc.)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
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
            {/* Error Icon */}
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="#ef4444"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Something went wrong
            </h1>
            <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
              We encountered an unexpected error. Don't worry, your data is
              safe.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
                  color: "white",
                }}
              >
                Try Again
              </button>

              <Link
                to="/dashboard"
                className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200"
                style={{
                  backgroundColor: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                }}
              >
                Go to Dashboard
              </Link>
            </div>

            {/* Debug Info (Development Only) */}
            {import.meta.env.DEV && this.state.error && (
              <details
                className="mt-6 text-left text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                <summary className="cursor-pointer mb-2">
                  Error Details (Dev Only)
                </summary>
                <pre
                  className="p-3 rounded-lg overflow-auto text-xs"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    maxHeight: "200px",
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
