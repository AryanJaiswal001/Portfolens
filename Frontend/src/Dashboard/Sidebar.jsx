import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  TrendingUp,
  FileText,
  Settings,
  FlaskConical,
} from "lucide-react";
import Logo from "../components/Logo";
import { usePortfolio, PORTFOLIO_MODE } from "../context/PortfolioContext";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/portfolio", label: "Portfolio", icon: Briefcase },
  { path: "/insights", label: "Insights", icon: TrendingUp },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const { portfolioMode, isSampleMode, exitSampleMode } = usePortfolio();

  return (
    <aside
      className="w-64 border-r flex flex-col"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-subtle)",
      }}
    >
      {/**Logo section*/}
      <div
        className="p-6 border-b"
        style={{
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="flex items-center space-x-3">
          <Logo className="w-10 h-10" />
          <span
            className="text-xl font-bold"
            style={{
              background: "var(--gradient-text)",
              WebkitBackdropClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            PortfoLens
          </span>
        </div>
      </div>

      {/* Sample Mode Indicator */}
      {isSampleMode && (
        <div
          className="mx-4 mt-4 p-3 rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))",
            border: "1px solid rgba(139, 92, 246, 0.3)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical
              className="w-4 h-4"
              style={{ color: "var(--accent-purple)" }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--accent-purple)" }}
            >
              DEMO MODE
            </span>
          </div>
          <p
            className="text-xs mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Viewing sample portfolio
          </p>
          <button
            onClick={exitSampleMode}
            className="text-xs font-medium px-2 py-1 rounded-md transition-colors"
            style={{
              backgroundColor: "rgba(139, 92, 246, 0.2)",
              color: "var(--accent-purple)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.2)";
            }}
          >
            Exit Demo
          </button>
        </div>
      )}

      {/**Navigation*/}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? "var(--bg-app)" : "transparent",
                    color: isActive
                      ? "var(--accent-purple)"
                      : "var(--text-secondary)",
                    fontWeight: isActive ? "600" : "500",
                    border: isActive
                      ? "1px solid var(--border-medium)"
                      : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "var(--bg-app)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <Icon className="w-5 h-5"></Icon>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Footer / Version */}
      <div
        className="p-4 border-t"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <p
          className="text-xs text-center"
          style={{ color: "var(--text-tertiary)" }}
        >
          v1.0.0 · PortfoLens
        </p>
      </div>
    </aside>
  );
}
