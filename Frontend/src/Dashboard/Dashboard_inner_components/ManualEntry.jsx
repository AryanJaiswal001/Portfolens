import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivateLayout from "../PrivateLayout";
import {
  X,
  Plus,
  Info,
  ChevronDown,
  ChevronUp,
  Trash2,
  Briefcase,
  TrendingUp,
} from "lucide-react";

export default function ManualEntryPage() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);

  // ═══════════════════════════════════════════════════════════════
  // PORTFOLIO-LEVEL STATE
  // ═══════════════════════════════════════════════════════════════
  const [portfolioName, setPortfolioName] = useState("");

  // ═══════════════════════════════════════════════════════════════
  // FUNDS ARRAY - Each fund has its own SIP + Lumpsums
  // ═══════════════════════════════════════════════════════════════
  const [funds, setFunds] = useState([
    {
      id: Date.now(),
      assetType: "",
      assetName: "",
      investmentStartYear: "",
      hasSIP: false,
      hasLumpsum: false,
      // SIP Details
      sipAmount: "",
      sipStartMonth: "",
      sipStartYear: "",
      sipEndMonth: "",
      sipEndYear: "",
      sipOngoing: true,
      stepUpPercentage: "",
      showAdvanced: false,
      // Lumpsum Entries (array)
      lumpsums: [{ amount: "", month: "", year: "" }],
      // UI State
      isCollapsed: false,
    },
  ]);

  // ═══════════════════════════════════════════════════════════════
  // FUND MANAGEMENT FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  const addFund = () => {
    setFunds([
      ...funds,
      {
        id: Date.now(),
        assetType: "",
        assetName: "",
        investmentStartYear: "",
        hasSIP: false,
        hasLumpsum: false,
        sipAmount: "",
        sipStartMonth: "",
        sipStartYear: "",
        sipEndMonth: "",
        sipEndYear: "",
        sipOngoing: true,
        stepUpPercentage: "",
        showAdvanced: false,
        lumpsums: [{ amount: "", month: "", year: "" }],
        isCollapsed: false,
      },
    ]);
  };

  const removeFund = (fundId) => {
    if (funds.length > 1) {
      setFunds(funds.filter((fund) => fund.id !== fundId));
    }
  };

  const updateFund = (fundId, field, value) => {
    setFunds(
      funds.map((fund) =>
        fund.id === fundId ? { ...fund, [field]: value } : fund
      )
    );
  };

  const toggleFundCollapse = (fundId) => {
    setFunds(
      funds.map((fund) =>
        fund.id === fundId ? { ...fund, isCollapsed: !fund.isCollapsed } : fund
      )
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // LUMPSUM MANAGEMENT (PER FUND)
  // ═══════════════════════════════════════════════════════════════
  const addLumpsum = (fundId) => {
    setFunds(
      funds.map((fund) =>
        fund.id === fundId
          ? {
              ...fund,
              lumpsums: [...fund.lumpsums, { amount: "", month: "", year: "" }],
            }
          : fund
      )
    );
  };

  const removeLumpsum = (fundId, lumpsumIndex) => {
    setFunds(
      funds.map((fund) => {
        if (fund.id === fundId && fund.lumpsums.length > 1) {
          return {
            ...fund,
            lumpsums: fund.lumpsums.filter((_, i) => i !== lumpsumIndex),
          };
        }
        return fund;
      })
    );
  };

  const updateLumpsum = (fundId, lumpsumIndex, field, value) => {
    setFunds(
      funds.map((fund) => {
        if (fund.id === fundId) {
          const updatedLumpsums = fund.lumpsums.map((lumpsum, i) =>
            i === lumpsumIndex ? { ...lumpsum, [field]: value } : lumpsum
          );
          return { ...fund, lumpsums: updatedLumpsums };
        }
        return fund;
      })
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // VALIDATION
  // ═══════════════════════════════════════════════════════════════
  const canProceed = () => {
    if (currentSection === 1) {
      // Portfolio name required
      if (!portfolioName.trim()) return false;

      // At least one fund with basic details
      return funds.every(
        (fund) =>
          fund.assetType && fund.assetName.trim() && fund.investmentStartYear
      );
    }

    if (currentSection === 2) {
      return funds.every((fund) => {
        // At least one investment method per fund
        if (!fund.hasSIP && !fund.hasLumpsum) return false;

        // Validate SIP if enabled
        if (fund.hasSIP) {
          if (!fund.sipAmount || !fund.sipStartMonth || !fund.sipStartYear) {
            return false;
          }
        }

        // Validate all lumpsums if enabled
        if (fund.hasLumpsum) {
          const allLumpsumsValid = fund.lumpsums.every(
            (lumpsum) => lumpsum.amount && lumpsum.month && lumpsum.year
          );
          if (!allLumpsumsValid) return false;
        }

        return true;
      });
    }

    return true;
  };

  // ═══════════════════════════════════════════════════════════════
  // NAVIGATION & SUBMISSION
  // ═══════════════════════════════════════════════════════════════
  const handleNext = () => {
    if (currentSection < 2) setCurrentSection(currentSection + 1);
  };

  const handleBack = () => {
    if (currentSection > 1) setCurrentSection(currentSection - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build portfolio data structure
    const portfolioData = {
      portfolioName: portfolioName.trim(),
      createdAt: new Date().toISOString(),
      funds: funds.map((fund) => ({
        assetType: fund.assetType,
        assetName: fund.assetName,
        investmentStartYear: fund.investmentStartYear,
        sipDetails: fund.hasSIP
          ? {
              amount: parseFloat(fund.sipAmount),
              startMonth: parseInt(fund.sipStartMonth),
              startYear: parseInt(fund.sipStartYear),
              endMonth: fund.sipOngoing ? null : parseInt(fund.sipEndMonth),
              endYear: fund.sipOngoing ? null : parseInt(fund.sipEndYear),
              isOngoing: fund.sipOngoing,
              stepUpPercentage: fund.stepUpPercentage
                ? parseFloat(fund.stepUpPercentage)
                : null,
            }
          : null,
        lumpsums: fund.hasLumpsum
          ? fund.lumpsums.map((l) => ({
              amount: parseFloat(l.amount),
              month: parseInt(l.month),
              year: parseInt(l.year),
            }))
          : [],
      })),
    };

    console.log("Portfolio created:", portfolioData);

    // Navigate to portfolio with success state
    navigate("/portfolio", {
      state: {
        message: "Portfolio added successfully! 🎉",
        portfolio: portfolioData,
      },
    });
  };

  const handleCancel = () => {
    navigate("/dashboard/add-investment");
  };

  // ═══════════════════════════════════════════════════════════════
  // CONSTANTS
  // ═══════════════════════════════════════════════════════════════
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 30 },
    (_, i) => new Date().getFullYear() - i
  );

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <PrivateLayout pageTitle="Create Portfolio">
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      >
        <div
          className="w-full max-w-3xl rounded-2xl p-8 relative max-h-[90vh] overflow-y-auto"
          style={{
            backgroundColor: "var(--bg-card)",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* HEADER */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-2xl font-bold mb-2 flex items-center gap-3"
                style={{ color: "var(--text-primary)" }}
              >
                <Briefcase
                  className="w-7 h-7"
                  style={{ color: "var(--accent-purple)" }}
                />
                Create Portfolio
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Build your investment portfolio with multiple funds
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: "var(--bg-subtle)" }}
            >
              <X
                className="w-5 h-5"
                style={{ color: "var(--text-secondary)" }}
              />
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PROGRESS INDICATOR */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="flex items-center gap-3 mb-8">
            {[
              { step: 1, label: "Portfolio & Funds" },
              { step: 2, label: "Investment Details" },
            ].map(({ step, label }) => (
              <div key={step} className="flex items-center gap-2 flex-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    backgroundColor:
                      currentSection >= step
                        ? "var(--accent-purple)"
                        : "var(--bg-subtle)",
                    color:
                      currentSection >= step ? "white" : "var(--text-tertiary)",
                  }}
                >
                  {step}
                </div>
                <span
                  className="text-sm font-medium hidden sm:block"
                  style={{
                    color:
                      currentSection >= step
                        ? "var(--text-primary)"
                        : "var(--text-tertiary)",
                  }}
                >
                  {label}
                </span>
                {step < 2 && (
                  <div
                    className="flex-1 h-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        currentSection > step
                          ? "var(--accent-purple)"
                          : "var(--border-subtle)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* SECTION 1: Portfolio & Fund Details */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentSection === 1 && (
              <div className="space-y-6">
                {/* Portfolio Name */}
                <div
                  className="p-5 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-subtle)",
                    borderColor: "var(--accent-purple)",
                    borderWidth: "2px",
                  }}
                >
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Portfolio Name{" "}
                    <span style={{ color: "var(--accent-red)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={portfolioName}
                    onChange={(e) => setPortfolioName(e.target.value)}
                    placeholder='e.g. "Long Term Wealth", "Retirement Fund", "Kids Education"'
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-lg"
                    style={{
                      backgroundColor: "var(--bg-input)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                    required
                  />
                  <p
                    className="mt-2 text-sm flex items-center gap-1.5"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    <Info className="w-4 h-4" />
                    Give your portfolio a meaningful name for easy tracking
                  </p>
                </div>

                {/* Funds List */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Funds in this Portfolio
                    </h3>
                    <span
                      className="text-sm px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: "var(--bg-subtle)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {funds.length} {funds.length === 1 ? "fund" : "funds"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {funds.map((fund, index) => (
                      <div
                        key={fund.id}
                        className="p-5 rounded-xl border"
                        style={{
                          backgroundColor: "var(--bg-card)",
                          borderColor: "var(--border-medium)",
                        }}
                      >
                        {/* Fund Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                              style={{
                                backgroundColor: "var(--accent-purple)",
                                color: "white",
                              }}
                            >
                              {index + 1}
                            </div>
                            <span
                              className="font-medium"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {fund.assetName || `Fund ${index + 1}`}
                            </span>
                          </div>
                          {funds.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFund(fund.id)}
                              className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                              style={{ backgroundColor: "var(--bg-subtle)" }}
                              title="Remove fund"
                            >
                              <Trash2
                                className="w-4 h-4"
                                style={{ color: "var(--accent-red)" }}
                              />
                            </button>
                          )}
                        </div>

                        {/* Fund Fields */}
                        <div className="space-y-4">
                          {/* Asset Type */}
                          <div>
                            <label
                              className="block text-sm font-medium mb-2"
                              style={{ color: "var(--text-primary)" }}
                            >
                              Asset Type{" "}
                              <span style={{ color: "var(--accent-red)" }}>
                                *
                              </span>
                            </label>
                            <select
                              value={fund.assetType}
                              onChange={(e) =>
                                updateFund(fund.id, "assetType", e.target.value)
                              }
                              className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
                              style={{
                                backgroundColor: "var(--bg-input)",
                                borderColor: "var(--border-subtle)",
                                color: "var(--text-primary)",
                              }}
                              required
                            >
                              <option value="">Select asset type</option>
                              <option value="mutual-fund">Mutual Fund</option>
                              <option value="stock">Stock</option>
                              <option value="etf">ETF</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          {/* Asset Name */}
                          <div>
                            <label
                              className="block text-sm font-medium mb-2"
                              style={{ color: "var(--text-primary)" }}
                            >
                              Fund / Asset Name{" "}
                              <span style={{ color: "var(--accent-red)" }}>
                                *
                              </span>
                            </label>
                            <input
                              type="text"
                              value={fund.assetName}
                              onChange={(e) =>
                                updateFund(fund.id, "assetName", e.target.value)
                              }
                              placeholder="e.g. SBI Bluechip Fund, HDFC Top 100"
                              className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
                              style={{
                                backgroundColor: "var(--bg-input)",
                                borderColor: "var(--border-subtle)",
                                color: "var(--text-primary)",
                              }}
                              required
                            />
                          </div>

                          {/* Investment Start Year */}
                          <div>
                            <label
                              className="block text-sm font-medium mb-2"
                              style={{ color: "var(--text-primary)" }}
                            >
                              When did you start investing?{" "}
                              <span style={{ color: "var(--accent-red)" }}>
                                *
                              </span>
                            </label>
                            <select
                              value={fund.investmentStartYear}
                              onChange={(e) =>
                                updateFund(
                                  fund.id,
                                  "investmentStartYear",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
                              style={{
                                backgroundColor: "var(--bg-input)",
                                borderColor: "var(--border-subtle)",
                                color: "var(--text-primary)",
                              }}
                              required
                            >
                              <option value="">Select year</option>
                              {years.map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Another Fund Button */}
                    <button
                      type="button"
                      onClick={addFund}
                      className="w-full py-4 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all hover:opacity-80"
                      style={{
                        borderColor: "var(--accent-purple)",
                        color: "var(--accent-purple)",
                        backgroundColor: "transparent",
                      }}
                    >
                      <Plus className="w-5 h-5" />
                      <span className="font-semibold">Add Another Fund</span>
                    </button>

                    <p
                      className="text-sm text-center"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Add all the funds you want in this portfolio
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* SECTION 2: Investment Details (Per Fund) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentSection === 2 && (
              <div className="space-y-6">
                {/* Portfolio Summary */}
                <div
                  className="p-4 rounded-xl flex items-center gap-3"
                  style={{
                    backgroundColor: "var(--bg-subtle)",
                    borderLeft: "4px solid var(--accent-purple)",
                  }}
                >
                  <Briefcase
                    className="w-5 h-5"
                    style={{ color: "var(--accent-purple)" }}
                  />
                  <div>
                    <span
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {portfolioName}
                    </span>
                    <span
                      className="text-sm ml-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      — {funds.length} {funds.length === 1 ? "fund" : "funds"}
                    </span>
                  </div>
                </div>

                {/* Fund Investment Details */}
                {funds.map((fund, fundIndex) => (
                  <div
                    key={fund.id}
                    className="rounded-xl border overflow-hidden"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border-medium)",
                    }}
                  >
                    {/* Fund Header (Collapsible) */}
                    <button
                      type="button"
                      onClick={() => toggleFundCollapse(fund.id)}
                      className="w-full p-4 flex items-center justify-between text-left"
                      style={{
                        backgroundColor: "var(--bg-subtle)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                          style={{
                            backgroundColor: "var(--accent-purple)",
                            color: "white",
                          }}
                        >
                          {fundIndex + 1}
                        </div>
                        <div>
                          <span
                            className="font-semibold block"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {fund.assetName}
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            {fund.assetType.replace("-", " ").toUpperCase()} •
                            Since {fund.investmentStartYear}
                          </span>
                        </div>
                      </div>
                      {fund.isCollapsed ? (
                        <ChevronDown
                          className="w-5 h-5"
                          style={{ color: "var(--text-secondary)" }}
                        />
                      ) : (
                        <ChevronUp
                          className="w-5 h-5"
                          style={{ color: "var(--text-secondary)" }}
                        />
                      )}
                    </button>

                    {/* Fund Details (Expandable) */}
                    {!fund.isCollapsed && (
                      <div className="p-5 space-y-6">
                        {/* Investment Method Selection */}
                        <div>
                          <label
                            className="block text-sm font-medium mb-3"
                            style={{ color: "var(--text-primary)" }}
                          >
                            How do you invest in {fund.assetName || "this fund"}
                            ?{" "}
                            <span style={{ color: "var(--accent-red)" }}>
                              *
                            </span>
                          </label>
                          <p
                            className="text-sm mb-4"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            Select all that apply
                          </p>

                          <div className="grid grid-cols-2 gap-3">
                            {/* SIP Toggle */}
                            <button
                              type="button"
                              onClick={() =>
                                updateFund(fund.id, "hasSIP", !fund.hasSIP)
                              }
                              className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left"
                              style={{
                                backgroundColor: fund.hasSIP
                                  ? "var(--bg-subtle)"
                                  : "var(--bg-input)",
                                borderColor: fund.hasSIP
                                  ? "var(--accent-purple)"
                                  : "var(--border-subtle)",
                              }}
                            >
                              <div
                                className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                                style={{
                                  borderColor: fund.hasSIP
                                    ? "var(--accent-purple)"
                                    : "var(--border-medium)",
                                  backgroundColor: fund.hasSIP
                                    ? "var(--accent-purple)"
                                    : "transparent",
                                }}
                              >
                                {fund.hasSIP && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <span
                                  className="font-semibold block"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  SIP
                                </span>
                                <span
                                  className="text-xs"
                                  style={{ color: "var(--text-tertiary)" }}
                                >
                                  Monthly investment
                                </span>
                              </div>
                            </button>

                            {/* Lumpsum Toggle */}
                            <button
                              type="button"
                              onClick={() =>
                                updateFund(
                                  fund.id,
                                  "hasLumpsum",
                                  !fund.hasLumpsum
                                )
                              }
                              className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left"
                              style={{
                                backgroundColor: fund.hasLumpsum
                                  ? "var(--bg-subtle)"
                                  : "var(--bg-input)",
                                borderColor: fund.hasLumpsum
                                  ? "var(--accent-purple)"
                                  : "var(--border-subtle)",
                              }}
                            >
                              <div
                                className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                                style={{
                                  borderColor: fund.hasLumpsum
                                    ? "var(--accent-purple)"
                                    : "var(--border-medium)",
                                  backgroundColor: fund.hasLumpsum
                                    ? "var(--accent-purple)"
                                    : "transparent",
                                }}
                              >
                                {fund.hasLumpsum && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <span
                                  className="font-semibold block"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  Lumpsum
                                </span>
                                <span
                                  className="text-xs"
                                  style={{ color: "var(--text-tertiary)" }}
                                >
                                  One-time investments
                                </span>
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* ===== SIP SECTION (Conditional) ===== */}
                        {fund.hasSIP && (
                          <div
                            className="p-5 rounded-xl border"
                            style={{
                              backgroundColor: "var(--bg-subtle)",
                              borderColor: "var(--border-subtle)",
                            }}
                          >
                            <h4
                              className="font-semibold mb-4 flex items-center gap-2"
                              style={{ color: "var(--text-primary)" }}
                            >
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor: "var(--accent-purple)",
                                }}
                              />
                              SIP Details
                            </h4>

                            <div className="space-y-4">
                              {/* Monthly SIP Amount */}
                              <div>
                                <label
                                  className="block text-sm font-medium mb-2"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  Monthly SIP Amount{" "}
                                  <span style={{ color: "var(--accent-red)" }}>
                                    *
                                  </span>
                                </label>
                                <div className="relative">
                                  <span
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium"
                                    style={{ color: "var(--text-secondary)" }}
                                  >
                                    ₹
                                  </span>
                                  <input
                                    type="number"
                                    value={fund.sipAmount}
                                    onChange={(e) =>
                                      updateFund(
                                        fund.id,
                                        "sipAmount",
                                        e.target.value
                                      )
                                    }
                                    placeholder="5000"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all"
                                    style={{
                                      backgroundColor: "var(--bg-input)",
                                      borderColor: "var(--border-subtle)",
                                      color: "var(--text-primary)",
                                    }}
                                    min="1"
                                  />
                                </div>
                              </div>

                              {/* SIP Start Date */}
                              <div>
                                <label
                                  className="block text-sm font-medium mb-2"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  SIP Start Date{" "}
                                  <span style={{ color: "var(--accent-red)" }}>
                                    *
                                  </span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                  <select
                                    value={fund.sipStartMonth}
                                    onChange={(e) =>
                                      updateFund(
                                        fund.id,
                                        "sipStartMonth",
                                        e.target.value
                                      )
                                    }
                                    className="px-4 py-3 rounded-xl border outline-none transition-all"
                                    style={{
                                      backgroundColor: "var(--bg-input)",
                                      borderColor: "var(--border-subtle)",
                                      color: "var(--text-primary)",
                                    }}
                                  >
                                    <option value="">Month</option>
                                    {months.map((month, idx) => (
                                      <option key={month} value={idx + 1}>
                                        {month}
                                      </option>
                                    ))}
                                  </select>
                                  <select
                                    value={fund.sipStartYear}
                                    onChange={(e) =>
                                      updateFund(
                                        fund.id,
                                        "sipStartYear",
                                        e.target.value
                                      )
                                    }
                                    className="px-4 py-3 rounded-xl border outline-none transition-all"
                                    style={{
                                      backgroundColor: "var(--bg-input)",
                                      borderColor: "var(--border-subtle)",
                                      color: "var(--text-primary)",
                                    }}
                                  >
                                    <option value="">Year</option>
                                    {years.map((year) => (
                                      <option key={year} value={year}>
                                        {year}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {/* SIP Status Toggle */}
                              <div className="flex items-center justify-between">
                                <span
                                  className="text-sm font-medium"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  SIP is ongoing
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateFund(
                                      fund.id,
                                      "sipOngoing",
                                      !fund.sipOngoing
                                    )
                                  }
                                  className="relative w-12 h-6 rounded-full transition-all"
                                  style={{
                                    backgroundColor: fund.sipOngoing
                                      ? "var(--accent-purple)"
                                      : "var(--border-medium)",
                                  }}
                                >
                                  <span
                                    className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                                    style={{
                                      left: fund.sipOngoing
                                        ? "calc(100% - 20px)"
                                        : "4px",
                                    }}
                                  />
                                </button>
                              </div>

                              {/* SIP End Date (conditional) */}
                              {!fund.sipOngoing && (
                                <div>
                                  <label
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: "var(--text-primary)" }}
                                  >
                                    SIP End Date
                                  </label>
                                  <div className="grid grid-cols-2 gap-3">
                                    <select
                                      value={fund.sipEndMonth}
                                      onChange={(e) =>
                                        updateFund(
                                          fund.id,
                                          "sipEndMonth",
                                          e.target.value
                                        )
                                      }
                                      className="px-4 py-3 rounded-xl border outline-none transition-all"
                                      style={{
                                        backgroundColor: "var(--bg-input)",
                                        borderColor: "var(--border-subtle)",
                                        color: "var(--text-primary)",
                                      }}
                                    >
                                      <option value="">Month</option>
                                      {months.map((month, idx) => (
                                        <option key={month} value={idx + 1}>
                                          {month}
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      value={fund.sipEndYear}
                                      onChange={(e) =>
                                        updateFund(
                                          fund.id,
                                          "sipEndYear",
                                          e.target.value
                                        )
                                      }
                                      className="px-4 py-3 rounded-xl border outline-none transition-all"
                                      style={{
                                        backgroundColor: "var(--bg-input)",
                                        borderColor: "var(--border-subtle)",
                                        color: "var(--text-primary)",
                                      }}
                                    >
                                      <option value="">Year</option>
                                      {years.map((year) => (
                                        <option key={year} value={year}>
                                          {year}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              )}

                              {/* Advanced: Step-up */}
                              <button
                                type="button"
                                onClick={() =>
                                  updateFund(
                                    fund.id,
                                    "showAdvanced",
                                    !fund.showAdvanced
                                  )
                                }
                                className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
                                style={{ color: "var(--accent-purple)" }}
                              >
                                {fund.showAdvanced ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                                {fund.showAdvanced ? "Hide" : "Show"} advanced
                                options
                              </button>

                              {fund.showAdvanced && (
                                <div>
                                  <label
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: "var(--text-primary)" }}
                                  >
                                    Annual Step-up{" "}
                                    <span
                                      className="font-normal"
                                      style={{ color: "var(--text-tertiary)" }}
                                    >
                                      (Optional)
                                    </span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="number"
                                      value={fund.stepUpPercentage}
                                      onChange={(e) =>
                                        updateFund(
                                          fund.id,
                                          "stepUpPercentage",
                                          e.target.value
                                        )
                                      }
                                      placeholder="10"
                                      className="w-full px-4 py-3 pr-10 rounded-xl border outline-none transition-all"
                                      style={{
                                        backgroundColor: "var(--bg-input)",
                                        borderColor: "var(--border-subtle)",
                                        color: "var(--text-primary)",
                                      }}
                                      min="0"
                                      max="100"
                                    />
                                    <span
                                      className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-medium"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      %
                                    </span>
                                  </div>
                                  <p
                                    className="mt-2 text-sm"
                                    style={{ color: "var(--text-tertiary)" }}
                                  >
                                    Yearly increase in SIP amount
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* ===== LUMPSUM SECTION (Conditional) ===== */}
                        {fund.hasLumpsum && (
                          <div
                            className="p-5 rounded-xl border"
                            style={{
                              backgroundColor: "var(--bg-subtle)",
                              borderColor: "var(--border-subtle)",
                            }}
                          >
                            <div className="mb-4">
                              <h4
                                className="font-semibold flex items-center gap-2"
                                style={{ color: "var(--text-primary)" }}
                              >
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{
                                    backgroundColor: "var(--accent-green)",
                                  }}
                                />
                                Lumpsum Investments
                              </h4>
                              <p
                                className="text-sm mt-1"
                                style={{ color: "var(--text-tertiary)" }}
                              >
                                Add one or more one-time investments
                              </p>
                            </div>

                            <div className="space-y-4">
                              {fund.lumpsums.map((lumpsum, lumpsumIndex) => (
                                <div
                                  key={lumpsumIndex}
                                  className="p-4 rounded-xl border"
                                  style={{
                                    backgroundColor: "var(--bg-card)",
                                    borderColor: "var(--border-medium)",
                                  }}
                                >
                                  {/* Lumpsum Header */}
                                  <div className="flex items-center justify-between mb-3">
                                    <span
                                      className="text-sm font-medium"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      Lumpsum #{lumpsumIndex + 1}
                                    </span>
                                    {fund.lumpsums.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeLumpsum(fund.id, lumpsumIndex)
                                        }
                                        className="p-1.5 rounded-lg hover:opacity-80 transition-opacity"
                                        style={{
                                          backgroundColor: "var(--bg-subtle)",
                                        }}
                                        title="Remove this entry"
                                      >
                                        <X
                                          className="w-4 h-4"
                                          style={{
                                            color: "var(--text-tertiary)",
                                          }}
                                        />
                                      </button>
                                    )}
                                  </div>

                                  {/* Lumpsum Amount */}
                                  <div className="mb-3">
                                    <label
                                      className="block text-sm font-medium mb-2"
                                      style={{ color: "var(--text-primary)" }}
                                    >
                                      Amount{" "}
                                      <span
                                        style={{ color: "var(--accent-red)" }}
                                      >
                                        *
                                      </span>
                                    </label>
                                    <div className="relative">
                                      <span
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium"
                                        style={{
                                          color: "var(--text-secondary)",
                                        }}
                                      >
                                        ₹
                                      </span>
                                      <input
                                        type="number"
                                        value={lumpsum.amount}
                                        onChange={(e) =>
                                          updateLumpsum(
                                            fund.id,
                                            lumpsumIndex,
                                            "amount",
                                            e.target.value
                                          )
                                        }
                                        placeholder="100000"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all"
                                        style={{
                                          backgroundColor: "var(--bg-input)",
                                          borderColor: "var(--border-subtle)",
                                          color: "var(--text-primary)",
                                        }}
                                        min="1"
                                      />
                                    </div>
                                  </div>

                                  {/* Lumpsum Date */}
                                  <div>
                                    <label
                                      className="block text-sm font-medium mb-2"
                                      style={{ color: "var(--text-primary)" }}
                                    >
                                      Investment Date{" "}
                                      <span
                                        style={{ color: "var(--accent-red)" }}
                                      >
                                        *
                                      </span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                      <select
                                        value={lumpsum.month}
                                        onChange={(e) =>
                                          updateLumpsum(
                                            fund.id,
                                            lumpsumIndex,
                                            "month",
                                            e.target.value
                                          )
                                        }
                                        className="px-4 py-3 rounded-xl border outline-none transition-all"
                                        style={{
                                          backgroundColor: "var(--bg-input)",
                                          borderColor: "var(--border-subtle)",
                                          color: "var(--text-primary)",
                                        }}
                                      >
                                        <option value="">Month</option>
                                        {months.map((month, idx) => (
                                          <option key={month} value={idx + 1}>
                                            {month}
                                          </option>
                                        ))}
                                      </select>
                                      <select
                                        value={lumpsum.year}
                                        onChange={(e) =>
                                          updateLumpsum(
                                            fund.id,
                                            lumpsumIndex,
                                            "year",
                                            e.target.value
                                          )
                                        }
                                        className="px-4 py-3 rounded-xl border outline-none transition-all"
                                        style={{
                                          backgroundColor: "var(--bg-input)",
                                          borderColor: "var(--border-subtle)",
                                          color: "var(--text-primary)",
                                        }}
                                      >
                                        <option value="">Year</option>
                                        {years.map((year) => (
                                          <option key={year} value={year}>
                                            {year}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {/* Add Another Lumpsum */}
                              <button
                                type="button"
                                onClick={() => addLumpsum(fund.id)}
                                className="w-full py-3 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all hover:opacity-80"
                                style={{
                                  borderColor: "var(--border-medium)",
                                  color: "var(--accent-purple)",
                                }}
                              >
                                <Plus className="w-5 h-5" />
                                <span className="font-medium">
                                  Add another lumpsum
                                </span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* NAVIGATION BUTTONS */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div
              className="flex items-center justify-between mt-8 pt-6 border-t"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <button
                type="button"
                onClick={currentSection === 1 ? handleCancel : handleBack}
                className="px-6 py-2.5 rounded-xl font-medium transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: "var(--bg-subtle)",
                  color: "var(--text-primary)",
                }}
              >
                {currentSection === 1 ? "Cancel" : "Back"}
              </button>

              {currentSection < 2 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="px-6 py-2.5 rounded-xl font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--accent-purple)",
                    color: "white",
                  }}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canProceed()}
                  className="px-8 py-3 rounded-xl font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{
                    backgroundColor: "var(--accent-purple)",
                    color: "white",
                  }}
                >
                  <TrendingUp className="w-5 h-5" />
                  Create Portfolio
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </PrivateLayout>
  );
}
