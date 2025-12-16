import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import PrivateLayout from "./PrivateLayout";

export default function DashboardPage() {
  return (
    <PrivateLayout pageTitle="Dashboard">
      
      <div
        className="rounded-2xl border p-12 text-center"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="max-w-md mx-auto">
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{
              background: "var(--gradient-bg)",
              border: "2px solid var(--border-subtle)",
            }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: "var(--accent-purple)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>

          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Dashboard Content
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Your portfolio analytics, AI-powered insights, and performance
            metrics will appear here. Charts, graphs, and data visualizations
            are coming soon.
          </p>
        </div>
      </div>
    </PrivateLayout>
  );
}
