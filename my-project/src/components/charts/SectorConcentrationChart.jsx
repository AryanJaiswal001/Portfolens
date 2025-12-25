import React from "react";

/**
 * Horizontal bar chart for sector concentration
 */
const SectorConcentrationChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div
        className="h-48 rounded-lg border-2 border-dashed flex items-center justify-center"
        style={{
          backgroundColor: "var(--bg-input)",
          borderColor: "var(--border-medium)",
        }}
      >
        <div className="text-center">
          <span className="text-4xl">📊</span>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            No Sector Data
          </p>
        </div>
      </div>
    );
  }

  const colors = [
    "#3b82f6", // Blue
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#22c55e", // Green
    "#eab308", // Yellow
    "#f97316", // Orange
    "#ef4444", // Red
    "#ec4899", // Pink
  ];

  const maxPercentage = Math.max(...data.map((s) => s.percentage));

  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: "var(--bg-input)" }}
    >
      <div className="space-y-3">
        {data.map((sector, index) => {
          const barWidth = (sector.percentage / maxPercentage) * 100;
          const color = colors[index % colors.length];

          return (
            <div key={index}>
              {/* Label and Value */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {sector.sector}
                </span>
                <span className="text-sm font-bold" style={{ color }}>
                  {sector.percentage}%
                </span>
              </div>

              {/* Bar */}
              <div
                className="h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--border-subtle)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    background: `linear-gradient(90deg, ${color}40 0%, ${color} 100%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectorConcentrationChart;
