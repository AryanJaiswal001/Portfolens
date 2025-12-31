import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PrivateLayout from "./PrivateLayout";
import PortfolioCard from "./Portfolio_Components/PortfolioCard";
import { getPortfolios, deletePortfolio } from "../service/portfolioService";
import { useAnalysis } from "../context/AnalysisContext";
import { Plus, Briefcase, Sparkles } from "lucide-react";

export default function PortfolioPage() {
  const navigate = useNavigate();
  const { generateSampleAnalysis } = useAnalysis();

  const [portfolios, setPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Fetch portfolios on mount
  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await getPortfolios();
      setPortfolios(response.data.portfolios);
    } catch (err) {
      setError(err.message || "Failed to load portfolios");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (portfolioId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this portfolio? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleteId(portfolioId);
      await deletePortfolio(portfolioId);
      setPortfolios(portfolios.filter((p) => p._id !== portfolioId));
    } catch (err) {
      setError(err.message || "Failed to delete portfolio");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <PrivateLayout pageTitle="Portfolio">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            My Portfolios
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            {portfolios.length > 0
              ? `${portfolios.length} portfolio${
                  portfolios.length > 1 ? "s" : ""
                } saved`
              : "Manage your investment portfolios"}
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/add-investment")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all hover:opacity-90 hover:scale-105"
          style={{
            background:
              "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
            color: "white",
          }}
        >
          <Plus className="w-5 h-5" />
          Add Portfolio
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mb-6 p-4 rounded-xl flex items-center justify-between"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
          }}
        >
          <span>{error}</span>
          <button
            onClick={fetchPortfolios}
            className="ml-4 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col justify-center items-center py-20">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4"
            style={{
              borderColor: "var(--accent-purple)",
              borderTopColor: "transparent",
            }}
          />
          <p style={{ color: "var(--text-secondary)" }}>
            Loading your portfolios...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && portfolios.length === 0 && (
        <div
          className="p-12 rounded-2xl text-center"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Icon */}
          <div
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))",
            }}
          >
            <Briefcase
              className="w-12 h-12"
              style={{ color: "var(--accent-purple)" }}
            />
          </div>

          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            No portfolios yet
          </h3>
          <p
            className="mb-8 max-w-md mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Create your first portfolio to start tracking your investments and
            get personalized insights.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/dashboard/add-investment/manual")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
                color: "white",
              }}
            >
              <Plus className="w-5 h-5" />
              Create Portfolio
            </button>
            <button
              onClick={async () => {
                await generateSampleAnalysis();
                navigate("/insights");
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:bg-white/5"
              style={{
                backgroundColor: "var(--bg-app)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
              }}
            >
              <Sparkles className="w-5 h-5" />
              Try Sample Portfolio
            </button>
          </div>
        </div>
      )}

      {/* Portfolio Cards Grid */}
      {!isLoading && portfolios.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <PortfolioCard
              key={portfolio._id}
              portfolio={portfolio}
              onDelete={handleDelete}
              isDeleting={deleteId === portfolio._id}
            />
          ))}
        </div>
      )}
    </PrivateLayout>
  );
}
