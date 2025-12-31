import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  TrendingUp,
  Layers,
  MoreVertical,
  Edit3,
  Trash2,
  BarChart3,
  ChevronRight,
  X,
} from "lucide-react";

/**
 * Portfolio Card Component
 *
 * Displays a summary of saved portfolio data
 * - Clickable to show full details
 * - No calculations or analysis
 * - Just confirmation + control
 */

export default function PortfolioCard({ portfolio, onDelete, isDeleting }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Extract stats from portfolio data (no calculations)
  // Support both old (f.sip) and new (f.sips array) SIP formats
  const stats = {
    fundsCount: portfolio.funds?.length || 0,
    sipsCount:
      portfolio.funds?.reduce((acc, f) => {
        // New format: sips array
        if (f.sips && Array.isArray(f.sips)) {
          return acc + f.sips.filter((s) => s.amount > 0).length;
        }
        // Old format: single sip value
        if (f.sip && f.sip > 0) return acc + 1;
        return acc;
      }, 0) || 0,
    lumpsumCount:
      portfolio.funds?.reduce((acc, f) => acc + (f.lumpsums?.length || 0), 0) ||
      0,
    earliestYear: portfolio.funds?.length
      ? Math.min(
          ...portfolio.funds.map((f) => {
            // New format: get earliest from sips array
            if (f.sips && Array.isArray(f.sips) && f.sips.length > 0) {
              return Math.min(...f.sips.map((s) => s.startYear || Infinity));
            }
            // Old format: investmentStartYear
            return f.investmentStartYear || Infinity;
          })
        )
      : null,
  };

  // Get unique asset types
  const assetTypes = [...new Set(portfolio.funds?.map((f) => f.assetType))];

  // Get top fund names for preview
  const topFunds = portfolio.funds?.slice(0, 2).map((f) => f.assetName) || [];
  const moreFundsCount = Math.max(0, (portfolio.funds?.length || 0) - 2);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Handle card click
  const handleCardClick = () => {
    setShowDetails(true);
  };

  // Handle edit
  const handleEdit = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    navigate(`/dashboard/edit-portfolio/${portfolio._id}`);
  };

  // Handle delete
  const handleDelete = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete(portfolio._id);
  };

  // Handle view insights
  const handleViewInsights = (e) => {
    e.stopPropagation();
    navigate(`/insights?portfolio=${portfolio._id}`);
  };

  return (
    <>
      {/* Portfolio Card */}
      <div
        onClick={handleCardClick}
        className="group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-lg truncate mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              {portfolio.name}
            </h3>
            <div
              className="flex items-center gap-1.5 text-sm"
              style={{ color: "var(--text-tertiary)" }}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Created {formatDate(portfolio.createdAt)}</span>
            </div>
          </div>

          {/* Kebab Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: "var(--text-secondary)" }}
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <div
                  className="absolute right-0 top-full mt-1 w-40 py-1 rounded-xl z-20 shadow-lg"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-white/5"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Portfolio
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-red-500/10 text-red-500 disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Summary Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "var(--accent-purple)",
              color: "white",
            }}
          >
            <Briefcase className="w-3 h-3" />
            {stats.fundsCount} {stats.fundsCount === 1 ? "Fund" : "Funds"}
          </span>

          {stats.sipsCount > 0 && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.15)",
                color: "var(--accent-green)",
              }}
            >
              <TrendingUp className="w-3 h-3" />
              {stats.sipsCount} {stats.sipsCount === 1 ? "SIP" : "SIPs"}
            </span>
          )}

          {stats.lumpsumCount > 0 && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                color: "var(--accent-blue)",
              }}
            >
              <Layers className="w-3 h-3" />
              {stats.lumpsumCount}{" "}
              {stats.lumpsumCount === 1 ? "Lumpsum" : "Lumpsums"}
            </span>
          )}

          {stats.earliestYear && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: "var(--bg-app)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <Calendar className="w-3 h-3" />
              Since {stats.earliestYear}
            </span>
          )}
        </div>

        {/* Asset Type Badges */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {assetTypes.map((type) => (
              <span
                key={type}
                className="px-2.5 py-1 rounded-md text-xs font-medium"
                style={{
                  backgroundColor: "var(--bg-app)",
                  color: "var(--text-secondary)",
                }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Fund Preview */}
        {topFunds.length > 0 && (
          <div
            className="p-3 rounded-xl mb-4"
            style={{ backgroundColor: "var(--bg-app)" }}
          >
            <p
              className="text-xs mb-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Holdings
            </p>
            <p
              className="text-sm truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {topFunds.join(", ")}
              {moreFundsCount > 0 && (
                <span style={{ color: "var(--text-tertiary)" }}>
                  {" "}
                  +{moreFundsCount} more
                </span>
              )}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleViewInsights}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all hover:opacity-90"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
              color: "white",
            }}
          >
            <BarChart3 className="w-4 h-4" />
            View Insights
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2.5 rounded-xl font-medium text-sm transition-all hover:bg-white/10"
            style={{
              backgroundColor: "var(--bg-app)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Click hint */}
        <div
          className="absolute bottom-2 right-3 flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: "var(--text-tertiary)" }}
        >
          Click for details
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>

      {/* Portfolio Details Modal */}
      {showDetails && (
        <PortfolioDetailsModal
          portfolio={portfolio}
          stats={stats}
          onClose={() => setShowDetails(false)}
          onEdit={() => navigate(`/dashboard/edit-portfolio/${portfolio._id}`)}
          onViewInsights={() =>
            navigate(`/insights?portfolio=${portfolio._id}`)
          }
        />
      )}
    </>
  );
}

/**
 * Portfolio Details Modal
 *
 * Shows complete portfolio information
 */
function PortfolioDetailsModal({
  portfolio,
  stats,
  onClose,
  onEdit,
  onViewInsights,
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // Format month number to short month name
  const formatMonth = (monthNum) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[(monthNum || 1) - 1] || "Jan";
  };

  // Format SIP summary string
  const formatSipSummary = (sip) => {
    const amount = formatCurrency(sip.amount);
    const startDate = `${formatMonth(sip.startMonth)} ${sip.startYear}`;

    if (sip.isOngoing !== false) {
      return `${amount}/month (Ongoing since ${startDate})`;
    } else {
      const endDate = `${formatMonth(sip.endMonth)} ${sip.endYear}`;
      return `${amount}/month (${startDate} – ${endDate})`;
    }
  };

  // Get earliest investment year for a fund
  const getStartYear = (fund) => {
    if (fund.sips && Array.isArray(fund.sips) && fund.sips.length > 0) {
      return Math.min(...fund.sips.map((s) => s.startYear || Infinity));
    }
    return fund.investmentStartYear;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {portfolio.name}
          </h2>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Created on {formatDate(portfolio.createdAt)}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: "var(--bg-app)" }}
          >
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--accent-purple)" }}
            >
              {stats.fundsCount}
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Total Funds
            </p>
          </div>
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: "var(--bg-app)" }}
          >
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--accent-green)" }}
            >
              {stats.sipsCount}
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Active SIPs
            </p>
          </div>
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: "var(--bg-app)" }}
          >
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--accent-blue)" }}
            >
              {stats.lumpsumCount}
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Lumpsum Entries
            </p>
          </div>
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: "var(--bg-app)" }}
          >
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {stats.earliestYear || "-"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Since Year
            </p>
          </div>
        </div>

        {/* Funds List */}
        <div className="mb-6">
          <h3
            className="font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Holdings ({portfolio.funds?.length || 0})
          </h3>
          <div className="space-y-3">
            {portfolio.funds?.map((fund, index) => (
              <div
                key={fund._id || index}
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: "var(--bg-app)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {fund.assetName}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {fund.assetType} • Started {getStartYear(fund)}
                    </p>
                  </div>
                  <span
                    className="px-2 py-1 rounded-md text-xs"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {fund.assetType}
                  </span>
                </div>

                {/* SIP Details - New format (sips array) */}
                {fund.sips &&
                  Array.isArray(fund.sips) &&
                  fund.sips.length > 0 && (
                    <div className="space-y-1.5 mb-2">
                      {fund.sips
                        .filter((s) => s.amount > 0)
                        .map((sip, sipIndex) => (
                          <div
                            key={sipIndex}
                            className="flex items-center gap-2 text-sm"
                            style={{
                              color:
                                sip.isOngoing !== false
                                  ? "var(--accent-green)"
                                  : "var(--text-secondary)",
                            }}
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>{formatSipSummary(sip)}</span>
                          </div>
                        ))}
                    </div>
                  )}

                {/* SIP Details - Old format (single sip value) */}
                {(!fund.sips || !Array.isArray(fund.sips)) &&
                  fund.sip &&
                  fund.sip > 0 && (
                    <div
                      className="flex items-center gap-1 text-sm mb-2"
                      style={{ color: "var(--accent-green)" }}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      SIP: {formatCurrency(fund.sip)}/mo
                    </div>
                  )}

                {/* Lumpsum count */}
                {fund.lumpsums?.length > 0 && (
                  <div
                    className="flex items-center gap-1 text-sm"
                    style={{ color: "var(--accent-blue)" }}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    {fund.lumpsums.length}{" "}
                    {fund.lumpsums.length === 1 ? "Lumpsum" : "Lumpsums"}
                  </div>
                )}

                {/* Show lumpsum details */}
                {fund.lumpsums?.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/5">
                    <p
                      className="text-xs mb-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Lumpsum Details:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {fund.lumpsums.map((ls, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: "var(--bg-card)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {formatMonth(ls.month)} {ls.year}:{" "}
                          {formatCurrency(ls.amount)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onViewInsights}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all hover:opacity-90"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
              color: "white",
            }}
          >
            <BarChart3 className="w-4 h-4" />
            View Insights
          </button>
          <button
            onClick={onEdit}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:bg-white/10"
            style={{
              backgroundColor: "var(--bg-app)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
