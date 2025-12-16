import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";

export default function SurveyPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen px-4 py-12 relative"
      style={{ background: "var(--gradient-bg)" }}
    >
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-3 mb-8">
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
          Investor Survey
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Coming soon... This will be your personalized investor questionnaire.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-8 px-6 py-3 rounded-lg font-semibold"
          style={{
            background: "var(--bg-button-primary)",
            color: "var(--text-inverse)",
          }}
        >
          Skip to Dashboard
        </button>
      </div>
    </div>
  );
}
