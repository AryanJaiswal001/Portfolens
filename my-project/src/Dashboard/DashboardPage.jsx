import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";

export default function DashboardPage() {
  return (
    <div
      className="min-h-screen px-4 py-12 relative"
      style={{ background: "var(--gradient-bg)" }}
    >
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Logo className="w-12 h-12" />
          <span
            className="text-2xl font-bold"
            style={{
              background: "var(--gradient-text)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            PortfoLens
          </span>
        </div>

        <h1
          className="text-4xl font-bold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Dashboard
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Coming soon... Your AI-powered portfolio analytics will appear here.
        </p>
      </div>
    </div>
  );
}
