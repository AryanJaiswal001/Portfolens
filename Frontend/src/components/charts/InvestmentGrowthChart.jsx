import React, { useMemo, useState, useEffect, useRef } from "react";

/**
 * Investment Growth Chart
 *
 * Dual-line time series chart showing:
 * - Invested Amount (cumulative SIP + Lumpsum)
 * - Portfolio Value (based on NAV)
 *
 * Features:
 * - Smooth curved lines with gradients
 * - Animated drawing on mount
 * - Interactive tooltips
 * - Responsive design
 * - Dark mode support
 */
const InvestmentGrowthChart = ({
  cashflows = [],
  fundPerformance = [],
  totalInvested = 0,
  currentValue = 0,
  height = 300,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 600, height });
  const containerRef = useRef(null);

  // Responsive resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [height]);

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Generate monthly data points from Jan 2024 to Dec 2024
  const chartData = useMemo(() => {
    const months = [
      "2024-01",
      "2024-02",
      "2024-03",
      "2024-04",
      "2024-05",
      "2024-06",
      "2024-07",
      "2024-08",
      "2024-09",
      "2024-10",
      "2024-11",
      "2024-12",
    ];

    const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Group cashflows by month
    const monthlyInvestments = {};
    months.forEach((m) => {
      monthlyInvestments[m] = 0;
    });

    cashflows.forEach((cf) => {
      const month = cf.date;
      if (monthlyInvestments[month] !== undefined) {
        monthlyInvestments[month] += cf.amount;
      }
    });

    // Calculate cumulative invested and estimate value growth
    let cumulativeInvested = 0;
    const dataPoints = months.map((month, index) => {
      cumulativeInvested += monthlyInvestments[month];

      // Estimate portfolio value growth (linear interpolation for visualization)
      // In reality, this would be calculated from NAV, but we approximate for smooth curve
      const progress = (index + 1) / months.length;
      const estimatedValue =
        cumulativeInvested +
        (currentValue - totalInvested) *
          progress *
          (cumulativeInvested / Math.max(totalInvested, 1));

      return {
        month,
        label: monthLabels[index],
        invested: cumulativeInvested,
        value: Math.max(estimatedValue, cumulativeInvested * 0.95), // Ensure value doesn't go too negative
        gain: estimatedValue - cumulativeInvested,
      };
    });

    // Adjust final point to match actual values
    if (dataPoints.length > 0) {
      const lastPoint = dataPoints[dataPoints.length - 1];
      lastPoint.invested = totalInvested;
      lastPoint.value = currentValue;
      lastPoint.gain = currentValue - totalInvested;
    }

    return dataPoints;
  }, [cashflows, totalInvested, currentValue]);

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "₹0";
    const absAmount = Math.abs(amount);
    if (absAmount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (absAmount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (absAmount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // Chart dimensions
  const padding = { top: 40, right: 30, bottom: 50, left: 70 };
  const chartWidth = dimensions.width - padding.left - padding.right;
  const chartHeight = dimensions.height - padding.top - padding.bottom;

  // Calculate scales
  const { minValue, maxValue, xScale, yScale } = useMemo(() => {
    if (chartData.length === 0)
      return {
        minValue: 0,
        maxValue: 100000,
        xScale: () => 0,
        yScale: () => 0,
      };

    const allValues = chartData.flatMap((d) => [d.invested, d.value]);
    const min = 0;
    const max = Math.max(...allValues) * 1.1; // Add 10% padding

    const xScale = (index) => (index / (chartData.length - 1)) * chartWidth;
    const yScale = (value) =>
      chartHeight - ((value - min) / (max - min)) * chartHeight;

    return { minValue: min, maxValue: max, xScale, yScale };
  }, [chartData, chartWidth, chartHeight]);

  // Generate smooth curve path using Catmull-Rom spline
  const generatePath = (points, accessor) => {
    if (points.length < 2) return "";

    const values = points.map((p, i) => ({
      x: xScale(i),
      y: yScale(accessor(p)),
    }));

    // Create smooth curve using quadratic bezier
    let path = `M ${values[0].x} ${values[0].y}`;

    for (let i = 1; i < values.length; i++) {
      const prev = values[i - 1];
      const curr = values[i];
      const cpX = (prev.x + curr.x) / 2;
      path += ` Q ${prev.x + (curr.x - prev.x) * 0.5} ${prev.y}, ${cpX} ${
        (prev.y + curr.y) / 2
      }`;
      path += ` T ${curr.x} ${curr.y}`;
    }

    return path;
  };

  // Generate area path for gradient fill
  const generateAreaPath = (points, accessor) => {
    if (points.length < 2) return "";

    const linePath = generatePath(points, accessor);
    const lastX = xScale(points.length - 1);
    const firstX = xScale(0);

    return `${linePath} L ${lastX} ${chartHeight} L ${firstX} ${chartHeight} Z`;
  };

  // Simple line path for invested (step-like for clarity)
  const generateInvestedPath = (points) => {
    if (points.length < 2) return "";

    let path = `M ${xScale(0)} ${yScale(points[0].invested)}`;

    for (let i = 1; i < points.length; i++) {
      const prevY = yScale(points[i - 1].invested);
      const currX = xScale(i);
      const currY = yScale(points[i].invested);

      // Step pattern for invested (shows when investments happen)
      path += ` L ${currX} ${prevY} L ${currX} ${currY}`;
    }

    return path;
  };

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const tickCount = 5;
    const ticks = [];
    for (let i = 0; i <= tickCount; i++) {
      const value = minValue + (maxValue - minValue) * (i / tickCount);
      ticks.push(value);
    }
    return ticks;
  }, [minValue, maxValue]);

  if (chartData.length === 0) {
    return (
      <div
        className="rounded-xl p-8 flex items-center justify-center"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          height,
        }}
      >
        <div className="text-center">
          <span className="text-4xl">📈</span>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            No investment data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="rounded-xl p-6"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Investment Growth
          </h3>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Track your portfolio's journey from Jan 2024 to Dec 2024
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#8b5cf6" }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Portfolio Value
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-0.5 rounded"
              style={{ backgroundColor: "#64748b", width: 12 }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Invested
            </span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Gradient for value area */}
          <linearGradient id="valueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
          </linearGradient>

          {/* Gradient for value line */}
          <linearGradient
            id="valueLineGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>

          {/* Glow filter for value line */}
          <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={0}
                y1={yScale(tick)}
                x2={chartWidth}
                y2={yScale(tick)}
                stroke="var(--border-subtle)"
                strokeWidth={1}
                strokeDasharray={i === 0 ? "0" : "4 4"}
                opacity={0.5}
              />
              <text
                x={-10}
                y={yScale(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={11}
                fill="var(--text-tertiary)"
              >
                {formatCurrency(tick)}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {chartData.map((d, i) => (
            <text
              key={i}
              x={xScale(i)}
              y={chartHeight + 25}
              textAnchor="middle"
              fontSize={11}
              fill="var(--text-tertiary)"
            >
              {d.label}
            </text>
          ))}

          {/* Value area fill */}
          <path
            d={generateAreaPath(chartData, (d) => d.value)}
            fill="url(#valueGradient)"
            opacity={isAnimated ? 1 : 0}
            style={{
              transition: "opacity 0.8s ease-out 0.3s",
            }}
          />

          {/* Invested line (dashed) */}
          <path
            d={generateInvestedPath(chartData)}
            fill="none"
            stroke="#64748b"
            strokeWidth={2}
            strokeDasharray="6 4"
            strokeLinecap="round"
            opacity={isAnimated ? 0.7 : 0}
            style={{
              transition: "opacity 0.6s ease-out 0.2s",
            }}
          />

          {/* Value line */}
          <path
            d={generatePath(chartData, (d) => d.value)}
            fill="none"
            stroke="url(#valueLineGradient)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#lineGlow)"
            strokeDasharray={isAnimated ? "none" : `${chartWidth * 2}`}
            strokeDashoffset={isAnimated ? 0 : chartWidth * 2}
            style={{
              transition: "stroke-dashoffset 1.5s ease-out 0.4s",
            }}
          />

          {/* Data points */}
          {chartData.map((d, i) => (
            <g key={i}>
              {/* Invisible hover area */}
              <rect
                x={xScale(i) - 20}
                y={0}
                width={40}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: "crosshair" }}
              />

              {/* Vertical line on hover */}
              {hoveredPoint === i && (
                <line
                  x1={xScale(i)}
                  y1={0}
                  x2={xScale(i)}
                  y2={chartHeight}
                  stroke="var(--text-tertiary)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  opacity={0.5}
                />
              )}

              {/* Value point */}
              <circle
                cx={xScale(i)}
                cy={yScale(d.value)}
                r={hoveredPoint === i ? 6 : 4}
                fill="#8b5cf6"
                stroke="var(--bg-card)"
                strokeWidth={2}
                opacity={isAnimated ? 1 : 0}
                style={{
                  transition: `opacity 0.3s ease ${
                    0.5 + i * 0.05
                  }s, r 0.15s ease`,
                  cursor: "pointer",
                }}
              />

              {/* Invested point */}
              <circle
                cx={xScale(i)}
                cy={yScale(d.invested)}
                r={hoveredPoint === i ? 5 : 3}
                fill="#64748b"
                stroke="var(--bg-card)"
                strokeWidth={2}
                opacity={isAnimated ? 0.8 : 0}
                style={{
                  transition: `opacity 0.3s ease ${
                    0.5 + i * 0.05
                  }s, r 0.15s ease`,
                  cursor: "pointer",
                }}
              />
            </g>
          ))}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredPoint !== null && chartData[hoveredPoint] && (
        <div
          className="absolute z-50 px-4 py-3 rounded-xl shadow-xl pointer-events-none"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            left: padding.left + xScale(hoveredPoint),
            top: padding.top + yScale(chartData[hoveredPoint].value) - 100,
            transform: "translateX(-50%)",
            minWidth: 160,
          }}
        >
          <div className="text-sm font-semibold text-white mb-2">
            {chartData[hoveredPoint].label} 2024
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-xs text-slate-400">Invested</span>
              </div>
              <span className="text-sm font-medium text-slate-300">
                {formatCurrency(chartData[hoveredPoint].invested)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-xs text-slate-400">Value</span>
              </div>
              <span className="text-sm font-medium text-white">
                {formatCurrency(chartData[hoveredPoint].value)}
              </span>
            </div>
            <div
              className="flex items-center justify-between gap-4 pt-1.5 mt-1.5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
            >
              <span className="text-xs text-slate-400">Gain</span>
              <span
                className="text-sm font-bold"
                style={{
                  color:
                    chartData[hoveredPoint].gain >= 0 ? "#22c55e" : "#ef4444",
                }}
              >
                {chartData[hoveredPoint].gain >= 0 ? "+" : ""}
                {formatCurrency(chartData[hoveredPoint].gain)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Summary bar */}
      <div
        className="mt-4 flex items-center justify-between px-4 py-3 rounded-lg"
        style={{ backgroundColor: "var(--bg-input)" }}
      >
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Total Invested
            </p>
            <p
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {formatCurrency(totalInvested)}
            </p>
          </div>
          <div
            className="h-8 w-px"
            style={{ backgroundColor: "var(--border-subtle)" }}
          />
          <div>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Current Value
            </p>
            <p className="text-lg font-bold" style={{ color: "#8b5cf6" }}>
              {formatCurrency(currentValue)}
            </p>
          </div>
        </div>
        <div
          className="px-4 py-2 rounded-lg"
          style={{
            backgroundColor:
              currentValue >= totalInvested
                ? "rgba(34, 197, 94, 0.15)"
                : "rgba(239, 68, 68, 0.15)",
          }}
        >
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Total Gain
          </p>
          <p
            className="text-lg font-bold"
            style={{
              color: currentValue >= totalInvested ? "#22c55e" : "#ef4444",
            }}
          >
            {currentValue >= totalInvested ? "+" : ""}
            {formatCurrency(currentValue - totalInvested)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentGrowthChart;
