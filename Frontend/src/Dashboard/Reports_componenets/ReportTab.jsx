import React, { useState } from "react";
import PrivateLayout from "../PrivateLayout";
import ReportEmptyState from "./ReportEmptyState";
import { usePortfolio } from "../../context/PortfolioContext";
import { formatCurrency } from "../../data/samplePortfolio";
import { PieChart, ShieldAlert, Layers, FlaskConical } from "lucide-react";
import {
  PerformanceChart,
  AllocationDonutChart,
  OverlapVisualization,
  SectorConcentrationChart,
} from "../../components/charts";

const ReportTab = () => {
  const [activeTab, setActiveTab] = useState("summary");

  // Get portfolio data from context - single source of truth
  const { activePortfolio, hasPortfolio, isSample } = usePortfolio();

  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "performance", label: "Performance" },
    { id: "allocation", label: "Allocation" },
    { id: "risk", label: "Risk" },
    { id: "overlap", label: "Overlap & Concentration" },
  ];

  // Build report data from activePortfolio or use defaults
  const reportData = {
    totalInvested: hasPortfolio
      ? formatCurrency(activePortfolio.totalInvested)
      : "₹0",
    currentValue: hasPortfolio
      ? formatCurrency(activePortfolio.currentValue)
      : "₹0",
    numberOfFunds: activePortfolio?.numberOfFunds ?? 0,
    investmentDuration: activePortfolio?.investmentDuration ?? "—",
    absoluteReturn: hasPortfolio
      ? formatCurrency(activePortfolio.absoluteReturn)
      : "₹0",
    percentageReturn: hasPortfolio
      ? `${activePortfolio.percentageReturn}%`
      : "0%",
    riskLevel: activePortfolio?.riskLevel ?? "—",
    funds: activePortfolio?.funds ?? [],
    allocation: activePortfolio?.allocation ?? {},
    stockOverlap: activePortfolio?.stockOverlap ?? [],
    sectorConcentration: activePortfolio?.sectorConcentration ?? [],
    riskScenarios: activePortfolio?.riskScenarios ?? null,
    performanceHistory: activePortfolio?.performanceHistory ?? [],
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        // Summary always renders with zero defaults
        return <SummaryTab data={reportData} hasData={hasPortfolio} />;
      case "performance":
        // Performance always renders with zero/placeholder
        return <PerformanceTab data={reportData} hasData={hasPortfolio} />;
      case "allocation":
        // Allocation shows empty state if no data
        return hasPortfolio ? (
          <AllocationTab data={reportData} />
        ) : (
          <ReportEmptyState
            icon={PieChart}
            title="No Allocation Data Available"
            description="This report shows how your investments are distributed across different funds and asset classes. Add your portfolio to see your personalized allocation breakdown."
          />
        );
      case "risk":
        // Risk shows empty state if no data
        return hasPortfolio ? (
          <RiskTab data={reportData} />
        ) : (
          <ReportEmptyState
            icon={ShieldAlert}
            title="No Risk Analysis Available"
            description="This report evaluates your portfolio's risk level based on asset allocation and historical volatility. Add your investments to see potential market impact scenarios."
          />
        );
      case "overlap":
        // Overlap shows empty state if no data
        return hasPortfolio ? (
          <OverlapTab data={reportData} />
        ) : (
          <ReportEmptyState
            icon={Layers}
            title="No Overlap Data Available"
            description="This report identifies hidden stock duplications across your mutual funds that may reduce diversification. Add multiple funds to analyze concentration risks."
          />
        );
      default:
        return <SummaryTab data={reportData} hasData={hasPortfolio} />;
    }
  };

  return (
    <PrivateLayout pageTitle="Reports">
      <div className="space-y-6">
        {/**Page header*/}
        <div>
          <div className="flex items-center gap-3">
            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Reports
            </h1>
            {/* Sample Data Badge */}
            {isSample && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)",
                  color: "var(--accent-purple)",
                  border: "1px solid var(--accent-purple)",
                }}
              >
                <FlaskConical className="w-3 h-3" />
                Sample Data
              </span>
            )}
          </div>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            Detailed analysis and explanations of your portfolio insights
          </p>
        </div>
        {/**Tab navigation*/}
        <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <nav className="flex overflow-x-auto scrollbar-hide -mb-px space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="whitespace-nowrap py-4 px-1 font-medium text-sm"
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
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/**Tab content*/}
        <div>{renderTabContent()}</div>
      </div>
    </PrivateLayout>
  );
};

