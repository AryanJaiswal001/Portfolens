import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivateLayout from "../PrivateLayout";
import { X, Plus, Info } from "lucide-react";

export default function ManualEntryPage() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);
  const [showOptional, setShowOptional] = useState(false);

  const [formData, setFormData] = useState({
    assetType: "",
    assetName: "",
    investmentType: "",
    amountInvested: "",
    startMonth: "",
    startYear: "",
    notes: "",
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (currentSection === 1) {
      return formData.assetType && formData.assetName.trim();
    }
    if (currentSection === 2) {
      return (
        formData.investmentType &&
        formData.amountInvested &&
        formData.startMonth &&
        formData.startYear
      );
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
    console.log("Investment added:", formData);
    // Future: Save to backend/state
    navigate("/portfolio", {
      state: { message: "Investment added successfully!" },
    });
  };

  const handleCancel = () => {
    navigate("/dashboard/add-investment");
  };

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Add Investment
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Don't worry if you don't know everything — you can always update
                later.
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
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((step) => (
              <div
                key={step}
                className="flex-1 h-1.5 rounded-full transition-all"
                style={{
                  backgroundColor:
                    currentSection >= step
                      ? "var(--accent-purple)"
                      : "var(--border-subtle)",
                }}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Section 1: Asset Basics */}
            {currentSection === 1 && (
              <div className="space-y-6">
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
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2"
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

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Asset Name{" "}
                    <span style={{ color: "var(--accent-red)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.assetName}
                    onChange={(e) => updateField("assetName", e.target.value)}
                    placeholder="e.g. SBI Bluechip Fund"
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2"
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
                    Enter the exact name as it appears in your statements
                  </p>
                </div>
              </div>
            )}

            {/* Section 2: Investment Details */}
            {currentSection === 2 && (
              <div className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Investment Type{" "}
                    <span style={{ color: "var(--accent-red)" }}>*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["SIP", "Lumpsum"].map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all"
                        style={{
                          backgroundColor:
                            formData.investmentType === type.toLowerCase()
                              ? "var(--bg-subtle)"
                              : "var(--bg-input)",
                          borderColor:
                            formData.investmentType === type.toLowerCase()
                              ? "var(--accent-purple)"
                              : "var(--border-subtle)",
                        }}
                      >
                        <input
                          type="radio"
                          name="investmentType"
                          value={type.toLowerCase()}
                          checked={
                            formData.investmentType === type.toLowerCase()
                          }
                          onChange={(e) =>
                            updateField("investmentType", e.target.value)
                          }
                          className="w-4 h-4"
                          style={{ accentColor: "var(--accent-purple)" }}
                        />
                        <span
                          className="font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Amount Invested{" "}
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
                      value={formData.amountInvested}
                      onChange={(e) =>
                        updateField("amountInvested", e.target.value)
                      }
                      placeholder="10000"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all focus:ring-2"
                      style={{
                        backgroundColor: "var(--bg-input)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-primary)",
                      }}
                      min="1"
                      required
                    />
                  </div>
                  <p
                    className="mt-2 text-sm"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Total amount invested so far
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Investment Start Date{" "}
                    <span style={{ color: "var(--accent-red)" }}>*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={formData.startMonth}
                      onChange={(e) =>
                        updateField("startMonth", e.target.value)
                      }
                      className="px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2"
                      style={{
                        backgroundColor: "var(--bg-input)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-primary)",
                      }}
                      required
                    >
                      <option value="">Month</option>
                      {[
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
                      ].map((month, idx) => (
                        <option key={month} value={idx + 1}>
                          {month}
                        </option>
                      ))}
                    </select>

                    <select
                      value={formData.startYear}
                      onChange={(e) => updateField("startYear", e.target.value)}
                      className="px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2"
                      style={{
                        backgroundColor: "var(--bg-input)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-primary)",
                      }}
                      required
                    >
                      <option value="">Year</option>
                      {Array.from(
                        { length: 30 },
                        (_, i) => new Date().getFullYear() - i
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Section Toggle */}
                <button
                  type="button"
                  onClick={() => setShowOptional(!showOptional)}
                  className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ color: "var(--accent-purple)" }}
                >
                  <Plus className="w-4 h-4" />
                  {showOptional ? "Hide" : "Add"} optional details
                </button>

                {/* Optional Fields */}
                {showOptional && (
                  <div
                    className="pt-4 border-t"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Notes{" "}
                      <span
                        className="text-sm font-normal"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      placeholder="Any additional info you want to remember"
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 resize-none"
                      style={{
                        backgroundColor: "var(--bg-input)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                )}
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
