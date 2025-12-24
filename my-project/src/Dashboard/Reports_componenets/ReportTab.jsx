import React, { useState } from "react";
import PrivateLayout from "../PrivateLayout";

const ReportTab = () => {
  const [activeTab, setActiveTab] = useState("summary");

  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "performance", label: "Performance" },
    { id: "allocation", label: "Allocation" },
    { id: "risk", label: "Risk" },
    { id: "overlap", label: "Overlap & Concentration" },
  ];

  // Static mock data
  const mockData = {
    totalInvested: "₹12,50,000",
    currentValue: "₹14,85,230",
    numberOfFunds: 8,
    investmentDuration: "2 years 4 months",
    absoluteReturn: "₹2,35,230",
    percentageReturn: "18.82%",
    riskLevel: "Moderate",
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return <SummaryTab data={mockData} />;
      case "performance":
        return <PerformanceTab data={mockData} />;
      case "allocation":
        return <AllocationTab />;
      case "risk":
        return <RiskTab data={mockData} />;
      case "overlap":
        return <OverlapTab />;
      default:
        return <SummaryTab data={mockData} />;
    }
  };

  return (
    <PrivateLayout pageTitle="Reports">
      <div className="space-y-6">
        {/**Page header*/}
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Reports
          </h1>
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
const SummaryTab = ({ data }) => {
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
const PerformanceTab = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Chart Placeholder */}
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
        <div
          className="h-64 rounded-lg flex items-center justify-center"
          style={{
            background: "var(--bg-input)",
            border: "2px dashed var(--border-medium)",
          }}
        >
          <div className="text-center">
            <span className="text-4xl">📊</span>
            <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
              Performance Chart Placeholder
            </p>
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Invested vs Value trend line
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-xl p-6"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Absolute Return
          </p>
          <p className="mt-2 text-3xl font-bold" style={{ color: "#10b981" }}>
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
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Percentage Return
          </p>
          <p className="mt-2 text-3xl font-bold" style={{ color: "#10b981" }}>
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
const AllocationTab = () => {
  const fundAllocations = [
    {
      fund: "HDFC Mid-Cap Opportunities",
      allocation: "25%",
      amount: "₹3,12,500",
    },
    { fund: "Axis Bluechip Fund", allocation: "20%", amount: "₹2,50,000" },
    { fund: "SBI Small Cap Fund", allocation: "15%", amount: "₹1,87,500" },
    {
      fund: "ICICI Prudential Value Discovery",
      allocation: "15%",
      amount: "₹1,87,500",
    },
    { fund: "Parag Parikh Flexi Cap", allocation: "10%", amount: "₹1,25,000" },
    { fund: "Kotak Equity Hybrid", allocation: "10%", amount: "₹1,25,000" },
    { fund: "Mirae Asset Large Cap", allocation: "5%", amount: "₹62,500" },
  ];

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
        <div
          className="h-64 rounded-lg flex items-center justify-center"
          style={{
            background: "var(--bg-input)",
            border: "2px dashed var(--border-medium)",
          }}
        >
          <div className="text-center">
            <span className="text-4xl">🥧</span>
            <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
              Asset Allocation Chart Placeholder
            </p>
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Pie/Donut chart visualization
            </p>
          </div>
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
              Your portfolio may decline by approximately ₹2,50,000 - ₹3,00,000
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
              Your portfolio may decline by approximately ₹1,25,000 - ₹1,50,000
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
const OverlapTab = () => {
  return (
    <div className="space-y-6">
      {/* Overlap Visualization Placeholder */}
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
        <div
          className="h-64 rounded-lg flex items-center justify-center"
          style={{
            background: "var(--bg-input)",
            border: "2px dashed var(--border-medium)",
          }}
        >
          <div className="text-center">
            <span className="text-4xl">🔄</span>
            <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
              Overlap Visualization Placeholder
            </p>
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Venn diagram or matrix showing fund overlaps
            </p>
          </div>
        </div>
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
          <div
            className="flex items-start p-4 rounded-lg"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid #ef4444",
            }}
          >
            <span className="mr-3" style={{ color: "#ef4444" }}>
              ●
            </span>
            <div>
              <p className="font-medium" style={{ color: "#ef4444" }}>
                HDFC Bank - High Concentration
              </p>
              <p className="text-sm" style={{ color: "#f87171" }}>
                Present in 5 out of 8 funds • Combined exposure: 12.5%
              </p>
            </div>
          </div>
          <div
            className="flex items-start p-4 rounded-lg"
            style={{
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid #f59e0b",
            }}
          >
            <span className="mr-3" style={{ color: "#f59e0b" }}>
              ●
            </span>
            <div>
              <p className="font-medium" style={{ color: "#f59e0b" }}>
                Infosys - Moderate Concentration
              </p>
              <p className="text-sm" style={{ color: "#fbbf24" }}>
                Present in 4 out of 8 funds • Combined exposure: 8.2%
              </p>
            </div>
          </div>
          <div
            className="flex items-start p-4 rounded-lg"
            style={{
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid #f59e0b",
            }}
          >
            <span className="mr-3" style={{ color: "#f59e0b" }}>
              ●
            </span>
            <div>
              <p className="font-medium" style={{ color: "#f59e0b" }}>
                Reliance Industries - Moderate Concentration
              </p>
              <p className="text-sm" style={{ color: "#fbbf24" }}>
                Present in 4 out of 8 funds • Combined exposure: 7.8%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for additional visualization */}
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
        <div
          className="h-48 rounded-lg flex items-center justify-center"
          style={{
            background: "var(--bg-input)",
            border: "2px dashed var(--border-medium)",
          }}
        >
          <div className="text-center">
            <span className="text-4xl">📊</span>
            <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
              Sector Concentration Chart Placeholder
            </p>
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Bar chart showing sector-wise exposure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTab;
