import React, { useMemo, useState, useEffect } from "react";

/**
 * Enhanced SVG Donut Chart for Asset Allocation
 * Features: Gradient fills, animations, center label with total invested, hover tooltips
 */
const AllocationDonutChart = ({
  data = {},
  size = 200,
  strokeWidth = 35,
  showLegend = true,
  totalInvested = null, // Pass total invested amount for center display
}) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [isAnimated, setIsAnimated] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const chartData = useMemo(() => {
    const colorConfigs = {
      equity: {
        primary: "#3b82f6",
        gradient: "#60a5fa",
        glow: "rgba(59, 130, 246, 0.3)",
      },
      debt: {
        primary: "#22c55e",
        gradient: "#4ade80",
        glow: "rgba(34, 197, 94, 0.3)",
      },
      gold: {
        primary: "#eab308",
        gradient: "#facc15",
        glow: "rgba(234, 179, 8, 0.3)",
      },
      cash: {
        primary: "#8b5cf6",
        gradient: "#a78bfa",
        glow: "rgba(139, 92, 246, 0.3)",
      },
      other: {
        primary: "#6b7280",
        gradient: "#9ca3af",
        glow: "rgba(107, 114, 128, 0.3)",
      },
    };

    const entries = Object.entries(data).filter(([_, value]) => value > 0);

    if (entries.length === 0) return null;

    let cumulativePercent = 0;
    const segments = entries.map(([key, value]) => {
      const startPercent = cumulativePercent;
      cumulativePercent += value;
      const colors = colorConfigs[key] || colorConfigs.other;
      return {
        key,
        value,
        ...colors,
        startPercent,
        endPercent: cumulativePercent,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        amount: totalInvested ? (totalInvested * value) / 100 : null,
      };
    });

    return segments;
  }, [data, totalInvested]);

  // Format currency for display
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return null;
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toLocaleString("en-IN")}`;
  };

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
    <div className="flex flex-col items-center relative">
      {/* SVG Donut with Gradients */}
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          transform: isAnimated ? "scale(1)" : "scale(0.8)",
          opacity: isAnimated ? 1 : 0,
          transition:
            "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease-out",
        }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Define gradients */}
          <defs>
            {chartData.map((segment) => (
              <linearGradient
                key={`gradient-${segment.key}`}
                id={`gradient-${segment.key}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={segment.gradient} />
                <stop offset="100%" stopColor={segment.primary} />
              </linearGradient>
            ))}
            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth={strokeWidth}
            opacity={0.3}
          />

          {/* Colored segments with gradients */}
          {chartData.map((segment, index) => {
            const dashLength = (segment.value / 100) * circumference;
            const dashOffset =
              circumference - (segment.startPercent / 100) * circumference;
            const isHovered = hoveredSegment === segment.key;

            return (
              <circle
                key={segment.key}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={`url(#gradient-${segment.key})`}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={
                  isAnimated
                    ? `${dashLength} ${circumference - dashLength}`
                    : `0 ${circumference}`
                }
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                filter={isHovered ? "url(#glow)" : undefined}
                style={{
                  cursor: "pointer",
                  transition:
                    "stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke-width 0.2s ease",
                  transitionDelay: isAnimated ? `${index * 0.1}s` : "0s",
                }}
                onMouseEnter={() => setHoveredSegment(segment.key)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            );
          })}
        </svg>

        {/* Center text - Shows Total Invested or Percentage */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{
            color: "var(--text-primary)",
            transform: isAnimated ? "scale(1)" : "scale(0)",
            transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s",
          }}
        >
          {totalInvested !== null ? (
            <>
              <span
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {formatCurrency(totalInvested)}
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Total Invested
              </span>
            </>
          ) : (
            <>
              <span className="text-3xl font-bold">{totalValue}%</span>
              <span
                className="text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                Allocated
              </span>
            </>
          )}
        </div>

        {/* Hover Tooltip */}
        {hoveredSegment && (
          <div
            className="absolute z-50 px-3 py-2 rounded-lg shadow-lg pointer-events-none"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-medium)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -140%)",
              minWidth: "120px",
            }}
          >
            {chartData
              .filter((s) => s.key === hoveredSegment)
              .map((segment) => (
                <div key={segment.key} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: segment.primary }}
                    />
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {segment.label}
                    </span>
                  </div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: segment.primary }}
                  >
                    {segment.value}%
                  </div>
                  {segment.amount !== null && (
                    <div
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {formatCurrency(segment.amount)}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Enhanced Legend */}
      {showLegend && (
        <div
          className="mt-4 grid grid-cols-2 gap-3 w-full"
          style={{
            opacity: isAnimated ? 1 : 0,
            transform: isAnimated ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.4s ease 0.4s, transform 0.4s ease 0.4s",
          }}
        >
          {chartData.map((segment) => {
            const isHovered = hoveredSegment === segment.key;
            return (
              <div
                key={segment.key}
                className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: isHovered ? segment.glow : "var(--bg-input)",
                  border: isHovered
                    ? `1px solid ${segment.primary}`
                    : "1px solid transparent",
                  transform: isHovered ? "scale(1.02)" : "scale(1)",
                }}
                onMouseEnter={() => setHoveredSegment(segment.key)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      background: `linear-gradient(135deg, ${segment.gradient}, ${segment.primary})`,
                      boxShadow: isHovered ? `0 0 8px ${segment.glow}` : "none",
                    }}
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
                  style={{
                    color: isHovered ? segment.primary : "var(--text-primary)",
                  }}
                >
                  {segment.value}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllocationDonutChart;
