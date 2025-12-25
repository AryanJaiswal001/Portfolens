import React, { useMemo } from "react";

/**
 * Simple SVG Line Chart for Performance History
 * Shows Invested vs Current Value over time
 */
const PerformanceChart = ({ data = [], height = 288, showLegend = true }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const values = data.flatMap((d) => [d.invested, d.value]);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const padding = (maxValue - minValue) * 0.1;
    const adjustedMax = maxValue + padding;
    const adjustedMin = Math.max(0, minValue - padding);

    const width = 100;
    const chartHeight = 100;

    const getY = (val) => {
      const range = adjustedMax - adjustedMin;
      return chartHeight - ((val - adjustedMin) / range) * chartHeight;
    };

    const getX = (index) => (index / (data.length - 1)) * width;

    // Generate path strings
    const investedPath = data
      .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.invested)}`)
      .join(" ");

    const valuePath = data
      .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.value)}`)
      .join(" ");

    // Area fill paths
    const investedAreaPath = `${investedPath} L ${width} ${chartHeight} L 0 ${chartHeight} Z`;
    const valueAreaPath = `${valuePath} L ${width} ${chartHeight} L 0 ${chartHeight} Z`;

    return {
      investedPath,
      valuePath,
      investedAreaPath,
      valueAreaPath,
      points: data.map((d, i) => ({
        x: getX(i),
        yInvested: getY(d.invested),
        yValue: getY(d.value),
        month: d.month,
        invested: d.invested,
        value: d.value,
      })),
      minValue: adjustedMin,
      maxValue: adjustedMax,
    };
  }, [data]);

  if (!chartData) {
    return (
      <div
        className="h-72 rounded-lg border-2 border-dashed flex items-center justify-center"
        style={{
          backgroundColor: "var(--bg-input)",
          borderColor: "var(--border-medium)",
        }}
      >
        <div className="text-center">
          <span className="text-4xl">📉</span>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            No Performance Data
          </p>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Add portfolio to see growth chart
          </p>
        </div>
      </div>
    );
  }

  const formatValue = (val) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)}L`;
    }
    return `₹${(val / 1000).toFixed(0)}K`;
  };

  return (
    <div className="w-full" style={{ height }}>
      {/* Legend */}
      {showLegend && (
        <div className="flex items-center justify-end gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#3b82f6" }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Amount Invested
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#22c55e" }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Current Value
            </span>
          </div>
        </div>
      )}

      {/* Chart Container */}
      <div
        className="relative w-full rounded-lg p-4"
        style={{
          height: height - 40,
          backgroundColor: "var(--bg-input)",
        }}
      >
        {/* Y-axis labels */}
        <div
          className="absolute left-0 top-4 bottom-8 w-12 flex flex-col justify-between text-xs"
          style={{ color: "var(--text-tertiary)" }}
        >
          <span>{formatValue(chartData.maxValue)}</span>
          <span>
            {formatValue((chartData.maxValue + chartData.minValue) / 2)}
          </span>
          <span>{formatValue(chartData.minValue)}</span>
        </div>

        {/* SVG Chart */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute left-14 right-4 top-4 bottom-8"
          style={{ height: "calc(100% - 48px)", width: "calc(100% - 72px)" }}
        >
          {/* Grid lines */}
          <defs>
            <pattern
              id="grid"
              width="25"
              height="25"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 25 0 L 0 0 0 25"
                fill="none"
                stroke="var(--border-subtle)"
                strokeWidth="0.5"
                strokeOpacity="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Invested Area (blue) */}
          <path
            d={chartData.investedAreaPath}
            fill="rgba(59, 130, 246, 0.1)"
            stroke="none"
          />

          {/* Value Area (green) */}
          <path
            d={chartData.valueAreaPath}
            fill="rgba(34, 197, 94, 0.15)"
            stroke="none"
          />

          {/* Invested Line */}
          <path
            d={chartData.investedPath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Value Line */}
          <path
            d={chartData.valuePath}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Data points */}
          {chartData.points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.yInvested}
                r="1.5"
                fill="#3b82f6"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={point.x}
                cy={point.yValue}
                r="1.5"
                fill="#22c55e"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </svg>

        {/* X-axis labels */}
        <div
          className="absolute left-14 right-4 bottom-0 flex justify-between text-xs"
          style={{ color: "var(--text-tertiary)" }}
        >
          {data.map((d, i) => (
            <span key={i} className="text-center" style={{ fontSize: "10px" }}>
              {d.month.split(" ")[0]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
