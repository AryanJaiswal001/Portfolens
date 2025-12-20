import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivateLayout from "../PrivateLayout";
import { X, Plus, Info, ChevronDown, ChevronUp } from "lucide-react";

export default function ManualEntryPage() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [formData, setFormData] = useState({
    // Asset Details
    assetType: "",
    assetName: "",
    investmentStartYear: "",

    // Investment Method Selection (multi-select)
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

    // Optional
    notes: "",
  });

  // Lumpsum investments as array (supports multiple one-time investments)
  const [lumpsums, setLumpsums] = useState([
    { amount: "", month: "", year: "" },
  ]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleInvestmentMethod = (method) => {
    if (method === "sip") {
      updateField("hasSIP", !formData.hasSIP);
    } else {
      updateField("hasLumpsum", !formData.hasLumpsum);
    }
  };

  // Lumpsum array management
  const addLumpsum = () => {
    setLumpsums([...lumpsums, { amount: "", month: "", year: "" }]);
  };

  const removeLumpsum = (index) => {
    if (lumpsums.length > 1) {
      setLumpsums(lumpsums.filter((_, i) => i !== index));
    }
  };

  const updateLumpsum = (index, field, value) => {
    const updated = lumpsums.map((lumpsum, i) =>
      i === index ? { ...lumpsum, [field]: value } : lumpsum
    );
    setLumpsums(updated);
  };

  const canProceed = () => {
    if (currentSection === 1) {
      return (
        formData.assetType &&
        formData.assetName.trim() &&
        formData.investmentStartYear
      );
    }
    if (currentSection === 2) {
      // At least one method must be selected
      if (!formData.hasSIP && !formData.hasLumpsum) return false;

      // Validate SIP if selected
      if (formData.hasSIP) {
        if (
          !formData.sipAmount ||
          !formData.sipStartMonth ||
          !formData.sipStartYear
        ) {
          return false;
        }
      }

      // Validate Lumpsum entries if selected
      if (formData.hasLumpsum) {
        // Check that all lumpsum entries have required fields
        const allLumpsumsValid = lumpsums.every(
          (lumpsum) => lumpsum.amount && lumpsum.month && lumpsum.year
        );
        if (!allLumpsumsValid) {
          return false;
        }
      }

      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (currentSection < 2) setCurrentSection(currentSection + 1);
  };

  const handleBack = () => {
    if (currentSection > 1) setCurrentSection(currentSection - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      lumpsums: formData.hasLumpsum ? lumpsums : [],
    };
    console.log("Investment added:", submissionData);
    navigate("/portfolio", {
      state: { message: "Investment added successfully!" },
    });
  };

  const handleCancel = () => {
    navigate("/dashboard/add-investment");
  };

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

  return (
    <PrivateLayout pageTitle="Manual Entry">
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      >
        <div
          className="w-full max-w-2xl rounded-2xl p-8 relative max-h-[90vh] overflow-y-auto"
          style={{
            backgroundColor: "var(--bg-card)",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Add Investment
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Approximate dates are fine — you can always update later.
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

          {/* Progress Indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[
              { step: 1, label: "Asset Details" },
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
            {/* ========== SECTION 1: Asset Details ========== */}
            {currentSection === 1 && (
              <div className="space-y-6">
                {/* Asset Type */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Asset Type{" "}
                    <span style={{ color: "var(--accent-red)" }}>*</span>
                  </label>
                  <select
                    value={formData.assetType}
                    onChange={(e) => updateField("assetType", e.target.value)}
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
                    <span style={{ color: "var(--accent-red)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.assetName}
                    onChange={(e) => updateField("assetName", e.target.value)}
                    placeholder="e.g. SBI Bluechip Fund, Reliance Industries"
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
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
                    Enter the name as it appears in your statements
                  </p>
                </div>

                {/* Investment Start Year */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    When did you start investing?{" "}
                    <span style={{ color: "var(--accent-red)" }}>*</span>
                  </label>
                  <select
                    value={formData.investmentStartYear}
                    onChange={(e) =>
                      updateField("investmentStartYear", e.target.value)
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
                  <p
                    className="mt-2 text-sm"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Approximate year is fine
                  </p>
                </div>
              </div>
            )}

            {/* ========== SECTION 2: Investment Details ========== */}
            {currentSection === 2 && (
              <div className="space-y-6">
                {/* Investment Method Selection */}
                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    How do you invest in this asset?{" "}
                    <span style={{ color: "var(--accent-red)" }}>*</span>
                  </label>
                  <p
                    className="text-sm mb-4"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Select all that apply — many investors do both SIP and
                    Lumpsum
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {/* SIP Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleInvestmentMethod("sip")}
                      className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left"
                      style={{
                        backgroundColor: formData.hasSIP
                          ? "var(--bg-subtle)"
                          : "var(--bg-input)",
                        borderColor: formData.hasSIP
                          ? "var(--accent-purple)"
                          : "var(--border-subtle)",
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                        style={{
                          borderColor: formData.hasSIP
                            ? "var(--accent-purple)"
                            : "var(--border-medium)",
                          backgroundColor: formData.hasSIP
                            ? "var(--accent-purple)"
                            : "transparent",
                        }}
                      >
                        {formData.hasSIP && (
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
                      onClick={() => toggleInvestmentMethod("lumpsum")}
                      className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left"
                      style={{
                        backgroundColor: formData.hasLumpsum
                          ? "var(--bg-subtle)"
                          : "var(--bg-input)",
                        borderColor: formData.hasLumpsum
                          ? "var(--accent-purple)"
                          : "var(--border-subtle)",
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                        style={{
                          borderColor: formData.hasLumpsum
                            ? "var(--accent-purple)"
                            : "var(--border-medium)",
                          backgroundColor: formData.hasLumpsum
                            ? "var(--accent-purple)"
                            : "transparent",
                        }}
                      >
                        {formData.hasLumpsum && (
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
                          One-time investment
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* ===== SIP SECTION (Conditional) ===== */}
                {formData.hasSIP && (
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
                        style={{ backgroundColor: "var(--accent-purple)" }}
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
                          <span style={{ color: "var(--accent-red)" }}>*</span>
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
                            value={formData.sipAmount}
                            onChange={(e) =>
                              updateField("sipAmount", e.target.value)
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
                          <span style={{ color: "var(--accent-red)" }}>*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={formData.sipStartMonth}
                            onChange={(e) =>
                              updateField("sipStartMonth", e.target.value)
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
                            value={formData.sipStartYear}
                            onChange={(e) =>
                              updateField("sipStartYear", e.target.value)
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
                            updateField("sipOngoing", !formData.sipOngoing)
                          }
                          className="relative w-12 h-6 rounded-full transition-all"
                          style={{
                            backgroundColor: formData.sipOngoing
                              ? "var(--accent-purple)"
                              : "var(--border-medium)",
                          }}
                        >
                          <span
                            className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                            style={{
                              left: formData.sipOngoing
                                ? "calc(100% - 20px)"
                                : "4px",
                            }}
                          />
                        </button>
                      </div>

                      {/* SIP End Date (conditional) */}
                      {!formData.sipOngoing && (
                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--text-primary)" }}
                          >
                            SIP End Date
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <select
                              value={formData.sipEndMonth}
                              onChange={(e) =>
                                updateField("sipEndMonth", e.target.value)
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
                              value={formData.sipEndYear}
                              onChange={(e) =>
                                updateField("sipEndYear", e.target.value)
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
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
                        style={{ color: "var(--accent-purple)" }}
                      >
                        {showAdvanced ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        {showAdvanced ? "Hide" : "Show"} advanced options
                      </button>

                      {showAdvanced && (
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
                              value={formData.stepUpPercentage}
                              onChange={(e) =>
                                updateField("stepUpPercentage", e.target.value)
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
                {formData.hasLumpsum && (
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
                          style={{ backgroundColor: "var(--accent-green)" }}
                        />
                        Lumpsum Investments
                      </h4>
                      <p
                        className="text-sm mt-1"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Add one or more one-time investments for this asset
                      </p>
                    </div>

                    <div className="space-y-4">
                      {lumpsums.map((lumpsum, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl border"
                          style={{
                            backgroundColor: "var(--bg-card)",
                            borderColor: "var(--border-medium)",
                          }}
                        >
                          {/* Header with entry number and remove button */}
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className="text-sm font-medium"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              Lumpsum #{index + 1}
                            </span>
                            {lumpsums.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLumpsum(index)}
                                className="p-1.5 rounded-lg hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: "var(--bg-subtle)" }}
                                title="Remove this entry"
                              >
                                <X
                                  className="w-4 h-4"
                                  style={{ color: "var(--text-tertiary)" }}
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
                                value={lumpsum.amount}
                                onChange={(e) =>
                                  updateLumpsum(index, "amount", e.target.value)
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
                              <span style={{ color: "var(--accent-red)" }}>
                                *
                              </span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <select
                                value={lumpsum.month}
                                onChange={(e) =>
                                  updateLumpsum(index, "month", e.target.value)
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
                                  updateLumpsum(index, "year", e.target.value)
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

                      {/* Add Another Lumpsum Button */}
                      <button
                        type="button"
                        onClick={addLumpsum}
                        className="w-full py-3 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all hover:opacity-80"
                        style={{
                          borderColor: "var(--border-medium)",
                          color: "var(--accent-purple)",
                        }}
                      >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Add another lumpsum</span>
                      </button>

                      <p
                        className="text-sm text-center"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Many investors make multiple lumpsum investments over
                        time
                      </p>
                    </div>
                  </div>
                )}

                {/* Optional Notes */}
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      updateField("showNotes", !formData.showNotes)
                    }
                    className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
                    style={{ color: "var(--accent-purple)" }}
                  >
                    <Plus className="w-4 h-4" />
                    Add notes (optional)
                  </button>

                  {formData.showNotes && (
                    <div className="mt-4">
                      <textarea
                        value={formData.notes}
                        onChange={(e) => updateField("notes", e.target.value)}
                        placeholder="Any additional info you want to remember about this investment"
                        rows="3"
                        className="w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none"
                        style={{
                          backgroundColor: "var(--bg-input)",
                          borderColor: "var(--border-subtle)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
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
                  className="px-6 py-2.5 rounded-xl font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--accent-purple)",
                    color: "white",
                  }}
                >
                  Add Investment
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </PrivateLayout>
  );
}
