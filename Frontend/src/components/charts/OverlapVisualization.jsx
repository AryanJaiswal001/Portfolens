import React from "react";

/**
 * Visual representation of stock overlap between funds
 * Shows which stocks appear in multiple funds with severity indicators
 */
const OverlapVisualization = ({ stockOverlap = [], totalFunds = 0 }) => {
  if (!stockOverlap || stockOverlap.length === 0) {
    return (
      <div
        className="h-64 rounded-lg border-2 border-dashed flex items-center justify-center"
        style={{
          backgroundColor: "var(--bg-input)",
          borderColor: "var(--border-medium)",
        }}
      >
        <div className="text-center">
          <span className="text-4xl">🔄</span>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            No Overlap Data
          </p>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Add portfolio to analyze stock overlaps
          </p>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return { bg: "#ef4444", light: "rgba(239, 68, 68, 0.2)" };
      case "moderate":
        return { bg: "#f59e0b", light: "rgba(245, 158, 11, 0.2)" };
      default:
        return { bg: "#22c55e", light: "rgba(34, 197, 94, 0.2)" };
    }
  };

  // Calculate max exposure for scaling bars
  const maxExposure = Math.max(...stockOverlap.map((s) => s.combinedExposure));

  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: "var(--bg-input)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Top Overlapping Stocks
          </h4>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Stocks held across multiple funds
          </p>
        </div>
        <div
          className="text-xs px-2 py-1 rounded-full"
          style={{
            backgroundColor: "var(--bg-card)",
            color: "var(--text-secondary)",
          }}
        >
          {totalFunds} Funds
        </div>
      </div>

      {/* Overlap Bars */}
      <div className="space-y-3">
        {stockOverlap.slice(0, 5).map((stock, index) => {
          const colors = getSeverityColor(stock.severity);
          const barWidth = (stock.combinedExposure / maxExposure) * 100;

          return (
            <div key={index} className="relative">
              {/* Stock Name and Info */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors.bg }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {stock.stock}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {stock.fundsHolding}/{stock.totalFunds} funds
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: colors.bg }}
                  >
                    {stock.combinedExposure}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--border-subtle)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    background: `linear-gradient(90deg, ${colors.light} 0%, ${colors.bg} 100%)`,
                  }}
                />
              </div>

              {/* Fund Indicator Dots */}
              <div className="flex items-center gap-1 mt-1">
                {[...Array(stock.totalFunds)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full transition-colors"
                    style={{
                      backgroundColor:
                        i < stock.fundsHolding
                          ? colors.bg
                          : "var(--border-medium)",
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div
        className="mt-4 pt-4 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          Overlap Score
        </span>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#ef4444" }}
            />
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#f59e0b" }}
            />
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#22c55e" }}
            />
          </div>
          <span
            className="text-xs font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            High • Moderate • Low
          </span>
        </div>
      </div>
    </div>
  );
};

export default OverlapVisualization;
