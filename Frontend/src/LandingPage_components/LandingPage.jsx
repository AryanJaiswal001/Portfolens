import Navbar from "./NavBar";
import HeroSection from "./HeroSection";
import {
  TrendingUp,
  PieChart,
  Shield,
  BarChart3,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

// Sample data for preview cards
const sampleAllocation = { equity: 65, debt: 25, gold: 10 };
const samplePerformance = [
  { month: "Aug", invested: 500000, value: 500000 },
  { month: "Nov", invested: 650000, value: 680000 },
  { month: "Feb", invested: 800000, value: 920000 },
  { month: "May", invested: 950000, value: 1100000 },
  { month: "Aug", invested: 1100000, value: 1350000 },
];

// Mini Donut Chart for Preview
const MiniDonutChart = ({ data, size = 80 }) => {
  const colors = { equity: "#3b82f6", debt: "#22c55e", gold: "#eab308" };
  const entries = Object.entries(data);
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulativePercent = 0;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="var(--border-subtle)"
        strokeWidth={strokeWidth}
      />
      {entries.map(([key, value]) => {
        const dashLength = (value / 100) * circumference;
        const dashOffset =
          circumference - (cumulativePercent / 100) * circumference;
        cumulativePercent += value;
        return (
          <circle
            key={key}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colors[key]}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

// Mini Line Chart for Preview
const MiniLineChart = ({ data, width = 140, height = 50 }) => {
  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const getY = (val) => height - ((val - min) / range) * (height - 10) - 5;
  const getX = (i) => (i / (data.length - 1)) * width;

  const path = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.value)}`)
    .join(" ");
  const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(34, 197, 94, 0.3)" />
          <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaGradient)" />
      <path
        d={path}
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {data.map((d, i) => (
        <circle key={i} cx={getX(i)} cy={getY(d.value)} r="3" fill="#22c55e" />
      ))}
    </svg>
  );
};

// Glassmorphism Preview Card Component
const PreviewCard = ({
  title,
  icon: Icon,
  children,
  className = "",
  delay = 0,
}) => (
  <div
    className={`rounded-2xl p-4 backdrop-blur-xl border transition-all duration-500 hover:scale-105 hover:shadow-2xl ${className}`}
    style={{
      background: "var(--bg-card)",
      borderColor: "var(--border-subtle)",
      boxShadow: "var(--shadow-card), 0 8px 32px rgba(147, 51, 234, 0.1)",
      animation: `floatIn 0.8s ease-out ${delay}s both`,
    }}
  >
    <div className="flex items-center gap-2 mb-3">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
        }}
      >
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span
        className="text-sm font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </span>
    </div>
    {children}
  </div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-app)" }}>
      <style>{`
        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.3); }
          50% { box-shadow: 0 0 80px rgba(147, 51, 234, 0.5); }
        }
      `}</style>

      <Navbar />
      <HeroSection />

      {/* Premium Feature Showcase Section */}
      <section
        id="features"
        className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ backgroundColor: "var(--bg-app)" }}
      >
        {/* Background gradient orbs */}
        <div
          className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--accent-purple)" }}
        />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: "var(--accent-blue)" }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Narrative */}
            <div className="space-y-8">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(37, 99, 235, 0.15))",
                    border: "1px solid rgba(147, 51, 234, 0.3)",
                    color: "var(--accent-purple)",
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Intelligent Portfolio Analysis
                </div>

                <h2
                  className="text-4xl md:text-5xl font-bold leading-tight mb-6"
                  style={{ color: "var(--text-primary)" }}
                >
                  See Your Investments{" "}
                  <span
                    style={{
                      background: "var(--gradient-text)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Through a New Lens
                  </span>
                </h2>

                <p
                  className="text-lg leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Most investors hold multiple mutual funds without
                  understanding how they interact. PortfoLens reveals the hidden
                  patterns—overlapping stocks, concentrated sectors, and
                  unbalanced allocations—that silently erode your returns.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="space-y-4">
                {[
                  {
                    text: "Uncover hidden stock overlaps across your funds",
                    color: "#ef4444",
                  },
                  {
                    text: "Visualize true sector concentration in real-time",
                    color: "#f59e0b",
                  },
                  {
                    text: "Optimize allocation for better risk-adjusted returns",
                    color: "#22c55e",
                  },
                  {
                    text: "Receive AI-driven insights tailored to your portfolio",
                    color: "#3b82f6",
                  },
                  {
                    text: "Make informed decisions with clarity and confidence",
                    color: "#8b5cf6",
                  }
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: benefit.color }}
                    />
                    <span style={{ color: "var(--text-secondary)" }}>
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>

              
            </div>

            {/* Right Column - Floating Visual Canvas */}
            <div className="relative h-[500px] lg:h-[600px]">
              {/* Main glow effect */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(147, 51, 234, 0.15) 0%, transparent 70%)",
                  animation: "pulse-glow 4s ease-in-out infinite",
                }}
              />

              {/* Insights Card - Top Left */}
              <div
                className="absolute top-0 left-0"
                style={{ animation: "float 6s ease-in-out infinite" }}
              >
                <PreviewCard
                  title="Portfolio Insights"
                  icon={TrendingUp}
                  delay={0.1}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Total Value
                      </span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        ₹14.85L
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Returns
                      </span>
                      <span className="text-sm font-bold text-green-500">
                        +18.82%
                      </span>
                    </div>
                    <div
                      className="h-1 rounded-full mt-2"
                      style={{ background: "var(--border-subtle)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "72%",
                          background:
                            "linear-gradient(90deg, #22c55e, #3b82f6)",
                        }}
                      />
                    </div>
                  </div>
                </PreviewCard>
              </div>

              {/* Allocation Card - Top Right */}
              <div
                className="absolute top-8 right-0"
                style={{ animation: "float 5s ease-in-out infinite 0.5s" }}
              >
                <PreviewCard title="Allocation" icon={PieChart} delay={0.3}>
                  <div className="flex items-center gap-3">
                    <MiniDonutChart data={sampleAllocation} size={70} />
                    <div className="space-y-1">
                      {Object.entries(sampleAllocation).map(([key, val]) => (
                        <div
                          key={key}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor:
                                key === "equity"
                                  ? "#3b82f6"
                                  : key === "debt"
                                  ? "#22c55e"
                                  : "#eab308",
                            }}
                          />
                          <span
                            className="capitalize"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {key}
                          </span>
                          <span
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {val}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </PreviewCard>
              </div>

              {/* Performance Card - Center */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64"
                style={{ animation: "float 7s ease-in-out infinite 1s" }}
              >
                <PreviewCard
                  title="Performance"
                  icon={BarChart3}
                  delay={0.5}
                  className="w-full"
                >
                  <MiniLineChart
                    data={samplePerformance}
                    width={220}
                    height={60}
                  />
                  <div className="flex justify-between mt-3 text-xs">
                    <span style={{ color: "var(--text-tertiary)" }}>
                      Aug '23
                    </span>
                    <span className="text-green-500 font-medium">↑ 170%</span>
                    <span style={{ color: "var(--text-tertiary)" }}>
                      Aug '24
                    </span>
                  </div>
                </PreviewCard>
              </div>

              {/* Risk Card - Bottom Left */}
              <div
                className="absolute bottom-12 left-4"
                style={{ animation: "float 5.5s ease-in-out infinite 0.8s" }}
              >
                <PreviewCard title="Risk Analysis" icon={Shield} delay={0.7}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Risk Level
                      </span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(245, 158, 11, 0.2)",
                          color: "#f59e0b",
                        }}
                      >
                        Moderate
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="h-2 flex-1 rounded-full"
                          style={{
                            background:
                              i <= 3 ? "#f59e0b" : "var(--border-subtle)",
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Well balanced for growth
                    </p>
                  </div>
                </PreviewCard>
              </div>

              {/* Overlap Warning - Bottom Right */}
              <div
                className="absolute bottom-0 right-8"
                style={{ animation: "float 6.5s ease-in-out infinite 1.2s" }}
              >
                <PreviewCard title="Overlap Alert" icon={Shield} delay={0.9}>
                  <div
                    className="text-xs px-3 py-2 rounded-lg"
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-red-500 font-medium">
                        HDFC Bank
                      </span>
                    </div>
                    <p
                      className="mt-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Present in 5 of 8 funds
                    </p>
                  </div>
                </PreviewCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12 px-4 sm:px-6 lg:px-8 border-t"
        style={{
          backgroundColor: "var(--bg-app)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <p style={{ color: "var(--text-secondary)" }}>
            © 2025 PortfoLens. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
