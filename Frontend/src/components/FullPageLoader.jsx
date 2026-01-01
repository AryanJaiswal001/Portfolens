/**
 * Full Page Loader Component
 *
 * Reusable loading spinner for full-page loading states.
 * Used for:
 * - Initial app load
 * - Auth verification
 * - Route transitions
 * - Data fetching states
 */
export default function FullPageLoader({ message = "Loading..." }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-app)" }}
    >
      <div className="text-center">
        {/* Animated Spinner */}
        <div
          className="w-12 h-12 mx-auto mb-4 border-4 border-t-transparent rounded-full animate-spin"
          style={{
            borderColor: "var(--accent-purple)",
            borderTopColor: "transparent",
          }}
        />

        {/* Loading Message */}
        <p
          className="text-base font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
