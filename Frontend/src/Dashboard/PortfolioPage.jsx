import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PrivateLayout from "./PrivateLayout";
import { getPortfolios, deletePortfolio } from "../service/portfolioService";

export default function PortfolioPage() {
  const navigate = useNavigate();

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
    if (!window.confirm("Are you sure you want to delete this portfolio?")) {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateTotalInvestment = (funds) => {
    let total = 0;
    const currentYear = new Date().getFullYear();

    funds.forEach((fund) => {
      // Calculate SIP total (monthly for years since start)
      if (fund.sip) {
        const years = currentYear - fund.investmentStartYear;
        total += fund.sip * 12 * Math.max(1, years);
      }
      // Add lumpsums
      fund.lumpsums?.forEach((l) => {
        total += l.amount || 0;
      });
    });

    return total;
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <PrivateLayout pageTitle="Portfolio">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            My Portfolios
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage your investment portfolios
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/add-investment")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium"
          style={{
            background:
              "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
            color: "white",
          }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Portfolio
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mb-6 p-4 rounded-xl"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
          }}
        >
          {error}
          <button
            onClick={fetchPortfolios}
            className="ml-4 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div
            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: "var(--accent-purple)",
              borderTopColor: "transparent",
            }}
          />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && portfolios.length === 0 && (
        <div
          className="p-12 rounded-2xl text-center"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--bg-app)" }}
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: "var(--text-tertiary)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            No portfolios yet
          </h3>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            Add your first portfolio to start tracking your investments
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/dashboard/add-investment/manual")}
              className="px-6 py-3 rounded-xl font-medium"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
                color: "white",
              }}
            >
              Add Portfolio
            </button>
            <button
              onClick={() => {
                // TODO: Load sample portfolio
                console.log("Load sample portfolio");
              }}
              className="px-6 py-3 rounded-xl font-medium"
              style={{
                backgroundColor: "var(--bg-app)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
              }}
            >
              Try Sample Portfolio
            </button>
          </div>
        </div>
      )}

      {/* Portfolio Cards */}
      {!isLoading && portfolios.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio._id}
              className="p-6 rounded-2xl transition-all hover:scale-[1.02] cursor-pointer"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
              }}
              onClick={() => navigate(`/portfolio/${portfolio._id}`)}
            >
              {/* Portfolio Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3
                    className="font-semibold text-lg mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {portfolio.name}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Created {formatDate(portfolio.createdAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(portfolio._id);
                  }}
                  disabled={deleteId === portfolio._id}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
                >
                  {deleteId === portfolio._id ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>Funds</span>
                  <span style={{ color: "var(--text-primary)" }}>
                    {portfolio.funds.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Total Invested
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--accent-green)" }}
                  >
                    {formatCurrency(calculateTotalInvestment(portfolio.funds))}
                  </span>
                </div>
              </div>

              {/* Fund Types */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[...new Set(portfolio.funds.map((f) => f.assetType))].map(
                  (type) => (
                    <span
                      key={type}
                      className="px-2 py-1 rounded-md text-xs"
                      style={{
                        backgroundColor: "var(--bg-app)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {type}
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PrivateLayout>
  );
}
