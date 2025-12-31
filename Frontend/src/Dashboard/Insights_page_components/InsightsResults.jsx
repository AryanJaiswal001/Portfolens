import { useSearchParams } from "react-router-dom";
import { useAnalysis } from "../../context/AnalysisContext";
import { usePortfolio } from "../../context/PortfolioContext";
import DemoDisclaimer, { DemoBadge } from "../../components/DemoDisclaimer";
import { AllocationDonutChart } from "../../components/charts";
import {
  Sparkles,
  RefreshCw,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

/**
 * Format currency for display
 */
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Get sentiment color
 */
const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case "positive":
      return "#22c55e";
    case "negative":
      return "#ef4444";
    case "warning":
      return "#f59e0b";
    default:
      return "var(--text-secondary)";
  }
};

/**
 * Get sentiment icon
 */
const getSentimentIcon = (sentiment) => {
  switch (sentiment) {
    case "positive":
      return <CheckCircle className="w-4 h-4" />;
    case "negative":
      return <TrendingDown className="w-4 h-4" />;
    case "warning":
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Info className="w-4 h-4" />;
  }
};

export default function InsightsResults() {
  const [searchParams] = useSearchParams();
  const portfolioIdFromUrl = searchParams.get("portfolio");

  const {
    loading,
    error,
    hasAnalysis,
    isDemoMode,
    dataAsOf,
    navPeriod,
    disclaimer,
    portfolioSummary,
    diversification,
    performance,
    insights,
    generateAnalysis,
    generateSampleAnalysis,
  } = useAnalysis();

  const { activePortfolio, hasPortfolio } = usePortfolio();

  // Handle generate analysis
  // Priority: URL param > activePortfolio > sample analysis
  const handleGenerateAnalysis = async () => {
    if (portfolioIdFromUrl) {
      await generateAnalysis(portfolioIdFromUrl);
    } else if (activePortfolio?._id) {
      await generateAnalysis(activePortfolio._id);
    } else {
      // Use sample analysis for demo
      await generateSampleAnalysis();
    }
  };

  const hasSelectedPortfolio = portfolioIdFromUrl || activePortfolio?._id;

  // ═══════════════════════════════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div
          className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-6"
          style={{
            borderColor: "var(--accent-purple)",
            borderTopColor: "transparent",
          }}
        />
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Generating Insights...
        </h3>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Analyzing your portfolio performance and diversification
        </p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // NO ANALYSIS STATE - SHOW GENERATE BUTTON
  // ═══════════════════════════════════════════════════════════════
  if (!hasAnalysis) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Insights
          </h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Generate comprehensive analysis of your portfolio
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="p-4 rounded-xl mb-6"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Generate CTA */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
            }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Ready to Analyze Your Portfolio?
          </h2>
          <p
            className="text-base mb-6 max-w-md mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Get detailed insights on performance, diversification, risk
            assessment, and personalized recommendations.
          </p>

          <button
            onClick={handleGenerateAnalysis}
            disabled={loading}
            className="px-8 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2 mx-auto"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
            }}
          >
            <Sparkles className="w-5 h-5" />
            Generate Insights & Reports
          </button>

          <p className="text-xs mt-4" style={{ color: "var(--text-tertiary)" }}>
            {hasSelectedPortfolio
              ? "Analysis will be based on your saved portfolio"
              : "Using sample portfolio data for demo"}
          </p>
        </div>

        {/* What You'll Get */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "📊",
              title: "Performance Analysis",
              desc: "Returns, XIRR, and fund-wise breakdown",
            },
            {
              icon: "🎯",
              title: "Diversification Check",
              desc: "Asset allocation and sector exposure",
            },
            {
              icon: "💡",
              title: "Smart Recommendations",
              desc: "Actionable insights for optimization",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-5 rounded-xl"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3
                className="font-semibold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // HAS ANALYSIS - RENDER INSIGHTS
  // ═══════════════════════════════════════════════════════════════
  const summary = insights?.summary || {};
  const performanceInsights = insights?.performance || [];
  const diversificationInsights = insights?.diversification || [];
  const risks = insights?.risks || [];
  const recommendations = insights?.recommendations || [];
  const highlights = insights?.highlights || [];

  const performanceSummary = performance?.summary || {};
  const fundPerformance = performance?.funds || [];
  const assetAllocation = diversification?.assetAllocation || {};
  const categoryDistribution = diversification?.categoryDistribution || {};

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Insights
              </h1>
              {isDemoMode && <DemoBadge />}
            </div>
            <p className="text-base" style={{ color: "var(--text-secondary)" }}>
              {portfolioSummary?.name || "Portfolio Analysis"}
            </p>
          </div>
          <button
            onClick={handleGenerateAnalysis}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Demo Disclaimer - MANDATORY */}
      {isDemoMode && (
        <DemoDisclaimer
          disclaimer={disclaimer}
          dataAsOf={dataAsOf}
          navPeriod={navPeriod}
        />
      )}

      {/* Summary Card */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background:
            summary.healthScore === "good"
              ? "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))"
              : summary.healthScore === "moderate"
              ? "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))"
              : "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor:
                    summary.healthScore === "good"
                      ? "rgba(34, 197, 94, 0.2)"
                      : summary.healthScore === "moderate"
                      ? "rgba(245, 158, 11, 0.2)"
                      : "rgba(239, 68, 68, 0.2)",
                  color:
                    summary.healthScore === "good"
                      ? "#22c55e"
                      : summary.healthScore === "moderate"
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              >
                {summary.healthLabel || "Analyzing"}
              </span>
            </div>
            <p className="text-lg" style={{ color: "var(--text-primary)" }}>
              {summary.message}
            </p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {summary.totalInvested}
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                Invested
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {summary.currentValue}
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                Current
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{
                  color:
                    performanceSummary.absoluteReturn >= 0
                      ? "#22c55e"
                      : "#ef4444",
                }}
              >
                {summary.returns}
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                Returns
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Invested */}
        <MetricCard
          label="Total Invested"
          value={formatCurrency(performanceSummary.totalInvested)}
          subtext="Principal amount"
          icon="💰"
          color="blue"
        />
        {/* Current Value */}
        <MetricCard
          label="Current Value"
          value={formatCurrency(performanceSummary.currentValue)}
          subtext={`${
            performanceSummary.absoluteReturnPercent >= 0 ? "+" : ""
          }${performanceSummary.absoluteReturnPercent}% overall`}
          icon="📈"
          color="green"
          subtextColor={
            performanceSummary.absoluteReturnPercent >= 0
              ? "#22c55e"
              : "#ef4444"
          }
        />
        {/* XIRR */}
        <MetricCard
          label="XIRR"
          value={`${performanceSummary.xirr || 0}%`}
          subtext="Annualized return"
          icon="🎯"
          color="purple"
        />
        {/* Fund Count */}
        <MetricCard
          label="Portfolio Size"
          value={`${summary.fundCount || 0} Funds`}
          subtext={`${performanceSummary.sipCount || 0} SIPs active`}
          icon="📊"
          color="amber"
        />
      </div>

      {/* Performance Insights */}
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Performance Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {performanceInsights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </div>
      </div>

      {/* Allocation & Diversification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
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
            Distribution across asset classes
          </p>
          <AllocationDonutChart
            data={assetAllocation}
            size={200}
            strokeWidth={35}
            showLegend={true}
          />
        </div>

        {/* Category Distribution */}
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <h2
            className="text-xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Category Distribution
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Fund categories in your portfolio
          </p>
          <div className="space-y-3">
            {Object.entries(categoryDistribution).map(
              ([category, percentage]) => (
                <div key={category} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {category}
                      </span>
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {percentage}%
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--border-subtle)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          background:
                            "linear-gradient(to right, var(--accent-purple), var(--accent-blue))",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Diversification Insights */}
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Diversification Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diversificationInsights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </div>
      </div>

      {/* Risk Alerts */}
      {risks.length > 0 && (
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <h2
            className="text-xl font-bold mb-4 flex items-center gap-2"
            style={{ color: "#ef4444" }}
          >
            <AlertTriangle className="w-5 h-5" />
            Risk Alerts
          </h2>
          <div className="space-y-3">
            {risks.map((risk, index) => (
              <div
                key={index}
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {risk.title}
                    </h4>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {risk.description}
                    </p>
                    {risk.recommendation && (
                      <p
                        className="text-sm mt-2 font-medium"
                        style={{ color: "var(--accent-purple)" }}
                      >
                        💡 {risk.recommendation}
                      </p>
                    )}
                  </div>
                  <span
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor:
                        risk.severity === "high"
                          ? "rgba(239, 68, 68, 0.2)"
                          : "rgba(245, 158, 11, 0.2)",
                      color: risk.severity === "high" ? "#ef4444" : "#f59e0b",
                    }}
                  >
                    {risk.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fund Performance */}
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <h2
          className="text-xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Fund Performance
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          Individual fund returns
        </p>
        <div className="space-y-4">
          {fundPerformance.slice(0, 6).map((fund, index) => (
            <div
              key={index}
              className="rounded-lg p-5"
              style={{
                backgroundColor: "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {fund.fundName}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Invested: {formatCurrency(fund.totalInvested)}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className="text-xl font-bold"
                    style={{
                      color:
                        fund.absoluteReturnPercent >= 0 ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {fund.absoluteReturnPercent >= 0 ? "+" : ""}
                    {fund.absoluteReturnPercent}%
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    XIRR: {fund.xirr}%
                  </div>
                </div>
              </div>
              <div
                className="h-2.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--border-subtle)" }}
              >
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      Math.max(fund.absoluteReturnPercent * 5, 5),
                      100
                    )}%`,
                    background:
                      fund.absoluteReturnPercent >= 10
                        ? "linear-gradient(to right, #22c55e, #16a34a)"
                        : fund.absoluteReturnPercent >= 0
                        ? "linear-gradient(to right, #3b82f6, #2563eb)"
                        : "linear-gradient(to right, #ef4444, #dc2626)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div
          className="rounded-xl p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(37, 99, 235, 0.1))",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            💡 Recommendations
          </h2>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="px-2 py-1 rounded text-xs font-semibold flex-shrink-0"
                    style={{
                      backgroundColor:
                        rec.priority === "high"
                          ? "rgba(239, 68, 68, 0.2)"
                          : rec.priority === "medium"
                          ? "rgba(245, 158, 11, 0.2)"
                          : "rgba(34, 197, 94, 0.2)",
                      color:
                        rec.priority === "high"
                          ? "#ef4444"
                          : rec.priority === "medium"
                          ? "#f59e0b"
                          : "#22c55e",
                    }}
                  >
                    {rec.priority}
                  </span>
                  <div>
                    <h4
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {rec.title}
                    </h4>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {rec.description}
                    </p>
                    {rec.action && (
                      <p
                        className="text-sm mt-2 font-medium"
                        style={{ color: "var(--accent-purple)" }}
                      >
                        → {rec.action}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Highlights */}
      {highlights.length > 0 && (
        <div
          className="rounded-xl p-6"
          style={{
            background: "var(--bg-button-primary)",
          }}
        >
          <h3 className="text-lg font-bold text-white mb-4">
            📌 Key Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <span className="text-xl">{highlight.icon}</span>
                <span className="text-sm text-white">{highlight.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function MetricCard({ label, value, subtext, icon, color, subtextColor }) {
  const colorMap = {
    blue: "rgba(37, 99, 235, 0.15)",
    green: "rgba(34, 197, 94, 0.15)",
    purple: "rgba(147, 51, 234, 0.15)",
    amber: "rgba(245, 158, 11, 0.15)",
  };

  return (
    <div
      className="rounded-xl p-6 transition-shadow hover:shadow-lg"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="text-sm font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
          style={{ backgroundColor: colorMap[color] || colorMap.blue }}
        >
          {icon}
        </div>
      </div>
      <div
        className="text-3xl font-bold mb-1"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </div>
      <div
        className="text-sm"
        style={{ color: subtextColor || "var(--text-tertiary)" }}
      >
        {subtext}
      </div>
    </div>
  );
}

function InsightCard({ insight }) {
  return (
    <div
      className="p-4 rounded-lg"
      style={{
        backgroundColor: "var(--bg-input)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: `${getSentimentColor(insight.sentiment)}20`,
          }}
        >
          <span style={{ color: getSentimentColor(insight.sentiment) }}>
            {getSentimentIcon(insight.sentiment)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4
              className="font-semibold text-sm"
              style={{ color: "var(--text-primary)" }}
            >
              {insight.title}
            </h4>
            {insight.value && (
              <span
                className="font-bold text-sm"
                style={{ color: getSentimentColor(insight.sentiment) }}
              >
                {insight.value}
              </span>
            )}
          </div>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {insight.description}
          </p>
          {insight.subValue && (
            <p
              className="text-xs mt-1 font-medium"
              style={{ color: "var(--text-tertiary)" }}
            >
              {insight.subValue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
