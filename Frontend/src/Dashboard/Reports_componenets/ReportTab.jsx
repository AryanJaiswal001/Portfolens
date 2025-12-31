import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivateLayout from "../PrivateLayout";
import { useAnalysis } from "../../context/AnalysisContext";
import { usePortfolio } from "../../context/PortfolioContext";
import DemoDisclaimer, { DemoBadge } from "../../components/DemoDisclaimer";
import ReportEmptyState from "./ReportEmptyState";
import {
  PieChart,
  ShieldAlert,
  Layers,
  Sparkles,
  RefreshCw,
  Download,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  AllocationDonutChart,
  SectorConcentrationChart,
  InvestmentGrowthChart,
} from "../../components/charts";

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

const ReportTab = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");

  // Get analysis data from context
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
    reports,
    generateAnalysis,
    generateSampleAnalysis,
  } = useAnalysis();

  const { activePortfolio, hasPortfolio } = usePortfolio();

  const tabs = [
    { id: "summary", label: "Summary", icon: "📋" },
    { id: "performance", label: "Performance", icon: "📈" },
    { id: "allocation", label: "Allocation", icon: "🎯" },
    { id: "risk", label: "Risk", icon: "⚠️" },
  ];

  // Handle generate analysis
  const handleGenerateAnalysis = async () => {
    if (activePortfolio?._id) {
      await generateAnalysis(activePortfolio._id);
    } else {
      await generateSampleAnalysis();
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <PrivateLayout pageTitle="Reports">
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
            Generating Reports...
          </h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Building comprehensive portfolio analysis
          </p>
        </div>
      </PrivateLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // NO ANALYSIS STATE - SHOW GENERATE BUTTON
  // ═══════════════════════════════════════════════════════════════
  if (!hasAnalysis) {
    return (
      <PrivateLayout pageTitle="Reports">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Reports
            </h1>
            <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
              Generate detailed analysis reports for your portfolio
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="p-4 rounded-xl"
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
              <BarChart3 className="w-10 h-10 text-white" />
            </div>

            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Generate Portfolio Reports
            </h2>
            <p
              className="text-base mb-6 max-w-md mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              Get comprehensive reports including performance analysis,
              allocation breakdown, risk assessment, and actionable
              recommendations.
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

            <p
              className="text-xs mt-4"
              style={{ color: "var(--text-tertiary)" }}
            >
              {hasPortfolio
                ? "Analysis will be based on your saved portfolio"
                : "Using sample portfolio data for demo"}
            </p>
          </div>

          {/* Report Types Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className="p-5 rounded-xl opacity-60"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div className="text-2xl mb-3">{tab.icon}</div>
                <h3
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {tab.label} Report
                </h3>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Available after analysis
                </p>
              </div>
            ))}
          </div>
        </div>
      </PrivateLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // HAS ANALYSIS - RENDER REPORTS
  // ═══════════════════════════════════════════════════════════════
  const reportData = reports || {};
  const performanceSummary = performance?.summary || {};
  const fundPerformance =
    performance?.fundPerformance || performance?.funds || [];
  const cashflows = performance?.cashflows || [];
  const assetAllocation = diversification?.assetAllocation || {};
  const categoryDistribution = diversification?.categoryDistribution || {};
  const marketCapExposure = diversification?.marketCapExposure || {};
  const sectorExposure = diversification?.sectorExposure || {};
  const concentrationRisks = diversification?.concentrationRisks || [];

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return (
          <SummaryTab
            reportData={reportData}
            performanceSummary={performanceSummary}
            portfolioSummary={portfolioSummary}
            insights={insights}
          />
        );
      case "performance":
        return (
          <PerformanceTab
            performanceSummary={performanceSummary}
            fundPerformance={fundPerformance}
            reportData={reportData}
            cashflows={cashflows}
          />
        );
      case "allocation":
        return (
          <AllocationTab
            assetAllocation={assetAllocation}
            categoryDistribution={categoryDistribution}
            marketCapExposure={marketCapExposure}
            sectorExposure={sectorExposure}
            fundPerformance={fundPerformance}
            totalInvested={performanceSummary.totalInvested}
          />
        );
      case "risk":
        return (
          <RiskTab
            concentrationRisks={concentrationRisks}
            insights={insights}
            reportData={reportData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PrivateLayout pageTitle="Reports">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1
                className="text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Reports
              </h1>
              {isDemoMode && <DemoBadge />}
            </div>
            <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
              {portfolioSummary?.name || "Portfolio Analysis Report"}
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

        {/* Demo Disclaimer - MANDATORY */}
        {isDemoMode && (
          <DemoDisclaimer
            disclaimer={disclaimer}
            dataAsOf={dataAsOf}
            navPeriod={navPeriod}
          />
        )}

        {/* Tab Navigation */}
        <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <nav className="flex overflow-x-auto scrollbar-hide -mb-px space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="whitespace-nowrap py-4 px-1 font-medium text-sm flex items-center gap-2"
                style={{
                  borderBottom:
                    activeTab === tab.id
                      ? "2px solid var(--accent-purple)"
                      : "2px solid transparent",
                  color:
                    activeTab === tab.id
                      ? "var(--accent-purple)"
                      : "var(--text-secondary)",
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    </PrivateLayout>
  );
};

// ═══════════════════════════════════════════════════════════════
// INVESTMENT BREAKDOWN COMPONENT
// ═══════════════════════════════════════════════════════════════
const InvestmentBreakdown = ({ funds }) => {
  // Calculate totals
  const totals = funds.reduce(
    (acc, fund) => ({
      sipCount: acc.sipCount + (fund.sipCount || 0),
      lumpsumCount: acc.lumpsumCount + (fund.lumpsumCount || 0),
    }),
    { sipCount: 0, lumpsumCount: 0 }
  );

  const hasOnlySIP = totals.sipCount > 0 && totals.lumpsumCount === 0;
  const hasOnlyLumpsum = totals.lumpsumCount > 0 && totals.sipCount === 0;
  const hasBoth = totals.sipCount > 0 && totals.lumpsumCount > 0;

  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        💳 Investment Breakdown
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SIP Investments */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor:
              totals.sipCount > 0
                ? "rgba(34, 197, 94, 0.1)"
                : "var(--bg-input)",
            border:
              totals.sipCount > 0
                ? "1px solid rgba(34, 197, 94, 0.3)"
                : "1px solid var(--border-subtle)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📅</span>
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              SIP Investments
            </span>
          </div>
          <p
            className="text-2xl font-bold"
            style={{
              color: totals.sipCount > 0 ? "#22c55e" : "var(--text-tertiary)",
            }}
          >
            {totals.sipCount}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
            {totals.sipCount === 1 ? "Active SIP" : "Active SIPs"}
          </p>
        </div>

        {/* Lumpsum Investments */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor:
              totals.lumpsumCount > 0
                ? "rgba(59, 130, 246, 0.1)"
                : "var(--bg-input)",
            border:
              totals.lumpsumCount > 0
                ? "1px solid rgba(59, 130, 246, 0.3)"
                : "1px solid var(--border-subtle)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💵</span>
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Lumpsum Investments
            </span>
          </div>
          <p
            className="text-2xl font-bold"
            style={{
              color:
                totals.lumpsumCount > 0 ? "#3b82f6" : "var(--text-tertiary)",
            }}
          >
            {totals.lumpsumCount}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
            {totals.lumpsumCount === 1
              ? "One-time Investment"
              : "One-time Investments"}
          </p>
        </div>

        {/* Investment Type Badge */}
        <div
          className="p-4 rounded-lg flex flex-col justify-center items-center"
          style={{
            backgroundColor: "var(--bg-input)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <span
            className="px-3 py-1.5 rounded-full text-sm font-semibold mb-2"
            style={{
              backgroundColor: hasBoth
                ? "rgba(139, 92, 246, 0.15)"
                : hasOnlySIP
                ? "rgba(34, 197, 94, 0.15)"
                : "rgba(59, 130, 246, 0.15)",
              color: hasBoth ? "#8b5cf6" : hasOnlySIP ? "#22c55e" : "#3b82f6",
            }}
          >
            {hasBoth
              ? "Mixed Strategy"
              : hasOnlySIP
              ? "SIP-only"
              : "Lumpsum-only"}
          </span>
          <p
            className="text-xs text-center"
            style={{ color: "var(--text-tertiary)" }}
          >
            {hasBoth
              ? "Combining regular & one-time investments"
              : hasOnlySIP
              ? "Building wealth through regular investments"
              : "One-time capital deployment"}
          </p>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SUMMARY TAB
// ═══════════════════════════════════════════════════════════════
const SummaryTab = ({
  reportData,
  performanceSummary,
  portfolioSummary,
  insights,
}) => {
  const executiveSummary = reportData.executiveSummary || {};
  const keyInsights = reportData.keyInsights || insights?.highlights || [];
  const recommendations =
    reportData.recommendations || insights?.recommendations || [];

  return (
    <div className="space-y-6">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Invested"
          value={formatCurrency(
            executiveSummary.totalInvested || performanceSummary.totalInvested
          )}
          icon="💰"
        />
        <SummaryCard
          label="Current Value"
          value={formatCurrency(
            executiveSummary.currentValue || performanceSummary.currentValue
          )}
          icon="📈"
        />
        <SummaryCard
          label="Absolute Return"
          value={formatCurrency(
            executiveSummary.absoluteReturn || performanceSummary.absoluteReturn
          )}
          icon="💹"
          valueColor={
            (executiveSummary.absoluteReturn ||
              performanceSummary.absoluteReturn) >= 0
              ? "#22c55e"
              : "#ef4444"
          }
        />
        <SummaryCard
          label="XIRR"
          value={`${executiveSummary.xirr || performanceSummary.xirr || 0}%`}
          icon="🎯"
          valueColor="#8b5cf6"
        />
      </div>

      {/* Investment Breakdown - SIP vs Lumpsum */}
      {portfolioSummary?.funds && portfolioSummary.funds.length > 0 && (
        <InvestmentBreakdown funds={portfolioSummary.funds} />
      )}

      {/* Key Insights */}
      {keyInsights.length > 0 && (
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            📌 Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {keyInsights.map((insight, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg"
                style={{
                  backgroundColor: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <span className="text-xl">{insight.icon}</span>
                <span
                  className="text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {insight.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Overview */}
      <div
        className="rounded-xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(147,51,234,0.1) 0%, rgba(37,85,235,0.1) 100%)",
          border: "1px solid var(--accent-purple)",
        }}
      >
        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          📋 Report Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span style={{ color: "var(--text-tertiary)" }}>Funds</span>
            <p
              className="font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {portfolioSummary?.fundCount || executiveSummary.fundCount || 0}
            </p>
          </div>
          <div>
            <span style={{ color: "var(--text-tertiary)" }}>Health Score</span>
            <p
              className="font-semibold capitalize"
              style={{ color: "var(--text-primary)" }}
            >
              {executiveSummary.healthScore || "—"}
            </p>
          </div>
          <div>
            <span style={{ color: "var(--text-tertiary)" }}>Return %</span>
            <p
              className="font-semibold"
              style={{
                color:
                  (executiveSummary.absoluteReturnPercent ||
                    performanceSummary.absoluteReturnPercent) >= 0
                    ? "#22c55e"
                    : "#ef4444",
              }}
            >
              {executiveSummary.absoluteReturnPercent ||
                performanceSummary.absoluteReturnPercent ||
                0}
              %
            </p>
          </div>
          <div>
            <span style={{ color: "var(--text-tertiary)" }}>
              Report Generated
            </span>
            <p
              className="font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {reportData.generatedAt
                ? new Date(reportData.generatedAt).toLocaleDateString("en-IN")
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            💡 Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec, index) => (
              <div
                key={index}
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor:
                        rec.priority === "high"
                          ? "rgba(239, 68, 68, 0.2)"
                          : "rgba(245, 158, 11, 0.2)",
                      color: rec.priority === "high" ? "#ef4444" : "#f59e0b",
                    }}
                  >
                    {rec.priority}
                  </span>
                  <div>
                    <h4
                      className="font-semibold text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {rec.title}
                    </h4>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {rec.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PERFORMANCE TAB
// ═══════════════════════════════════════════════════════════════
const PerformanceTab = ({
  performanceSummary,
  fundPerformance,
  reportData,
  cashflows = [],
}) => {
  const performanceReport = reportData.performanceReport || {};

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Absolute Return
          </p>
          <p
            className="mt-2 text-3xl font-bold"
            style={{
              color:
                performanceSummary.absoluteReturn >= 0 ? "#22c55e" : "#ef4444",
            }}
          >
            {formatCurrency(performanceSummary.absoluteReturn)}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
            {performanceSummary.absoluteReturnPercent}% return on investment
          </p>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            XIRR (Annualized)
          </p>
          <p className="mt-2 text-3xl font-bold" style={{ color: "#8b5cf6" }}>
            {performanceSummary.xirr || 0}%
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
            Time-weighted annual return
          </p>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            CAGR
          </p>
          <p className="mt-2 text-3xl font-bold" style={{ color: "#3b82f6" }}>
            {performanceSummary.cagr || 0}%
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
            Compound annual growth rate
          </p>
        </div>
      </div>

      {/* Investment Growth Chart */}
      <InvestmentGrowthChart
        cashflows={cashflows}
        fundPerformance={fundPerformance}
        totalInvested={performanceSummary.totalInvested || 0}
        currentValue={performanceSummary.currentValue || 0}
        height={320}
      />

      {/* Fund-wise Performance */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div
          className="px-6 py-4"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Fund-wise Performance
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
            Individual fund returns breakdown
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "var(--bg-input)" }}>
              <tr>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Fund Name
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Invested
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Current Value
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Returns
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  XIRR
                </th>
              </tr>
            </thead>
            <tbody>
              {fundPerformance.map((fund, index) => {
                const returnColor =
                  fund.absoluteReturnPercent >= 0 ? "#22c55e" : "#ef4444";
                const returnBgColor =
                  fund.absoluteReturnPercent >= 0
                    ? "rgba(34, 197, 94, 0.1)"
                    : "rgba(239, 68, 68, 0.1)";

                return (
                  <tr
                    key={index}
                    className="transition-colors duration-150 hover:bg-opacity-50"
                    style={{
                      borderBottom:
                        index !== fundPerformance.length - 1
                          ? "1px solid var(--border-subtle)"
                          : "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--bg-input)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {/* Fund Name - Bold with fallback */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span
                          className="text-sm font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {fund.fundName || fund.fundCode || "Unknown Fund"}
                        </span>
                        {fund.fundCode && fund.fundName && (
                          <span
                            className="text-xs mt-0.5"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            {fund.fundCode}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Invested - Muted */}
                    <td className="px-6 py-4 text-right">
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {formatCurrency(fund.totalInvested)}
                      </span>
                    </td>

                    {/* Current Value - Primary */}
                    <td className="px-6 py-4 text-right">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {formatCurrency(fund.currentValue)}
                      </span>
                    </td>

                    {/* Returns - Colored with background pill */}
                    <td className="px-6 py-4 text-right">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold"
                        style={{
                          backgroundColor: returnBgColor,
                          color: returnColor,
                        }}
                      >
                        {fund.absoluteReturnPercent >= 0 ? "↑" : "↓"}{" "}
                        {Math.abs(fund.absoluteReturnPercent)}%
                      </span>
                    </td>

                    {/* XIRR - Badge style */}
                    <td className="px-6 py-4 text-right">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold"
                        style={{
                          backgroundColor: "rgba(139, 92, 246, 0.15)",
                          color: "#8b5cf6",
                        }}
                      >
                        {fund.xirr}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Summary */}
        {fundPerformance.length > 0 && (
          <div
            className="px-6 py-3 flex justify-between items-center text-xs"
            style={{
              backgroundColor: "var(--bg-input)",
              color: "var(--text-tertiary)",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <span>
              {fundPerformance.length} fund
              {fundPerformance.length > 1 ? "s" : ""} in portfolio
            </span>
            <span>Hover over rows for details</span>
          </div>
        )}
      </div>

      {/* Performance Period */}
      {performanceReport.period && (
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: "var(--bg-input)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            📅 Performance Period:{" "}
            <strong>{performanceReport.period.start}</strong> to{" "}
            <strong>{performanceReport.period.end}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ALLOCATION TAB
// ═══════════════════════════════════════════════════════════════
const AllocationTab = ({
  assetAllocation,
  categoryDistribution,
  marketCapExposure,
  sectorExposure,
  fundPerformance,
  totalInvested,
}) => {
  return (
    <div className="space-y-6">
      {/* Asset Allocation Chart */}
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Asset Allocation
        </h3>
        <div className="flex justify-center py-4">
          <AllocationDonutChart
            data={assetAllocation}
            size={220}
            strokeWidth={38}
            showLegend={true}
            totalInvested={totalInvested}
          />
        </div>
      </div>

      {/* Category & Market Cap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Category Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(categoryDistribution).map(
              ([category, percentage]) => (
                <div key={category}>
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
              )
            )}
          </div>
        </div>

        {/* Market Cap Exposure */}
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Market Cap Exposure
          </h3>
          <div className="space-y-3">
            {Object.entries(marketCapExposure).map(([cap, percentage]) => (
              <div key={cap}>
                <div className="flex justify-between mb-1">
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {cap}
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
                      background: cap.includes("Large")
                        ? "#3b82f6"
                        : cap.includes("Mid")
                        ? "#8b5cf6"
                        : "#f59e0b",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sector Exposure */}
      {Object.keys(sectorExposure).length > 0 && (
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Sector Exposure
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(sectorExposure)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([sector, percentage]) => (
                <div
                  key={sector}
                  className="p-3 rounded-lg text-center"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {percentage}%
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {sector}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// RISK TAB
// ═══════════════════════════════════════════════════════════════
const RiskTab = ({ concentrationRisks, insights, reportData }) => {
  const risks = insights?.risks || [];
  const warnings = reportData?.warnings || [];

  return (
    <div className="space-y-6">
      {/* Concentration Risks */}
      {concentrationRisks.length > 0 && (
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: "#ef4444" }}
          >
            <ShieldAlert className="w-5 h-5" />
            Concentration Risks
          </h3>
          <div className="space-y-3">
            {concentrationRisks.map((risk, index) => (
              <div
                key={index}
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {risk.asset || risk.type} Concentration
                    </h4>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {risk.percentage}% of portfolio is concentrated in{" "}
                      {risk.asset || risk.type}
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
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

      {/* Risk Alerts from Insights */}
      {risks.length > 0 && (
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            ⚠️ Risk Alerts
          </h3>
          <div className="space-y-3">
            {risks.map((risk, index) => (
              <div
                key={index}
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
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
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "rgba(245, 158, 11, 0.05)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "#f59e0b" }}
          >
            ℹ️ Warnings
          </h3>
          <ul className="space-y-2">
            {warnings.map((warning, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <span className="text-amber-500">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No Risks */}
      {concentrationRisks.length === 0 && risks.length === 0 && (
        <div
          className="rounded-xl p-8 text-center"
          style={{
            backgroundColor: "rgba(34, 197, 94, 0.05)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
          }}
        >
          <div className="text-4xl mb-4">✅</div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: "#22c55e" }}
          >
            No Major Risks Detected
          </h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Your portfolio appears well-diversified with no significant
            concentration risks.
          </p>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════
const SummaryCard = ({ label, value, icon, valueColor }) => (
  <div
    className="rounded-xl p-6"
    style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
    }}
  >
    <div className="flex items-center justify-between">
      <span className="text-2xl">{icon}</span>
    </div>
    <p
      className="mt-4 text-sm font-medium"
      style={{ color: "var(--text-secondary)" }}
    >
      {label}
    </p>
    <p
      className="mt-1 text-2xl font-semibold"
      style={{ color: valueColor || "var(--text-primary)" }}
    >
      {value}
    </p>
  </div>
);

export default ReportTab;
