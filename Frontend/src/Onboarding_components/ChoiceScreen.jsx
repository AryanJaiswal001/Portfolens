import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChoiceCard from "./ChoiceCard";
import { BarChart3, ArrowRight } from "lucide-react";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";

export default function ChoiceScreen() {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  const handleGoToDashboard = async () => {
    try {
      await completeOnboarding();
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      // Still navigate even if the API call fails
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="min-h-screen px-4 py-12 relative"
      style={{ background: "var(--gradient-bg" }}
    >
      {/**Theme toggle- Top right */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/**Header*/}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <Logo className="w-12 h-12"></Logo>
          <span
            className="text-2xl font-bold mb-4"
            style={{
              background: "var(--gradient-text)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Portfolens
          </span>
        </div>

        <div className="text-center">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--text-primary" }}
          >
            Welcome! Let's Get Started
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary" }}
          >
            Choose how you'd like to begin your portfolio management journey
          </p>
        </div>
      </div>

      {/* Choice Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <ChoiceCard
          icon={BarChart3}
          title="Take the Investor Survey"
          description="Help us personalize your experience with a quick 5-question survey about your investment goals and risk tolerance."
          meta="Optional · Takes 2 minutes"
          ctaLabel="Start Survey"
          onClick={() => navigate("/survey")}
          highlighted={true}
        />

        <ChoiceCard
          icon={ArrowRight}
          title="Go to Dashboard"
          description="Jump straight into your portfolio analytics and start exploring AI-powered insights right away."
          meta="You can take the survey later"
          ctaLabel="Continue"
          onClick={handleGoToDashboard}
        />
      </div>

      {/**Footer note*/}
      <div className="text-center mt-8 max-w-2xl mx-auto">
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          You can always access the survey later from your account settings
        </p>
      </div>
    </div>
  );
}
