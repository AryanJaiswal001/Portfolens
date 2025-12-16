import PrivateLayout from "./PrivateLayout";
import { TrendingUp } from "lucide-react";

export default function InsightsPage() {
  return (
    <PrivateLayout pageTitle="AI Insights">
      <div
        className="rounded-2xl border p-12 text-center"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <TrendingUp
          className="w-16 h-16 mx-auto mb-6"
          style={{ color: "var(--accent-purple)" }}
        />
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          AI-Powered Insights
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Intelligent recommendations and market analysis coming soon.
        </p>
      </div>
    </PrivateLayout>
  );
}
