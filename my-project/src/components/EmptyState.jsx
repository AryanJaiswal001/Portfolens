import { useNavigate } from "react-router-dom";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  navigateTo,
  secondaryActionLabel,
  onSecondaryAction,
}) {
  const navigate = useNavigate();

  const handleAction = () => {
    // If navigateTo is provided, navigate first
    if (navigateTo) {
      navigate(navigateTo);
    }

    // Then call onAction if provided
    if (onAction) {
      onAction();
    }
  };


  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div
        className="max-w-md w-full rounded-2xl border p-12 text-center"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Icon Container */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: "var(--gradient-bg)",
              border: "2px solid var(--border-subtle)",
            }}
          >
            <Icon
              className="w-10 h-10"
              style={{ color: "var(--accent-purple)" }}
            />
          </div>
        </div>

        {/* Title */}
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h2>

        {/* Description */}
        <p
          className="text-base leading-relaxed mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          {description}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary Action */}
          <button
            onClick={handleAction}
            className="w-full py-3 rounded-lg font-semibold transition-transform hover:scale-105"
            style={{
              background: "var(--bg-button-primary)",
              color: "var(--text-inverse)",
              boxShadow: "var(--shadow-button)",
            }}
          >
            {actionLabel}
          </button>

          {/* Secondary Action (Optional) */}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="w-full py-3 rounded-lg font-semibold transition-transform hover:scale-105"
              style={{
                backgroundColor: "var(--bg-button-secondary)",
                color: "var(--text-primary)",
                border: "2px solid var(--border-medium)",
              }}
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>

        {/* Helpful Tip */}
        <p className="text-sm mt-6" style={{ color: "var(--text-tertiary)" }}>
          You can also import portfolios from CSV or connect via API later
        </p>
      </div>
    </div>
  );
}
