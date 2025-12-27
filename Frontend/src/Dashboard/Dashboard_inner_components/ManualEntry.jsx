import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivateLayout from "../PrivateLayout";
import { createPortfolio } from "../../service/portfolioService";

export default function ManualEntryPage() {
  const navigate = useNavigate();

  // Form state
  const [portfolioName, setPortfolioName] = useState("My Portfolio");
  const [funds, setFunds] = useState([
    {
      id: Date.now(),
      assetType: "Mutual Fund",
      assetName: "",
      investmentStartYear: new Date().getFullYear(),
      sip: "",
      lumpsums: [],
    },
  ]);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Asset type options
  const assetTypes = [
    "Mutual Fund",
    "Stock",
    "ETF",
    "Bond",
    "FD",
    "Gold",
    "Real Estate",
    "Other",
  ];

  // Generate year options (last 35 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

  // Add new fund
  const addFund = () => {
    setFunds([
      ...funds,
      {
        id: Date.now(),
        assetType: "Mutual Fund",
        assetName: "",
        investmentStartYear: currentYear,
        sip: "",
        lumpsums: [],
      },
    ]);
  };

  // Remove fund
  const removeFund = (id) => {
    if (funds.length > 1) {
      setFunds(funds.filter((fund) => fund.id !== id));
    }
  };

  // Update fund field
  const updateFund = (id, field, value) => {
    setFunds(
      funds.map((fund) => (fund.id === id ? { ...fund, [field]: value } : fund))
    );
    // Clear error when user makes changes
    if (error) setError("");
  };

  // Add lumpsum to fund
  const addLumpsum = (fundId) => {
    setFunds(
      funds.map((fund) =>
        fund.id === fundId
          ? {
              ...fund,
              lumpsums: [
                ...fund.lumpsums,
                { id: Date.now(), year: currentYear, amount: "" },
              ],
            }
          : fund
      )
    );
  };

  // Remove lumpsum from fund
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

  // Update lumpsum
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

  // Validate form
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
      if (!fund.investmentStartYear) {
        setError(`Fund ${i + 1}: Investment start year is required`);
        return false;
      }
      // Check if at least SIP or one lumpsum is provided
      const hasSIP = fund.sip && parseFloat(fund.sip) > 0;
      const hasLumpsum = fund.lumpsums.some(
        (l) => l.amount && parseFloat(l.amount) > 0
      );
      if (!hasSIP && !hasLumpsum) {
        setError(
          `Fund ${
            i + 1
          }: Please enter either SIP or at least one lumpsum amount`
        );
        return false;
      }
    }

    return true;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API (remove client-side IDs)
      const portfolioData = {
        name: portfolioName.trim(),
        funds: funds.map((fund) => ({
          assetType: fund.assetType,
          assetName: fund.assetName.trim(),
          investmentStartYear: parseInt(fund.investmentStartYear),
          sip: fund.sip ? parseFloat(fund.sip) : null,
          lumpsums: fund.lumpsums
            .filter((l) => l.amount && parseFloat(l.amount) > 0)
            .map((l) => ({
              year: parseInt(l.year),
              amount: parseFloat(l.amount),
            })),
        })),
      };

      // Send to backend
      await createPortfolio(portfolioData);

      setSuccess("Portfolio saved successfully!");

      // Redirect to portfolio page after short delay
      setTimeout(() => {
        navigate("/portfolio");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to save portfolio. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PrivateLayout pageTitle="Manual Entry">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard/add-investment")}
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
            Back
          </button>

          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Manual Entry
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Add your investments manually
          </p>
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
          {funds.map((fund, index) => (
            <div
              key={fund.id}
              className="p-6 rounded-xl mb-4"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Fund {index + 1}
                </h3>
                {funds.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFund(fund.id)}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Asset Type */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Asset Type
                  </label>
                  <select
                    value={fund.assetType}
                    onChange={(e) =>
                      updateFund(fund.id, "assetType", e.target.value)
                    }
                    className="w-full p-3 rounded-xl outline-none"
                    style={{
                      backgroundColor: "var(--bg-app)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {assetTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Asset Name */}
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
                    onChange={(e) =>
                      updateFund(fund.id, "assetName", e.target.value)
                    }
                    placeholder="e.g., HDFC Flexi Cap Fund"
                    className="w-full p-3 rounded-xl outline-none"
                    style={{
                      backgroundColor: "var(--bg-app)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                {/* Start Year */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Investment Start Year
                  </label>
                  <select
                    value={fund.investmentStartYear}
                    onChange={(e) =>
                      updateFund(fund.id, "investmentStartYear", e.target.value)
                    }
                    className="w-full p-3 rounded-xl outline-none"
                    style={{
                      backgroundColor: "var(--bg-app)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SIP Amount */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Monthly SIP (₹)
                  </label>
                  <input
                    type="number"
                    value={fund.sip}
                    onChange={(e) => updateFund(fund.id, "sip", e.target.value)}
                    placeholder="e.g., 5000"
                    min="0"
                    className="w-full p-3 rounded-xl outline-none"
                    style={{
                      backgroundColor: "var(--bg-app)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              </div>

              {/* Lumpsums */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label
                    className="text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Lumpsum Investments
                  </label>
                  <button
                    type="button"
                    onClick={() => addLumpsum(fund.id)}
                    className="text-sm hover:opacity-80"
                    style={{ color: "var(--accent-purple)" }}
                  >
                    + Add Lumpsum
                  </button>
                </div>

                {fund.lumpsums.map((lumpsum) => (
                  <div key={lumpsum.id} className="flex gap-4 mb-2">
                    <select
                      value={lumpsum.year}
                      onChange={(e) =>
                        updateLumpsum(
                          fund.id,
                          lumpsum.id,
                          "year",
                          e.target.value
                        )
                      }
                      className="w-32 p-2 rounded-lg outline-none text-sm"
                      style={{
                        backgroundColor: "var(--bg-app)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={lumpsum.amount}
                      onChange={(e) =>
                        updateLumpsum(
                          fund.id,
                          lumpsum.id,
                          "amount",
                          e.target.value
                        )
                      }
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
                      onClick={() => removeLumpsum(fund.id, lumpsum.id)}
                      className="text-red-500 hover:text-red-400 px-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Add Fund Button */}
          <button
            type="button"
            onClick={addFund}
            className="w-full p-4 rounded-xl border-2 border-dashed mb-6 hover:opacity-80"
            style={{
              borderColor: "var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            + Add Another Fund
          </button>

          {/* Submit Button */}
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
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
              {isSubmitting ? "Saving..." : "Save Portfolio"}
            </button>
          </div>
        </form>
      </div>
    </PrivateLayout>
  );
}
