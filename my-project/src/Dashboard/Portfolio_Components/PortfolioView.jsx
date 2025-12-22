import { useLocation, useNavigate } from "react-router-dom";
import PrivateLayout from "../PrivateLayout";
import {
  Briefcase,
  TrendingUp,
  Calendar,
  DollarSign,
  ArrowLeft,
  Plus,
  AlertCircle,
} from "lucide-react";

export default function PortfolioView() {
  const location = useLocation();
  const navigate = useNavigate();

  // ═══════════════════════════════════════════════════════════════
  // GET PORTFOLIO DATA FROM NAVIGATION STATE
  // ═══════════════════════════════════════════════════════════════
  const portfolio = location.state?.portfolio;
  const successMessage = location.state?.message;

  // ═══════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMonthName = (monthNumber) => {
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
    return months[monthNumber - 1];
  };

  const formatInvestmentDate = (month, year) => {
    return `${getMonthName(month)} ${year}`;
  };

  const calculateTotalLumpsum = (lumpsums) => {
    return lumpsums.reduce((sum, lumpsum) => sum + lumpsum.amount, 0);
  };

  // ═══════════════════════════════════════════════════════════════
  // EMPTY STATE - NO PORTFOLIO DATA
  // ═══════════════════════════════════════════════════════════════
  if (!portfolio) {
    return (
      <PrivateLayout pageTitle="Portfolio">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "var(--bg-subtle)" }}
            >
              <AlertCircle
                className="w-10 h-10"
                style={{ color: "var(--text-tertiary)" }}
              />
            </div>
            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              No Portfolio Found
            </h2>
            <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
              Create your first portfolio to start tracking your investments
            </p>
            <button
              onClick={() => navigate("/dashboard/add-investment")}
              className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "var(--accent-purple)",
                color: "white",
              }}
            >
              <Plus className="w-5 h-5" />
              Create Portfolio
            </button>
          </div>
        </div>
      </PrivateLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MAIN RENDER - PORTFOLIO VIEW
  // ═══════════════════════════════════════════════════════════════
  return (
    <PrivateLayout pageTitle="Portfolio">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PORTFOLIO HEADER */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div
          className="rounded-2xl p-6 border"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
              >
                <Briefcase
                  className="w-7 h-7"
                  style={{ color: "var(--accent-purple)" }}
                />
              </div>
              <div>
                <h1
                  className="text-3xl font-bold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {portfolio.portfolioName}
                </h1>
                <div className="flex items-center gap-4 text-sm">
                  <span
                    className="flex items-center gap-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Calendar className="w-4 h-4" />
                    Created {formatDate(portfolio.createdAt)}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "var(--bg-subtle)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {portfolio.funds.length}{" "}
                    {portfolio.funds.length === 1 ? "Fund" : "Funds"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-xl flex items-center gap-2 transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "var(--bg-subtle)",
                color: "var(--text-primary)",
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div
              className="mt-4 p-4 rounded-xl flex items-center gap-3"
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                borderLeft: "4px solid var(--accent-green)",
              }}
            >
              <TrendingUp
                className="w-5 h-5"
                style={{ color: "var(--accent-green)" }}
              />
              <span
                className="font-medium"
                style={{ color: "var(--accent-green)" }}
              >
                {successMessage}
              </span>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* FUNDS GRID */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="grid gap-6">
          {portfolio.funds.map((fund, index) => (
            <div
              key={index}
              className="rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-medium)",
              }}
            >
              {/* Fund Header */}
              <div
                className="p-5 border-b"
                style={{
                  backgroundColor: "var(--bg-subtle)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: "var(--accent-purple)",
                          color: "white",
                        }}
                      >
                        {index + 1}
                      </div>
                      <h3
                        className="text-xl font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {fund.assetName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 ml-11">
                      <span
                        className="text-sm px-2.5 py-1 rounded-md font-medium"
                        style={{
                          backgroundColor: "var(--bg-card)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {fund.assetType.replace("-", " ").toUpperCase()}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Since {fund.investmentStartYear}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fund Body */}
              <div className="p-6 space-y-6">
                {/* ===== SIP SECTION (Conditional) ===== */}
                {fund.sipDetails && (
                  <div
                    className="p-5 rounded-xl border"
                    style={{
                      backgroundColor: "var(--bg-subtle)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "var(--accent-purple)" }}
                      />
                      <h4
                        className="font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        SIP Investment
                      </h4>
                      {fund.sipDetails.isOngoing && (
                        <span
                          className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: "rgba(34, 197, 94, 0.1)",
                            color: "var(--accent-green)",
                          }}
                        >
                          Ongoing
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Monthly Amount */}
                      <div
                        className="p-4 rounded-xl"
                        style={{ backgroundColor: "var(--bg-card)" }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign
                            className="w-4 h-4"
                            style={{ color: "var(--text-tertiary)" }}
                          />
                          <span
                            className="text-sm font-medium"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Monthly Amount
                          </span>
                        </div>
                        <span
                          className="text-2xl font-bold block"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {formatAmount(fund.sipDetails.amount)}
                        </span>
                      </div>

                      {/* Start Date */}
                      <div
                        className="p-4 rounded-xl"
                        style={{ backgroundColor: "var(--bg-card)" }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar
                            className="w-4 h-4"
                            style={{ color: "var(--text-tertiary)" }}
                          />
                          <span
                            className="text-sm font-medium"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Start Date
                          </span>
                        </div>
                        <span
                          className="text-lg font-semibold block"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {formatInvestmentDate(
                            fund.sipDetails.startMonth,
                            fund.sipDetails.startYear
                          )}
                        </span>
                      </div>

                      {/* End Date (if not ongoing) */}
                      {!fund.sipDetails.isOngoing &&
                        fund.sipDetails.endMonth &&
                        fund.sipDetails.endYear && (
                          <div
                            className="p-4 rounded-xl"
                            style={{ backgroundColor: "var(--bg-card)" }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar
                                className="w-4 h-4"
                                style={{ color: "var(--text-tertiary)" }}
                              />
                              <span
                                className="text-sm font-medium"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                End Date
                              </span>
                            </div>
                            <span
                              className="text-lg font-semibold block"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {formatInvestmentDate(
                                fund.sipDetails.endMonth,
                                fund.sipDetails.endYear
                              )}
                            </span>
                          </div>
                        )}

                      {/* Step-up (if exists) */}
                      {fund.sipDetails.stepUpPercentage && (
                        <div
                          className="p-4 rounded-xl"
                          style={{ backgroundColor: "var(--bg-card)" }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp
                              className="w-4 h-4"
                              style={{ color: "var(--text-tertiary)" }}
                            />
                            <span
                              className="text-sm font-medium"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              Annual Step-up
                            </span>
                          </div>
                          <span
                            className="text-lg font-semibold block"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {fund.sipDetails.stepUpPercentage}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ===== LUMPSUM SECTION (Conditional) ===== */}
                {fund.lumpsums && fund.lumpsums.length > 0 && (
                  <div
                    className="p-5 rounded-xl border"
                    style={{
                      backgroundColor: "var(--bg-subtle)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: "var(--accent-green)" }}
                        />
                        <h4
                          className="font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Lumpsum Investments
                        </h4>
                      </div>
                      <span
                        className="text-sm font-medium px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: "var(--bg-card)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {fund.lumpsums.length}{" "}
                        {fund.lumpsums.length === 1 ? "entry" : "entries"}
                      </span>
                    </div>

                    {/* Lumpsum List */}
                    <div className="space-y-3">
                      {fund.lumpsums.map((lumpsum, lumpsumIndex) => (
                        <div
                          key={lumpsumIndex}
                          className="p-4 rounded-xl flex items-center justify-between"
                          style={{
                            backgroundColor: "var(--bg-card)",
                            border: "1px solid var(--border-subtle)",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                              style={{
                                backgroundColor: "rgba(34, 197, 94, 0.1)",
                                color: "var(--accent-green)",
                              }}
                            >
                              {lumpsumIndex + 1}
                            </div>
                            <div>
                              <span
                                className="text-xl font-bold block"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {formatAmount(lumpsum.amount)}
                              </span>
                              <span
                                className="text-sm flex items-center gap-1.5"
                                style={{ color: "var(--text-tertiary)" }}
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                {formatInvestmentDate(
                                  lumpsum.month,
                                  lumpsum.year
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Lumpsum (only if multiple entries) */}
                    {fund.lumpsums.length > 1 && (
                      <div
                        className="mt-4 p-4 rounded-xl flex items-center justify-between"
                        style={{
                          backgroundColor: "var(--bg-card)",
                          borderTop: "2px solid var(--border-medium)",
                        }}
                      >
                        <span
                          className="font-semibold"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Total Lumpsum Invested
                        </span>
                        <span
                          className="text-2xl font-bold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {formatAmount(calculateTotalLumpsum(fund.lumpsums))}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* No Investment Methods */}
                {!fund.sipDetails &&
                  (!fund.lumpsums || fund.lumpsums.length === 0) && (
                    <div
                      className="p-6 rounded-xl text-center"
                      style={{
                        backgroundColor: "var(--bg-subtle)",
                        border: "2px dashed var(--border-medium)",
                      }}
                    >
                      <AlertCircle
                        className="w-10 h-10 mx-auto mb-3"
                        style={{ color: "var(--text-tertiary)" }}
                      />
                      <p
                        className="font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        No investment details added for this fund
                      </p>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ACTION BUTTONS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-center gap-4 pt-6">
          <button
            onClick={() => navigate("/dashboard/add-investment")}
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "var(--accent-purple)",
              color: "white",
            }}
          >
            <Plus className="w-5 h-5" />
            Add Another Portfolio
          </button>
        </div>
      </div>
    </PrivateLayout>
  );
}