//Summary tab
const SummaryTab = ({ data, hasData }) => {
  const infoCards = [
    { label: "Total Invested", value: data.totalInvested, icon: "💰" },
    { label: "Current Value", value: data.currentValue, icon: "📈" },
    { label: "Number of Funds", value: data.numberOfFunds, icon: "📊" },
    {
      label: "Investment Duration",
      value: data.investmentDuration,
      icon: "⏱️",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Empty state hint banner */}
      {!hasData && (
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{
            background: "rgba(147, 51, 234, 0.05)",
            border: "1px dashed var(--accent-purple)",
          }}
        >
          <span className="text-xl">💡</span>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Add your portfolio to see real investment data. Currently showing
            default values.
          </p>
        </div>
      )}

      {/**Info Cards Grid*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {infoCards.map((card, index) => (
          <div
            key={index}
            className="rounded-xl p-6"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-card)",
              opacity: hasData ? 1 : 0.7,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{card.icon}</span>
            </div>

            <p
              className="mt-4 text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {card.label}
            </p>
            <p
              className="mt-1 text-2xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/**Explaination block*/}
      <div
        className="rounded-xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(147,51,234,0.1) 0%, rgba(37,85,235,0.1) 100%)",
          border: "1px solid var(--accent-purple)",
        }}
      >
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          📋 Summary Overview
        </h3>
        <p style={{ color: "var(--text-secondary)" }}>
          This summary gives a high-level view of how your portfolio is
          structured and deployed. It provides key metrics at a glance, helping
          you understand your overall investment position without diving into
          granular details.
        </p>
      </div>
    </div>
  );
};

// ==================== PERFORMANCE TAB ====================
const PerformanceTab = ({ data, hasData }) => {
  return (
    <div className="space-y-6">
      {/* Empty state hint banner */}
      {!hasData && (
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{
            background: "rgba(16, 185, 129, 0.05)",
            border: "1px dashed #10b981",
          }}
        >
          <span className="text-xl">📊</span>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Add your portfolio to track investment performance over time.
            Currently showing baseline values.
          </p>
        </div>
      )}

      {/* Performance Chart */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Invested vs Current Value Over Time
        </h3>
        <PerformanceChart
          data={data.performanceHistory}
          height={256}
          showLegend={true}
        />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-xl p-6"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
            opacity: hasData ? 1 : 0.7,
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
            style={{ color: hasData ? "#10b981" : "var(--text-tertiary)" }}
          >
            {data.absoluteReturn}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
            Total profit earned
          </p>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
            opacity: hasData ? 1 : 0.7,
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Percentage Return
          </p>
          <p
            className="mt-2 text-3xl font-bold"
            style={{ color: hasData ? "#10b981" : "var(--text-tertiary)" }}
          >
            {data.percentageReturn}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
            Return on investment
          </p>
        </div>
      </div>

      {/* Explanation Card */}
      <div
        className="rounded-xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)",
          border: "1px solid #10b981",
        }}
      >
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          📈 Performance Explained
        </h3>
        <p style={{ color: "var(--text-secondary)" }}>
          This section explains how your investments have grown over time and
          how market movements impacted returns. The chart above visualizes the
          journey of your portfolio value compared to your invested capital,
          helping you understand growth patterns and market cycles.
        </p>
      </div>
    </div>
  );
};

