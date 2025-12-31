import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PrivateLayout from "../PrivateLayout";
import {
  createPortfolio,
  getPortfolioById,
  updatePortfolio,
} from "../../service/portfolioService";
import { Plus, Trash2, Info, ChevronDown, ChevronUp } from "lucide-react";

/**
 * ManualEntry Page
 *
 * Supports multiple SIPs per fund with:
 * - isOngoing toggle
 * - startMonth/startYear
 * - endMonth/endYear (when not ongoing)
 */

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

// NAV data availability constants
// ⚠️ NAV data is only available for Jan 2024 - Dec 2024
const NAV_START_YEAR = 2024;
const NAV_START_MONTH = 1;
const NAV_END_YEAR = 2024;
const NAV_END_MONTH = 12;

// Restrict years to NAV data range
const ALLOWED_YEARS = [2024];
const currentYear = new Date().getFullYear();

const ASSET_TYPES = [
  "Mutual Fund",
  "Stock",
  "ETF",
  "Bond",
  "FD",
  "Gold",
  "Real Estate",
  "Other",
];

export default function ManualEntryPage() {
  const navigate = useNavigate();
  const { id: portfolioId } = useParams();
  const isEditMode = Boolean(portfolioId);

  // Form state
  const [portfolioName, setPortfolioName] = useState("My Portfolio");
  const [funds, setFunds] = useState([createEmptyFund()]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expandedFunds, setExpandedFunds] = useState({});

  // Create empty fund
  function createEmptyFund() {
    return {
      id: Date.now(),
      assetType: "Mutual Fund",
      assetName: "",
      sips: [createEmptySip()],
      lumpsums: [],
    };
  }

  // Create empty SIP entry - default to NAV start date
  function createEmptySip() {
    return {
      id: Date.now(),
      amount: "",
      startMonth: NAV_START_MONTH,
      startYear: NAV_START_YEAR,
      isOngoing: true,
      endMonth: null,
      endYear: null,
    };
  }

  // Create empty lumpsum entry - default to NAV start date
  function createEmptyLumpsum() {
    return {
      id: Date.now(),
      amount: "",
      month: NAV_START_MONTH,
      year: NAV_START_YEAR,
    };
  }

  // Fetch existing portfolio when editing
  useEffect(() => {
    if (isEditMode) {
      fetchPortfolio();
    }
  }, [portfolioId]);

  const fetchPortfolio = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await getPortfolioById(portfolioId);
      const portfolio = response.data.portfolio;

      setPortfolioName(portfolio.name);

      // Transform backend data to form state
      const transformedFunds = portfolio.funds.map((fund, index) => ({
        id: Date.now() + index,
        assetType: fund.assetType,
        assetName: fund.assetName,
        sips:
          fund.sips && fund.sips.length > 0
            ? fund.sips.map((sip, sipIndex) => ({
                id: Date.now() + index * 1000 + sipIndex,
                amount: sip.amount?.toString() || "",
                startMonth: sip.startMonth || 1,
                startYear: sip.startYear || currentYear,
                isOngoing: sip.isOngoing !== false,
                endMonth: sip.endMonth || null,
                endYear: sip.endYear || null,
              }))
            : [createEmptySip()],
        lumpsums:
          fund.lumpsums?.map((l, lIndex) => ({
            id: Date.now() + index * 10000 + lIndex,
            amount: l.amount?.toString() || "",
            month: l.month || 1,
            year: l.year || currentYear,
          })) || [],
      }));

      setFunds(transformedFunds);
    } catch (err) {
      setError(err.message || "Failed to load portfolio");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle fund expanded state
  const toggleFundExpanded = (fundId) => {
    setExpandedFunds((prev) => ({
      ...prev,
      [fundId]: !prev[fundId],
    }));
  };

  // Add new fund
  const addFund = () => {
    const newFund = createEmptyFund();
    setFunds([...funds, newFund]);
    setExpandedFunds((prev) => ({ ...prev, [newFund.id]: true }));
  };

  // Remove fund
  const removeFund = (fundId) => {
    if (funds.length > 1) {
      setFunds(funds.filter((f) => f.id !== fundId));
    }
  };

  // Update fund field
  const updateFund = (fundId, field, value) => {
    setFunds(
      funds.map((fund) =>
        fund.id === fundId ? { ...fund, [field]: value } : fund
      )
    );
    if (error) setError("");
  };

  // ═══════════════════════════════════════════════════════════════
  // SIP OPERATIONS
  // ═══════════════════════════════════════════════════════════════
  const addSip = (fundId) => {
    setFunds(
      funds.map((fund) =>
        fund.id === fundId
          ? { ...fund, sips: [...fund.sips, createEmptySip()] }
          : fund
      )
    );
  };

  const removeSip = (fundId, sipId) => {
    setFunds(
      funds.map((fund) =>
        fund.id === fundId
          ? { ...fund, sips: fund.sips.filter((s) => s.id !== sipId) }
          : fund
      )
    );
  };

  const updateSip = (fundId, sipId, field, value) => {
    setFunds(
      funds.map((fund) =>
        fund.id === fundId
          ? {
              ...fund,
              sips: fund.sips.map((sip) =>
                sip.id === sipId ? { ...sip, [field]: value } : sip
              ),
            }
          : fund
      )
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // LUMPSUM OPERATIONS
  // ═══════════════════════════════════════════════════════════════
  const addLumpsum = (fundId) => {
    setFunds(
      funds.map((fund) =>
        fund.id === fundId
          ? { ...fund, lumpsums: [...fund.lumpsums, createEmptyLumpsum()] }
          : fund
      )
    );
  };

  const removeLumpsum = (fundId, lumpsumId) => {
    setFunds(
      funds.map((fund) =>
        fund.id === fundId
          ? {
              ...fund,
              lumpsums: fund.lumpsums.filter((l) => l.id !== lumpsumId),
            }
          : fund
      )
    );
  };

  const updateLumpsum = (fundId, lumpsumId, field, value) => {
    setFunds(
      funds.map((fund) =>
        fund.id === fundId
          ? {
              ...fund,
              lumpsums: fund.lumpsums.map((l) =>
                l.id === lumpsumId ? { ...l, [field]: value } : l
              ),
            }
          : fund
      )
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // VALIDATION
  // ═══════════════════════════════════════════════════════════════
  const validateForm = () => {
    if (!portfolioName.trim()) {
      setError("Portfolio name is required");
      return false;
    }

    for (let i = 0; i < funds.length; i++) {
      const fund = funds[i];

      if (!fund.assetName.trim()) {
        setError(`Fund ${i + 1}: Asset name is required`);
        return false;
      }

      // Validate SIPs - allow SIP-only OR Lumpsum-only portfolios
      const validSips = fund.sips.filter(
        (s) => s.amount && parseFloat(s.amount) > 0
      );
      const validLumpsums = fund.lumpsums.filter(
        (l) => l.amount && parseFloat(l.amount) > 0
      );

      // ✅ SIP-only: allowed
      // ✅ Lumpsum-only: allowed
      // ❌ Neither: invalid
      if (validSips.length === 0 && validLumpsums.length === 0) {
        setError(
          `Fund ${
            i + 1
          } must have either SIP or lumpsum investment with amount > 0`
        );
        return false;
      }

      // Validate SIP entries
      for (let j = 0; j < validSips.length; j++) {
        const sip = validSips[j];

        if (!sip.startMonth || !sip.startYear) {
          setError(
            `Fund ${i + 1}, SIP ${j + 1}: Start month and year are required`
          );
          return false;
        }

        // Validate date is within NAV range
        if (sip.startYear < NAV_START_YEAR || sip.startYear > NAV_END_YEAR) {
          setError(
            `Fund ${i + 1}, SIP ${
              j + 1
            }: Start year must be ${NAV_START_YEAR} (NAV data range)`
          );
          return false;
        }

        if (!sip.isOngoing) {
          if (!sip.endMonth || !sip.endYear) {
            setError(
              `Fund ${i + 1}, SIP ${
                j + 1
              }: End month and year are required for stopped SIPs`
            );
            return false;
          }

          // Validate end is within NAV range
          if (sip.endYear < NAV_START_YEAR || sip.endYear > NAV_END_YEAR) {
            setError(
              `Fund ${i + 1}, SIP ${
                j + 1
              }: End year must be ${NAV_END_YEAR} (NAV data range)`
            );
            return false;
          }

          // Validate end > start
          const startDate = new Date(sip.startYear, sip.startMonth - 1);
          const endDate = new Date(sip.endYear, sip.endMonth - 1);
          if (endDate <= startDate) {
            setError(
              `Fund ${i + 1}, SIP ${j + 1}: End date must be after start date`
            );
            return false;
          }
        }
      }

      // Validate Lumpsum entries - check date range
      for (let j = 0; j < validLumpsums.length; j++) {
        const lumpsum = validLumpsums[j];

        if (lumpsum.year < NAV_START_YEAR || lumpsum.year > NAV_END_YEAR) {
          setError(
            `Fund ${i + 1}, Lumpsum ${
              j + 1
            }: Investment year must be ${NAV_START_YEAR} (NAV data range)`
          );
          return false;
        }
      }
    }

    return true;
  };

  // ═══════════════════════════════════════════════════════════════
  // SUBMIT
  // ═══════════════════════════════════════════════════════════════
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Transform to API format
      const portfolioData = {
        name: portfolioName.trim(),
        funds: funds.map((fund) => ({
          assetType: fund.assetType,
          assetName: fund.assetName.trim(),
          sips: fund.sips
            .filter((s) => s.amount && parseFloat(s.amount) > 0)
            .map((s) => ({
              amount: parseFloat(s.amount),
              startMonth: parseInt(s.startMonth),
              startYear: parseInt(s.startYear),
              isOngoing: s.isOngoing,
              ...(s.isOngoing
                ? {}
                : {
                    endMonth: parseInt(s.endMonth),
                    endYear: parseInt(s.endYear),
                  }),
            })),
          lumpsums: fund.lumpsums
            .filter((l) => l.amount && parseFloat(l.amount) > 0)
            .map((l) => ({
              amount: parseFloat(l.amount),
              month: parseInt(l.month),
              year: parseInt(l.year),
            })),
        })),
      };

      if (isEditMode) {
        await updatePortfolio(portfolioId, portfolioData);
        setSuccess("Portfolio updated successfully!");
      } else {
        await createPortfolio(portfolioData);
        setSuccess("Portfolio saved successfully!");
      }

      setTimeout(() => navigate("/portfolio"), 1500);
    } catch (err) {
      setError(
        err.message || `Failed to ${isEditMode ? "update" : "save"} portfolio`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <PrivateLayout pageTitle={isEditMode ? "Edit Portfolio" : "Manual Entry"}>
      <div className="max-w-3xl mx-auto">
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
              Loading portfolio...
            </p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() =>
                  navigate(
                    isEditMode ? "/portfolio" : "/dashboard/add-investment"
                  )
                }
                className="flex items-center gap-2 mb-4 text-sm hover:opacity-80"
                style={{ color: "var(--text-secondary)" }}
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {isEditMode ? "Back to Portfolios" : "Back"}
              </button>

              <h1
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {isEditMode ? "Edit Portfolio" : "Manual Entry"}
              </h1>
              <p style={{ color: "var(--text-secondary)" }}>
                {isEditMode
                  ? "Update your portfolio details"
                  : "Add your investments manually"}
              </p>
            </div>

            {/* NAV Data Info Banner */}
            <div
              className="mb-6 p-4 rounded-xl flex items-start gap-3"
              style={{
                backgroundColor: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
              }}
            >
              <Info
                className="w-5 h-5 shrink-0 mt-0.5"
                style={{ color: "var(--accent-purple)" }}
              />
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Demo Mode - FY 2024-25
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Insights are generated using simulated NAV data for Jan 2024 –
                  Dec 2024. Select investment dates within this range for
                  accurate analysis.
                </p>
              </div>
            </div>

            {/* Messages */}
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
              </div>
            )}

            {success && (
              <div
                className="mb-6 p-4 rounded-xl"
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  color: "#22c55e",
                }}
              >
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Portfolio Name */}
              <div
                className="p-6 rounded-xl mb-6"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Portfolio Name
                </label>
                <input
                  type="text"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder="e.g., My Retirement Fund"
                  className="w-full p-3 rounded-xl outline-none"
                  style={{
                    backgroundColor: "var(--bg-app)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {/* Funds */}
              {funds.map((fund, fundIndex) => (
                <FundCard
                  key={fund.id}
                  fund={fund}
                  fundIndex={fundIndex}
                  fundsCount={funds.length}
                  expanded={expandedFunds[fund.id] !== false}
                  onToggleExpand={() => toggleFundExpanded(fund.id)}
                  onUpdateFund={(field, value) =>
                    updateFund(fund.id, field, value)
                  }
                  onRemoveFund={() => removeFund(fund.id)}
                  onAddSip={() => addSip(fund.id)}
                  onRemoveSip={(sipId) => removeSip(fund.id, sipId)}
                  onUpdateSip={(sipId, field, value) =>
                    updateSip(fund.id, sipId, field, value)
                  }
                  onAddLumpsum={() => addLumpsum(fund.id)}
                  onRemoveLumpsum={(lumpsumId) =>
                    removeLumpsum(fund.id, lumpsumId)
                  }
                  onUpdateLumpsum={(lumpsumId, field, value) =>
                    updateLumpsum(fund.id, lumpsumId, field, value)
                  }
                />
              ))}

              {/* Add Fund Button */}
              <button
                type="button"
                onClick={addFund}
                className="w-full p-4 rounded-xl border-2 border-dashed mb-6 hover:opacity-80 flex items-center justify-center gap-2"
                style={{
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-secondary)",
                }}
              >
                <Plus className="w-5 h-5" />
                Add Another Fund
              </button>

              {/* Submit Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() =>
                    navigate(isEditMode ? "/portfolio" : "/dashboard")
                  }
                  className="px-6 py-3 rounded-xl"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl font-semibold disabled:opacity-50"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
                    color: "white",
                  }}
                >
                  {isSubmitting
                    ? isEditMode
                      ? "Updating..."
                      : "Saving..."
                    : isEditMode
                    ? "Update Portfolio"
                    : "Save Portfolio"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </PrivateLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// FUND CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
function FundCard({
  fund,
  fundIndex,
  fundsCount,
  expanded,
  onToggleExpand,
  onUpdateFund,
  onRemoveFund,
  onAddSip,
  onRemoveSip,
  onUpdateSip,
  onAddLumpsum,
  onRemoveLumpsum,
  onUpdateLumpsum,
}) {
  return (
    <div
      className="rounded-xl mb-4 overflow-hidden"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {/* Fund Header */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer"
        style={{
          borderBottom: expanded ? "1px solid var(--border-subtle)" : "none",
        }}
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold"
            style={{ backgroundColor: "var(--accent-purple)", color: "white" }}
          >
            {fundIndex + 1}
          </div>
          <div>
            <h3
              className="font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {fund.assetName || `Fund ${fundIndex + 1}`}
            </h3>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {
                fund.sips.filter((s) => s.amount && parseFloat(s.amount) > 0)
                  .length
              }{" "}
              SIP(s) •{" "}
              {
                fund.lumpsums.filter(
                  (l) => l.amount && parseFloat(l.amount) > 0
                ).length
              }{" "}
              Lumpsum(s)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {fundsCount > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFund();
              }}
              className="p-2 rounded-lg text-red-500 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {expanded ? (
            <ChevronUp
              className="w-5 h-5"
              style={{ color: "var(--text-tertiary)" }}
            />
          ) : (
            <ChevronDown
              className="w-5 h-5"
              style={{ color: "var(--text-tertiary)" }}
            />
          )}
        </div>
      </div>

      {/* Fund Content */}
      {expanded && (
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Asset Type
              </label>
              <select
                value={fund.assetType}
                onChange={(e) => onUpdateFund("assetType", e.target.value)}
                className="w-full p-3 rounded-xl outline-none"
                style={{
                  backgroundColor: "var(--bg-app)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                }}
              >
                {ASSET_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Asset Name
              </label>
              <input
                type="text"
                value={fund.assetName}
                onChange={(e) => onUpdateFund("assetName", e.target.value)}
                placeholder="e.g., HDFC Flexi Cap Fund"
                className="w-full p-3 rounded-xl outline-none"
                style={{
                  backgroundColor: "var(--bg-app)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>

          {/* SIP Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <label
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  SIP Investments
                </label>
                <div className="group relative">
                  <Info
                    className="w-4 h-4"
                    style={{ color: "var(--text-tertiary)" }}
                  />
                  <div
                    className="absolute left-0 bottom-full mb-2 w-64 p-3 rounded-lg text-xs hidden group-hover:block z-10"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-secondary)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    You can add multiple SIPs for the same fund if you paused or
                    restarted investments.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onAddSip}
                className="text-sm hover:opacity-80 flex items-center gap-1"
                style={{ color: "var(--accent-purple)" }}
              >
                <Plus className="w-4 h-4" />
                Add SIP
              </button>
            </div>

            <div className="space-y-3">
              {fund.sips.map((sip, sipIndex) => (
                <SipEntry
                  key={sip.id}
                  sip={sip}
                  sipIndex={sipIndex}
                  sipsCount={fund.sips.length}
                  onUpdate={(field, value) => onUpdateSip(sip.id, field, value)}
                  onRemove={() => onRemoveSip(sip.id)}
                />
              ))}
            </div>
          </div>

          {/* Lumpsum Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Lumpsum Investments
              </label>
              <button
                type="button"
                onClick={onAddLumpsum}
                className="text-sm hover:opacity-80 flex items-center gap-1"
                style={{ color: "var(--accent-purple)" }}
              >
                <Plus className="w-4 h-4" />
                Add Lumpsum
              </button>
            </div>

            {fund.lumpsums.length === 0 ? (
              <p
                className="text-sm py-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                No lumpsum investments added
              </p>
            ) : (
              <div className="space-y-2">
                {fund.lumpsums.map((lumpsum) => (
                  <LumpsumEntry
                    key={lumpsum.id}
                    lumpsum={lumpsum}
                    onUpdate={(field, value) =>
                      onUpdateLumpsum(lumpsum.id, field, value)
                    }
                    onRemove={() => onRemoveLumpsum(lumpsum.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SIP ENTRY COMPONENT
// ═══════════════════════════════════════════════════════════════
function SipEntry({ sip, sipIndex, sipsCount, onUpdate, onRemove }) {
  return (
    <div
      className="p-4 rounded-lg"
      style={{
        backgroundColor: "var(--bg-app)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-tertiary)" }}
        >
          SIP #{sipIndex + 1}
        </span>
        {sipsCount > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-400 text-xs"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        {/* Amount */}
        <div>
          <label
            className="block text-xs mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Monthly Amount (₹)
          </label>
          <input
            type="number"
            value={sip.amount}
            onChange={(e) => onUpdate("amount", e.target.value)}
            placeholder="5000"
            min="0"
            className="w-full p-2 rounded-lg outline-none text-sm"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* Start Month */}
        <div>
          <label
            className="block text-xs mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Start Month
          </label>
          <select
            value={sip.startMonth}
            onChange={(e) => onUpdate("startMonth", parseInt(e.target.value))}
            className="w-full p-2 rounded-lg outline-none text-sm"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Start Year */}
        <div>
          <label
            className="block text-xs mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Start Year
          </label>
          <select
            value={sip.startYear}
            onChange={(e) => onUpdate("startYear", parseInt(e.target.value))}
            className="w-full p-2 rounded-lg outline-none text-sm"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          >
            {ALLOWED_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ongoing Toggle */}
      <div className="flex items-center gap-3 mb-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={sip.isOngoing}
            onChange={(e) => onUpdate("isOngoing", e.target.checked)}
            className="sr-only peer"
          />
          <div
            className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
            style={{
              backgroundColor: sip.isOngoing
                ? "var(--accent-purple)"
                : "var(--border-medium)",
            }}
          />
        </label>
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Ongoing SIP
        </span>
      </div>

      {/* Helper Text - clarify ongoing evaluation till NAV cutoff */}
      {sip.isOngoing && (
        <p className="text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>
          💡 Ongoing SIPs are evaluated till Dec 2024 (simulated NAV data
          cutoff).
        </p>
      )}

      {/* End Date (when not ongoing) */}
      {!sip.isOngoing && (
        <div
          className="grid grid-cols-2 gap-3 mt-3 pt-3"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <div>
            <label
              className="block text-xs mb-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              End Month
            </label>
            <select
              value={sip.endMonth || ""}
              onChange={(e) => onUpdate("endMonth", parseInt(e.target.value))}
              className="w-full p-2 rounded-lg outline-none text-sm"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
              }}
            >
              <option value="">Select</option>
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="block text-xs mb-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              End Year
            </label>
            <select
              value={sip.endYear || ""}
              onChange={(e) => onUpdate("endYear", parseInt(e.target.value))}
              className="w-full p-2 rounded-lg outline-none text-sm"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
              }}
            >
              <option value="">Select</option>
              {ALLOWED_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LUMPSUM ENTRY COMPONENT
// ═══════════════════════════════════════════════════════════════
function LumpsumEntry({ lumpsum, onUpdate, onRemove }) {
  return (
    <div className="flex gap-3 items-center">
      <select
        value={lumpsum.month}
        onChange={(e) => onUpdate("month", parseInt(e.target.value))}
        className="w-28 p-2 rounded-lg outline-none text-sm"
        style={{
          backgroundColor: "var(--bg-app)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-primary)",
        }}
      >
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label.slice(0, 3)}
          </option>
        ))}
      </select>
      <select
        value={lumpsum.year}
        onChange={(e) => onUpdate("year", parseInt(e.target.value))}
        className="w-24 p-2 rounded-lg outline-none text-sm"
        style={{
          backgroundColor: "var(--bg-app)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-primary)",
        }}
      >
        {ALLOWED_YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={lumpsum.amount}
        onChange={(e) => onUpdate("amount", e.target.value)}
        placeholder="Amount (₹)"
        min="0"
        className="flex-1 p-2 rounded-lg outline-none text-sm"
        style={{
          backgroundColor: "var(--bg-app)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-primary)",
        }}
      />
      <button
        type="button"
        onClick={onRemove}
        className="text-red-500 hover:text-red-400 p-2"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
