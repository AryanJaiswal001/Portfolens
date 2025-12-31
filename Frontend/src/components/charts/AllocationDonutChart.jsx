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
    // Fixed color palette for asset classes (matches fintech standards)
    // Keys are lowercase for consistent matching
    const colorConfigs = {
      equity: {
        primary: "#6366F1", // Indigo/Purple-Blue
        gradient: "#818CF8",
        glow: "rgba(99, 102, 241, 0.3)",
      },
      debt: {
        primary: "#10B981", // Teal/Green
        gradient: "#34D399",
        glow: "rgba(16, 185, 129, 0.3)",
      },
      hybrid: {
        primary: "#F59E0B", // Amber
        gradient: "#FBBF24",
        glow: "rgba(245, 158, 11, 0.3)",
      },
      gold: {
        primary: "#FACC15", // Gold/Yellow
        gradient: "#FDE047",
        glow: "rgba(250, 204, 21, 0.3)",
      },
      cash: {
        primary: "#9CA3AF", // Gray
        gradient: "#D1D5DB",
        glow: "rgba(156, 163, 175, 0.3)",
      },
      other: {
        primary: "#9CA3AF", // Gray
        gradient: "#D1D5DB",
        glow: "rgba(156, 163, 175, 0.3)",
      },
    };

    const entries = Object.entries(data).filter(([_, value]) => value > 0);

    if (entries.length === 0) return null;

    let cumulativePercent = 0;
    const segments = entries.map(([key, value]) => {
      const startPercent = cumulativePercent;
      cumulativePercent += value;
      // Normalize key to lowercase for color lookup (backend sends "Equity", "Debt", etc.)
      const normalizedKey = key.toLowerCase();
      const colors = colorConfigs[normalizedKey] || colorConfigs.other;
      return {
        key,
        normalizedKey,
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
          {/* Define gradients - both linear and radial for single asset */}
          <defs>
            {chartData.map((segment) => (
              <React.Fragment key={`gradients-${segment.key}`}>
                {/* Linear gradient for multi-asset */}
                <linearGradient
                  id={`gradient-${segment.key}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={segment.gradient} />
                  <stop offset="100%" stopColor={segment.primary} />
                </linearGradient>
                {/* Radial gradient for single asset - adds depth */}
                <radialGradient
                  id={`radial-${segment.key}`}
                  cx="30%"
                  cy="30%"
                  r="70%"
                >
                  <stop offset="0%" stopColor={segment.gradient} />
                  <stop offset="50%" stopColor={segment.primary} />
                  <stop
                    offset="100%"
                    stopColor={segment.primary}
                    stopOpacity="0.8"
                  />
                </radialGradient>
              </React.Fragment>
            ))}
            {/* Glow filter for hover */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Drop shadow filter */}
            <filter
              id="dropShadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
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
            opacity={0.2}
          />

          {/* Colored segments with gradients */}
          {chartData.map((segment, index) => {
            const dashLength = (segment.value / 100) * circumference;
            const dashOffset =
              circumference - (segment.startPercent / 100) * circumference;
            const isSingleAsset = chartData.length === 1;
            const isHovered = hoveredSegment === segment.key;
            // Use radial gradient for single asset to avoid flat look
            const strokeGradient = isSingleAsset
              ? `url(#radial-${segment.key})`
              : `url(#gradient-${segment.key})`;

            return (
              <circle
                key={segment.key}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={strokeGradient}
                strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={
                  isAnimated
                    ? `${dashLength} ${circumference - dashLength}`
                    : `0 ${circumference}`
                }
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                filter={isHovered ? "url(#glow)" : "url(#dropShadow)"}
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

        {/* Hover Tooltip - Dark mode optimized */}
        {hoveredSegment && (
          <div
            className="absolute z-50 px-4 py-3 rounded-xl shadow-2xl pointer-events-none"
            style={{
              backgroundColor: "rgba(17, 24, 39, 0.95)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -140%)",
              minWidth: "140px",
            }}
          >
            {chartData
              .filter((s) => s.key === hoveredSegment)
              .map((segment) => (
                <div key={segment.key} className="text-center">
                  {/* Tooltip header with color indicator */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: segment.primary,
                        boxShadow: `0 0 8px ${segment.primary}`,
                      }}
                    />
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#F9FAFB" }}
                    >
                      {segment.label}
                    </span>
                  </div>
                  {/* Percentage - large and prominent */}
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{ color: segment.primary }}
                  >
                    {segment.value}%
                  </div>
                  {/* Amount invested */}
                  {segment.amount !== null && (
                    <div
                      className="text-xs font-medium"
                      style={{ color: "#9CA3AF" }}
                    >
                      {formatCurrency(segment.amount)} invested
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Enhanced Legend with ₹ Amounts */}
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
                className="flex flex-col p-3 rounded-lg cursor-pointer transition-all duration-200"
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{
                        background: `linear-gradient(135deg, ${segment.gradient}, ${segment.primary})`,
                        boxShadow: isHovered
                          ? `0 0 8px ${segment.glow}`
                          : "none",
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
                      color: isHovered
                        ? segment.primary
                        : "var(--text-primary)",
                    }}
                  >
                    {segment.value}%
                  </span>
                </div>
                {/* Amount row - only show if we have totalInvested */}
                {segment.amount !== null && (
                  <div
                    className="mt-1.5 text-xs font-semibold pl-5"
                    style={{
                      color: isHovered
                        ? segment.primary
                        : "var(--text-secondary)",
                    }}
                  >
                    {formatCurrency(segment.amount)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllocationDonutChart;
