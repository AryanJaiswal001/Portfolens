import { useNavigate } from "react-router-dom";
import PrivateLayout from "../PrivateLayout";
import ChoiceCard_Dashboard from "../../components/ChoiceCard_Dashboard";
import { Edit3, Upload, FileText, ChevronLeft } from "lucide-react";

export default function SelectMethod() {
  const navigate = useNavigate();

  const importMethods = [
    {
      icon: Edit3,
      title: "Add investments manually",
      description:
        "Enter your investments one by one. Best for smaller or focused portfolios.",
      meta: "Recommended for first-time users",
      ctaLabel: "Add Manually",
      variant: "primary",
      onClick: () => navigate("/dashboard/add-investment/manual"),
    },
    {
      icon: Upload,
      title: "Upload CSV / Excel",
      description: "Upload a file exported from your broker or investment app.",
      meta: "Faster · Bulk import",
      ctaLabel: "Upload File",
      onClick: () => navigate("/dashboard/add-investment/upload"),
    },
    {
      icon: FileText,
      title: "Import CAS Statement",
      description:
        "Automatically import your investments using CAS statements.",
      meta: "Coming soon",
      ctaLabel: "Coming Soon",
      disabled: true,
    },
  ];

  return (
    <PrivateLayout pageTitle="Add Investment">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Add Your Investment
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Choose how you'd like to add your investments.
          </p>
        </div>

        {/* Choice Cards */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {importMethods.map((method, index) => (
            <ChoiceCard_Dashboard key={index} {...method} />
          ))}
        </div>

        {/* Helper Text */}
        <div
          className="mt-8 p-4 rounded-xl"
          style={{
            backgroundColor: "var(--bg-subtle)",
            borderLeft: "3px solid var(--accent-purple)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            💡{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              New to PortfoLens?
            </strong>{" "}
            We recommend starting with manual entry to understand how the
            platform works.
          </p>
        </div>
      </div>
    </PrivateLayout>
  );
}
