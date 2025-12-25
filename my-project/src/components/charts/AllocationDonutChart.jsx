import React, { useMemo } from "react";

/**
 * Simple SVG Donut Chart for Asset Allocation
 * Shows percentage breakdown with colored segments
 */
const AllocationDonutChart = ({
  data = {},
  size = 200,
  strokeWidth = 35,
  showLegend = true,
}) => {
  const chartData = useMemo(() => {
    const colors = {
      equity: "#3b82f6",
      debt: "#22c55e",
      gold: "#eab308",
      cash: "#8b5cf6",
      other: "#6b7280",
    };

    const entries = Object.entries(data).filter(([_, value]) => value > 0);

    if (entries.length === 0) return null;

    let cumulativePercent = 0;
    const segments = entries.map(([key, value]) => {
      const startPercent = cumulativePercent;
      cumulativePercent += value;
      return {
        key,
        value,
        color: colors[key] || colors.other,
        startPercent,
        endPercent: cumulativePercent,
        label: key.charAt(0).toUpperCase() + key.slice(1),
      };
    });

    return segments;
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return (
      <div
        className="h-52 rounded-lg border-2 border-dashed flex items-center justify-center"
        style={{
          backgroundColor: "var(--bg-input)",
          borderColor: "var(--border-medium)",
        }}
      >
        <div className="text-center">
          <span className="text-4xl">🥧</span>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            No Allocation Data
          </p>
        </div>
      </div>
    );
  }

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate total value for center display
  const totalValue = chartData.reduce((sum, seg) => sum + seg.value, 0);

  return (
    <div className="flex flex-col items-center">
      {/* SVG Donut */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth={strokeWidth}
          />

          {/* Colored segments */}
          {chartData.map((segment, index) => {
            const dashLength = (segment.value / 100) * circumference;
            const dashOffset =
              circumference - (segment.startPercent / 100) * circumference;

            return (
              <circle
                key={segment.key}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{
                  transition:
                    "stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease",
                }}
              />
            );
          })}
        </svg>

        {/* Center text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ color: "var(--text-primary)" }}
        >
          <span className="text-3xl font-bold">{totalValue}%</span>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Allocated
          </span>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 grid grid-cols-2 gap-3 w-full">
          {chartData.map((segment) => (
            <div
              key={segment.key}
              className="flex items-center justify-between p-2 rounded-lg"
              style={{ backgroundColor: "var(--bg-input)" }}
            >
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: segment.color }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {segment.label}
                </span>
              </div>
              <span
                className="text-sm font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {segment.value}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllocationDonutChart;
