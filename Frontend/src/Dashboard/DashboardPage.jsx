import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivateLayout from "./PrivateLayout";
import { usePortfolio, PORTFOLIO_MODE } from "../context/PortfolioContext";
import { useAnalysis } from "../context/AnalysisContext";
import FullPageLoader from "../components/FullPageLoader";
import {
  PlusCircle,
  FlaskConical,
  TrendingUp,
  FileText,
  Sparkles,
  ArrowRight,
  BarChart3,
  PieChart,
  Shield,
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    portfolioMode,
    hasPortfolio,
    isSampleMode,
    isUserMode,
    loadSamplePortfolio,
  } = usePortfolio();
  const {
    hasAnalysis,
    generateSampleAnalysis,
    loading: analysisLoading,
  } = useAnalysis();

  // Local state for handling sample portfolio loading
  const [isSampleLoading, setIsSampleLoading] = useState(false);
  const [sampleError, setSampleError] = useState(null);

  const handleAddPortfolio = () => {
    navigate("/dashboard/add-investment");
  };

  /**
   * Handle sample portfolio selection
   * CRITICAL: Proper async handling to ensure navigation only after state is ready
   */
  const handleSamplePortfolio = async () => {
    try {
      setIsSampleLoading(true);
      setSampleError(null);

      // Step 1: Load sample portfolio into context
      loadSamplePortfolio();

      // Step 2: Generate sample analysis
      const result = await generateSampleAnalysis();

      if (result.success) {
        // Step 3: Navigate ONLY after both portfolio and analysis are ready
        navigate("/insights");
      } else {
        // Analysis failed but portfolio is loaded - still navigate
        setSampleError(
          "Analysis generation failed, but you can still explore."
        );
        navigate("/insights");
      }
    } catch (error) {
      console.error("Sample portfolio error:", error);
      setSampleError("Failed to load sample portfolio. Please try again.");
    } finally {
      setIsSampleLoading(false);
    }
  };

  const handleGoToInsights = () => {
    navigate("/insights");
  };

  const handleGoToReports = () => {
    navigate("/reports");
  };

  // Show full page loader when loading sample portfolio
  if (isSampleLoading) {
    return <FullPageLoader message="Loading sample portfolio..." />;
  }

  // ══════════════════════════════════════════════════════════════
  // RENDER: EMPTY MODE (portfolioMode === "NONE")
  // ══════════════════════════════════════════════════════════════
  if (portfolioMode === PORTFOLIO_MODE.NONE) {
    return (
      <PrivateLayout pageTitle="Dashboard">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Hero Section */}
          <div
            className="rounded-2xl p-8 mb-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div
                className="p-3 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
                }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Welcome to PortfoLens
                </h1>
                <p
                  className="text-base"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Get deep insights into your mutual fund portfolio with
                  AI-powered analysis, diversification scores, and risk
                  assessment.
                </p>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: PieChart, label: "Asset Allocation" },
                { icon: TrendingUp, label: "Performance Analytics" },
                { icon: Shield, label: "Risk Assessment" },
                { icon: BarChart3, label: "Sector Exposure" },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <feature.icon className="w-4 h-4" />
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Two-Column CTA Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Error Message */}
            {sampleError && (
              <div
                className="col-span-full p-4 rounded-xl mb-2"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                }}
              >
                <p className="text-red-500 text-sm">{sampleError}</p>
              </div>
            )}

            {/* PRIMARY CTA: Try Sample Portfolio */}
            <button
              onClick={handleSamplePortfolio}
              disabled={isSampleLoading || analysisLoading}
              className="group relative rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)",
                boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
              }}
            >
              {/* Recommended Badge */}
              <div
                className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: "#facc15",
                  color: "#1f2937",
                }}
              >
                ✨ RECOMMENDED FOR NEW USERS
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  <FlaskConical className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Try Sample Portfolio
                  </h2>
                  <p className="text-sm text-white/80 mb-4">
                    Explore all features with a realistic demo portfolio. See
                    insights, reports, and analytics instantly.
                  </p>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <span>
                      {isSampleLoading || analysisLoading
                        ? "Loading..."
                        : "Start Demo"}
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </button>

            {/* SECONDARY CTA: Add Your Portfolio */}
            <button
              onClick={handleAddPortfolio}
              className="group rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "2px dashed var(--border-medium)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-xl"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <PlusCircle
                    className="w-8 h-8"
                    style={{ color: "var(--accent-purple)" }}
                  />
                </div>
                <div className="flex-1">
                  <h2
                    className="text-xl font-bold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Add Your Portfolio
                  </h2>
                  <p
                    className="text-sm mb-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Enter your mutual fund investments to get personalized
                    analysis and recommendations.
                  </p>
                  <div
                    className="flex items-center gap-2 font-medium"
                    style={{ color: "var(--accent-purple)" }}
                  >
                    <span>Add Investments</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Info Note */}
          <div
            className="mt-6 p-4 rounded-xl text-center"
            style={{
              backgroundColor: "var(--bg-input)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              💡 <strong>Tip:</strong> Try the sample portfolio first to see
              what PortfoLens can do, then add your own investments for
              personalized insights.
            </p>
          </div>
        </div>
      </PrivateLayout>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // RENDER: SAMPLE MODE (portfolioMode === "SAMPLE")
  // ══════════════════════════════════════════════════════════════
  if (isSampleMode) {
    return (
      <PrivateLayout pageTitle="Dashboard">
        <div className="max-w-4xl mx-auto">
          {/* Sample Portfolio Banner */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-2 rounded-lg"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
                }}
              >
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2
                  className="text-lg font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Sample Portfolio Mode
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  You're viewing a demo portfolio. Explore all features below!
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleGoToInsights}
                className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <TrendingUp
                  className="w-6 h-6"
                  style={{ color: "var(--accent-purple)" }}
                />
                <div className="text-left">
                  <p
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    View Insights
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    AI-powered analysis
                  </p>
                </div>
                <ArrowRight
                  className="w-5 h-5 ml-auto"
                  style={{ color: "var(--text-tertiary)" }}
                />
              </button>

              <button
                onClick={handleGoToReports}
                className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <FileText
                  className="w-6 h-6"
                  style={{ color: "var(--accent-blue)" }}
                />
                <div className="text-left">
                  <p
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    View Reports
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Detailed analytics
                  </p>
                </div>
                <ArrowRight
                  className="w-5 h-5 ml-auto"
                  style={{ color: "var(--text-tertiary)" }}
                />
              </button>
            </div>
          </div>

          {/* Ready to Add Your Own? */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Ready to analyze your own portfolio?
            </h3>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Add your mutual fund investments to get personalized insights and
              recommendations.
            </p>
            <button
              onClick={handleAddPortfolio}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--accent-purple)",
                color: "white",
              }}
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Your Portfolio</span>
            </button>
          </div>
        </div>
      </PrivateLayout>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // RENDER: USER MODE (portfolioMode === "USER")
  // ══════════════════════════════════════════════════════════════
  return (
    <PrivateLayout pageTitle="Dashboard">
      <div className="max-w-4xl mx-auto">
        {/* Portfolio Overview Card */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Your Portfolio
          </h2>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            Your portfolio analytics, charts, and insights are ready to explore.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleGoToInsights}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--accent-purple)",
                color: "white",
              }}
            >
              <TrendingUp className="w-5 h-5" />
              <span>View Insights</span>
            </button>

            <button
              onClick={handleGoToReports}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: "var(--bg-input)",
                border: "1px solid var(--border-medium)",
                color: "var(--text-primary)",
              }}
            >
              <FileText className="w-5 h-5" />
              <span>View Reports</span>
            </button>

            <button
              onClick={handleAddPortfolio}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: "transparent",
                border: "1px dashed var(--border-medium)",
                color: "var(--text-secondary)",
              }}
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add More Investments</span>
            </button>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}