// ==================== ALLOCATION TAB ====================
const AllocationTab = ({ data }) => {
  // Use funds from context data
  const fundAllocations = data.funds.map((fund) => ({
    fund: fund.name,
    allocation: `${fund.allocation}%`,
    amount: formatCurrency(fund.invested),
  }));

  return (
    <div className="space-y-6">
      {/* Pie Chart Placeholder */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
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
            data={data.allocation}
            size={200}
            strokeWidth={35}
            showLegend={true}
          />
        </div>
      </div>

      {/* Fund-wise Allocation Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
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
            Fund-wise Allocation
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "var(--bg-input)" }}>
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Fund Name
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Allocation
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {fundAllocations.map((fund, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom:
                      index !== fundAllocations.length - 1
                        ? "1px solid var(--border-subtle)"
                        : "none",
                  }}
                  className="hover:opacity-80"
                >
                  <td
                    className="px-6 py-4 text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {fund.fund}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)",
                        color: "var(--accent-purple)",
                        border: "1px solid var(--accent-purple)",
                      }}
                    >
                      {fund.allocation}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {fund.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanation Block */}
      <div
        className="rounded-xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
          border: "1px solid var(--accent-blue)",
        }}
      >
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          🎯 Allocation Breakdown
        </h3>
        <p style={{ color: "var(--text-secondary)" }}>
          This breakdown helps you understand capital distribution across assets
          and funds. Proper allocation ensures diversification, balancing risk
          and return potential across different market segments and investment
          styles.
        </p>
      </div>
    </div>
  );
};

// ==================== RISK TAB ====================
const RiskTab = ({ data }) => {
  const getRiskStyles = (level) => {
    switch (level) {
      case "Low":
        return {
          background: "rgba(16, 185, 129, 0.1)",
          color: "#10b981",
          border: "2px solid #10b981",
        };
      case "Moderate":
        return {
          background: "rgba(245, 158, 11, 0.1)",
          color: "#f59e0b",
          border: "2px solid #f59e0b",
        };
      case "High":
        return {
          background: "rgba(239, 68, 68, 0.1)",
          color: "#ef4444",
          border: "2px solid #ef4444",
        };
      default:
        return {
          background: "var(--bg-input)",
          color: "var(--text-primary)",
          border: "2px solid var(--border-medium)",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Indicator Card */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Portfolio Risk Level
        </h3>
        <div className="flex items-center space-x-4">
          <div
            className="px-6 py-4 rounded-xl"
            style={getRiskStyles(data.riskLevel)}
          >
            <p className="text-3xl font-bold">{data.riskLevel}</p>
          </div>
          <div className="flex-1">
            <div className="flex space-x-2">
              <div
                className="flex-1 h-3 rounded-full"
                style={{ background: "#10b981" }}
              ></div>
              <div
                className="flex-1 h-3 rounded-full"
                style={{ background: "#f59e0b" }}
              ></div>
              <div
                className="flex-1 h-3 rounded-full"
                style={{ background: "var(--border-subtle)" }}
              ></div>
            </div>
            <div
              className="flex justify-between mt-1 text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Explanation */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          📉 Market Correction Impact Scenario
        </h3>
        <div className="space-y-4">
          <div
            className="p-4 rounded-lg"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid #ef4444",
            }}
          >
            <p className="font-medium" style={{ color: "#ef4444" }}>
              If market falls by 20%
            </p>
            <p className="mt-1 text-sm" style={{ color: "#f87171" }}>
              Your portfolio may decline by approximately{" "}
              {data.riskScenarios
                ? formatCurrency(
                    data.riskScenarios.marketFall20.potentialLossMin
                  )
                : "₹0"}{" "}
              -{" "}
              {data.riskScenarios
                ? formatCurrency(
                    data.riskScenarios.marketFall20.potentialLossMax
                  )
                : "₹0"}
            </p>
          </div>
          <div
            className="p-4 rounded-lg"
            style={{
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid #f59e0b",
            }}
          >
            <p className="font-medium" style={{ color: "#f59e0b" }}>
              If market falls by 10%
            </p>
            <p className="mt-1 text-sm" style={{ color: "#fbbf24" }}>
              Your portfolio may decline by approximately{" "}
              {data.riskScenarios
                ? formatCurrency(
                    data.riskScenarios.marketFall10.potentialLossMin
                  )
                : "₹0"}{" "}
              -{" "}
              {data.riskScenarios
                ? formatCurrency(
                    data.riskScenarios.marketFall10.potentialLossMax
                  )
                : "₹0"}
            </p>
          </div>
        </div>
      </div>

      {/* Explanation Block */}
      <div
        className="rounded-xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)",
          border: "1px solid #f59e0b",
        }}
      >
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          ⚠️ Understanding Risk
        </h3>
        <p style={{ color: "var(--text-secondary)" }}>
          Risk is evaluated based on allocation and historical volatility
          assumptions. Your current allocation to mid-cap and small-cap funds
          increases portfolio volatility, but also provides higher growth
          potential over the long term.
        </p>
      </div>
    </div>
  );
};

