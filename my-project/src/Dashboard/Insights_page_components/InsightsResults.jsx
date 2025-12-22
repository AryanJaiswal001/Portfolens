import ThemeToggle from "../../components/ThemeToggle";

export default function InsightsResults() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Insights
            </h1>
            <p className="text-base" style={{ color: "var(--text-secondary)" }}>
              Understand how your portfolio behaves over time
            </p>
          </div>
          <div className="ml-6">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Insight Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Invested */}
        <div
          className="rounded-xl p-6 transition-shadow hover:shadow-lg"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: "var(--text-secondary)" }}
            >
              Total Invested
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(37, 99, 235, 0.15)" }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: "var(--accent-blue)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div
            className="text-3xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            —
          </div>
          <div className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Principal amount
          </div>
        </div>

        {/* Current Value */}
        <div
          className="rounded-xl p-6 transition-shadow hover:shadow-lg"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: "var(--text-secondary)" }}
            >
              Current Value
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(34, 197, 94, 0.15)" }}
            >
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
          <div
            className="text-3xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            —
          </div>
          <div className="text-sm font-medium text-green-500">+— % overall</div>
        </div>

        {/* Risk Level */}
        <div
          className="rounded-xl p-6 transition-shadow hover:shadow-lg"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: "var(--text-secondary)" }}
            >
              Risk Level
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(245, 158, 11, 0.15)" }}
            >
              <svg
                className="w-5 h-5 text-amber-500"
                fill="none"
                stroke="currentColor"
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
          </div>
          <div
            className="text-3xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            —
          </div>
          <div className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Based on allocation
          </div>
        </div>

        {/* Diversification Score */}
        <div
          className="rounded-xl p-6 transition-shadow hover:shadow-lg"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: "var(--text-secondary)" }}
            >
              Diversification
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(147, 51, 234, 0.15)" }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: "var(--accent-purple)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            </div>
          </div>
          <div
            className="text-3xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            —
          </div>
          <div className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Fund overlap analysis
          </div>
        </div>
      </div>

      {/* Investment Growth Section */}
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2
              className="text-xl font-bold mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Investment Over Time
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Tracks how much you invested vs how it grew over time
            </p>
          </div>
          <div className="flex gap-2">
            {["1M", "6M", "1Y", "All"].map((period, index) => (
              <button
                key={period}
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor:
                    index === 2 ? "var(--accent-blue)" : "var(--bg-input)",
                  color: index === 2 ? "#ffffff" : "var(--text-secondary)",
                  border:
                    index !== 2 ? "1px solid var(--border-subtle)" : "none",
                }}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Placeholder */}
        <div
          className="h-72 rounded-lg border-2 border-dashed flex items-center justify-center"
          style={{
            backgroundColor: "var(--bg-input)",
            borderColor: "var(--border-medium)",
          }}
        >
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: "rgba(37, 99, 235, 0.15)" }}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: "var(--accent-blue)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Line chart will appear here
            </p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Investment vs Current Value over time
            </p>
          </div>
        </div>
      </div>

      {/* Allocation & Overlap Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2
            className="text-xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Asset Allocation
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            How your portfolio is distributed across asset classes
          </p>

          {/* Donut Chart Placeholder */}
          <div
            className="h-52 rounded-lg border-2 border-dashed flex items-center justify-center mb-6"
            style={{
              backgroundColor: "var(--bg-input)",
              borderColor: "var(--border-medium)",
            }}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: "rgba(147, 51, 234, 0.15)" }}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: "var(--accent-purple)" }}
                >
                  <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2v10l7 4"
                  />
                </svg>
              </div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Donut chart
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {[
              { label: "Equity", color: "#3b82f6" },
              { label: "Debt", color: "#22c55e" },
              { label: "Gold", color: "#eab308" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: "var(--bg-input)" }}
              >
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.label}
                  </span>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  —%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fund Overlap */}
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2
            className="text-xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Fund Overlap
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Checks if your funds hold similar stocks (diversification check)
          </p>

          {/* Overlap Visualization Placeholder */}
          <div
            className="h-52 rounded-lg border-2 border-dashed flex items-center justify-center mb-6"
            style={{
              backgroundColor: "var(--bg-input)",
              borderColor: "var(--border-medium)",
            }}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: "rgba(99, 102, 241, 0.15)" }}
              >
                <svg
                  className="w-8 h-8 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="9" cy="12" r="7" strokeWidth={2} />
                  <circle cx="15" cy="12" r="7" strokeWidth={2} />
                </svg>
              </div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Overlap visualization
              </p>
            </div>
          </div>

          {/* Overlap Insight */}
          <div
            className="rounded-lg p-4"
            style={{ background: "var(--bg-button-primary)" }}
          >
            <p className="text-sm font-bold text-white mb-1">
              Overlap Score: —%
            </p>
            <p className="text-xs text-white/80">
              Lower is better. High overlap means your funds hold similar
              stocks.
            </p>
          </div>
        </div>
      </div>

      {/* Fund Performance Section */}
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <h2
          className="text-xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Fund Performance
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          Individual fund behavior and returns
        </p>

        {/* Fund Cards */}
        <div className="space-y-4">
          {/* Fund 1 Placeholder */}
          <div
            className="rounded-lg p-5 transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--bg-input)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3
                  className="font-semibold text-base"
                  style={{ color: "var(--text-primary)" }}
                >
                  Fund Name
                </h3>
                <p
                  className="text-sm mt-0.5"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Large Cap Equity
                </p>
              </div>
              <div className="text-right">
                <div
                  className="text-xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  —%
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Returns
                </div>
              </div>
            </div>
            <div
              className="h-2.5 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--border-subtle)" }}
            >
              <div
                className="h-full w-0"
                style={{
                  background: "linear-gradient(to right, #22c55e, #16a34a)",
                }}
              ></div>
            </div>
          </div>

          {/* Fund 2 Placeholder */}
          <div
            className="rounded-lg p-5 transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--bg-input)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3
                  className="font-semibold text-base"
                  style={{ color: "var(--text-primary)" }}
                >
                  Fund Name
                </h3>
                <p
                  className="text-sm mt-0.5"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Debt Fund
                </p>
              </div>
              <div className="text-right">
                <div
                  className="text-xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  —%
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Returns
                </div>
              </div>
            </div>
            <div
              className="h-2.5 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--border-subtle)" }}
            >
              <div
                className="h-full w-0"
                style={{
                  background: "linear-gradient(to right, #3b82f6, #2563eb)",
                }}
              ></div>
            </div>
          </div>

          {/* Empty State */}
          <div
            className="text-center py-12 border-2 border-dashed rounded-lg"
            style={{
              backgroundColor: "var(--bg-input)",
              borderColor: "var(--border-medium)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: "var(--border-subtle)" }}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: "var(--text-tertiary)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Add more funds to see detailed performance
            </p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              More funds will appear here as you add them
            </p>
          </div>
        </div>
      </div>

      {/* Educational Insight Banner */}
      <div
        className="relative overflow-hidden rounded-xl p-6 shadow-lg"
        style={{ background: "var(--bg-button-primary)" }}
      >
        <div
          className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 opacity-20 rounded-full blur-2xl"
          style={{ backgroundColor: "#ffffff" }}
        ></div>
        <div
          className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 opacity-20 rounded-full blur-2xl"
          style={{ backgroundColor: "#ffffff" }}
        ></div>

        <div className="relative flex items-start">
          <div className="flex-shrink-0 mt-1">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>
          <div className="ml-5 flex-1">
            <h3 className="text-base font-bold text-white mb-2">
              💡 Portfolio Insight
            </h3>
            <p className="text-sm text-white/90 leading-relaxed">
              Your portfolio's performance should be evaluated after adjusting
              for inflation. A 7% return with 6% inflation is effectively just
              1% real growth. Always consider the{" "}
              <strong className="text-white">inflation-adjusted returns</strong>{" "}
              for accurate financial planning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
