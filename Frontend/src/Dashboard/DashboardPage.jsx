import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivateLayout from "./PrivateLayout";
import EmptyState from "../components/EmptyState";
import { usePortfolio } from "../context/PortfolioContext";
import { PlusCircle, FlaskConical } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { hasPortfolio, isSample, loadSamplePortfolio, clearPortfolio } =
    usePortfolio();

  const handleAddPortfolio = () => {
    console.log("Add Portfolio clicked");
    navigate("/dashboard/add-investment");
  };

  const handleSamplePortfolio = () => {
    loadSamplePortfolio();
    navigate("/insights");
  };

  return (
    <PrivateLayout pageTitle="Dashboard">
      {!hasPortfolio ? (
        // Empty State with Sample Portfolio Bubble
        <div className="relative">
          {/* Sample Portfolio Floating Bubble */}
          <div className="absolute -top-3 -left-3 z-10 group">
            <button
              onClick={handleSamplePortfolio}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)",
                color: "var(--text-inverse)",
                boxShadow: "0 4px 12px rgba(147, 51, 234, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(147, 51, 234, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(147, 51, 234, 0.3)";
              }}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Try sample portfolio</span>
            </button>

            {/* Tooltip */}
            <div
              className="absolute left-0 top-full mt-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20"
              style={{
                background: "var(--bg-card)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-subtle)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              Preview insights & reports without adding your data
              {/* Tooltip Arrow */}
              <div
                className="absolute -top-1 left-4 w-2 h-2 rotate-45"
                style={{
                  background: "var(--bg-card)",
                  borderLeft: "1px solid var(--border-subtle)",
                  borderTop: "1px solid var(--border-subtle)",
                }}
              />
            </div>
          </div>

          <EmptyState
            icon={PlusCircle}
            title="No portfolio added yet"
            description="Start by adding your investments to see insights, allocation, and risk analysis."
            actionLabel="Add Portfolio"
            onAction={handleAddPortfolio}
          />
        </div>
      ) : (
        // Portfolio Content (placeholder for now)
        <div
          className="rounded-2xl border p-12"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Portfolio Overview
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Your portfolio analytics, charts, and insights will appear here.
          </p>

          {/**Add investment button*/}
          {/* Add Investment Button */}
          <button
            onClick={handleAddPortfolio}
            className="mt-6 px-6 py-3 rounded-xl font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--accent-purple)",
              color: "white",
            }}
          >
            Add More Investments
          </button>

          
        </div>
      )}
    </PrivateLayout>
  );
}