// ==================== OVERLAP & CONCENTRATION TAB ====================
const OverlapTab = ({ data }) => {
  const stockOverlap = data.stockOverlap || [];
  const sectorConcentration = data.sectorConcentration || [];

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case "high":
        return {
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid #ef4444",
          dotColor: "#ef4444",
          textColor: "#ef4444",
          subTextColor: "#f87171",
        };
      case "moderate":
        return {
          background: "rgba(245, 158, 11, 0.1)",
          border: "1px solid #f59e0b",
          dotColor: "#f59e0b",
          textColor: "#f59e0b",
          subTextColor: "#fbbf24",
        };
      default:
        return {
          background: "rgba(34, 197, 94, 0.1)",
          border: "1px solid #22c55e",
          dotColor: "#22c55e",
          textColor: "#22c55e",
          subTextColor: "#4ade80",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Overlap Visualization */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Stock Overlap Analysis
        </h3>
        <OverlapVisualization
          stockOverlap={stockOverlap}
          totalFunds={data.numberOfFunds}
        />
      </div>

      {/* Explanation Card */}
      <div
        className="rounded-xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
          border: "1px solid #6366f1",
        }}
      >
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          🔍 Overlap Explained
        </h3>
        <p style={{ color: "var(--text-secondary)" }}>
          Multiple funds may hold similar stocks, reducing diversification
          benefits. For example, if three of your funds hold HDFC Bank, your
          actual exposure to that stock is higher than it appears in any single
          fund.
        </p>
      </div>

      {/* Concentration Warning */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          ⚡ Concentration Warnings
        </h3>
        <div className="space-y-3">
          {stockOverlap.map((item, index) => {
            const styles = getSeverityStyles(item.severity);
            return (
              <div
                key={index}
                className="flex items-start p-4 rounded-lg"
                style={{
                  background: styles.background,
                  border: styles.border,
                }}
              >
                <span className="mr-3" style={{ color: styles.dotColor }}>
                  ●
                </span>
                <div>
                  <p
                    className="font-medium"
                    style={{ color: styles.textColor }}
                  >
                    {item.stock} -{" "}
                    {item.severity.charAt(0).toUpperCase() +
                      item.severity.slice(1)}{" "}
                    Concentration
                  </p>
                  <p className="text-sm" style={{ color: styles.subTextColor }}>
                    Present in {item.fundsHolding} out of {item.totalFunds}{" "}
                    funds • Combined exposure: {item.combinedExposure}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sector Concentration Chart */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Sector Concentration
        </h3>
        <SectorConcentrationChart data={sectorConcentration} />
      </div>
    </div>
  );
};

export default ReportTab;
