import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../../context/PortfolioContext";
import { PlusCircle, FlaskConical } from "lucide-react";

const ReportEmptyState = ({ icon: Icon, title, description }) => {
  const navigate = useNavigate();
  const { loadSamplePortfolio } = usePortfolio();

  const handleAddPortfolio = () => {
    navigate("/dashboard/add-investment");
  };

  const handleSamplePortfolio = () => {
    loadSamplePortfolio();
    navigate("/insights");
  };

  return (
    <div
      className="rounded-2xl p-12 text-center"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Icon */}
      <div
        className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)",
          border: "1px solid var(--accent-purple)",
        }}
      >
        {Icon && (
          <Icon className="w-8 h-8" style={{ color: "var(--accent-purple)" }} />
        )}
      </div>

      {/* Title */}
      <h3
        className="text-xl font-semibold mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="max-w-md mx-auto mb-8"
        style={{ color: "var(--text-secondary)" }}
      >
        {description}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Add Portfolio Button */}
        <button
          onClick={handleAddPortfolio}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:opacity-90"
          style={{
            background: "var(--bg-button-primary)",
            color: "var(--text-inverse)",
            boxShadow: "var(--shadow-button)",
          }}
        >
          <PlusCircle className="w-5 h-5" />
          Add Portfolio
        </button>

        {/* Try Sample Portfolio Button */}
        <button
          onClick={handleSamplePortfolio}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
          style={{
            background: "transparent",
            color: "var(--accent-purple)",
            border: "2px solid var(--accent-purple)",
          }}
        >
          <FlaskConical className="w-5 h-5" />
          Try Sample Portfolio
        </button>
      </div>
    </div>
  );
};

export default ReportEmptyState;
