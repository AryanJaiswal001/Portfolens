import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivateLayout from "./PrivateLayout";
import EmptyState from "../components/EmptyState";
import { PlusCircle } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();

  // Simulated state - will be replaced with real data later
  const [hasPortfolio, setHasPortfolio] = useState(false);

  const handleAddPortfolio = () => {
    console.log("Add Portfolio clicked");
    navigate("/dashboard/add-investment")
  };

  return (
    <PrivateLayout pageTitle="Dashboard">
      {!hasPortfolio ? (
        // Empty State
        <EmptyState
          icon={PlusCircle}
          title="No portfolio added yet"
          description="Start by adding your investments to see insights, allocation, and risk analysis."
          actionLabel="Add Portfolio"
          onAction={handleAddPortfolio}
        />
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

          {/* Temporary button to reset state */}
          <button
            onClick={() => setHasPortfolio(false)}
            className="mt-4 px-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: "var(--bg-button-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-medium)",
            }}
          >
            Reset to Empty State (Dev Only)
          </button>
        </div>
      )}
    </PrivateLayout>
  );
}
