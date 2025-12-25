import { ArrowRight } from "lucide-react";

export default function ChoiceCard_Dashboard({
  icon: Icon,
  title,
  description,
  meta,
  ctaLabel,
  onClick,
  disabled = false,
  variant = "default",
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`relative w-full text-left p-6 rounded-2xl border-2 transition-all ${
        disabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-[1.02]"
      }`}
      style={{
        backgroundColor: disabled ? "var(--bg-subtle)" : "var(--bg-card)",
        borderColor: disabled
          ? "var(--border-subtle)"
          : variant === "primary"
          ? "var(--accent-purple)"
          : "var(--border-medium)",
        opacity: disabled ? 0.6 : 1,
        boxShadow: disabled ? "none" : "var(--shadow-card)",
      }}
    >
      {/* Badge for coming soon */}
      {disabled && (
        <span
          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: "var(--bg-subtle)",
            color: "var(--text-tertiary)", // Fixed typo here
            border: "1px solid var(--border-subtle)",
          }}
        >
          Coming Soon
        </span>
      )}
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{
          backgroundColor: disabled
            ? "var(--bg-subtle)"
            : variant === "primary"
            ? "rgba(139,92,246,0.1)"
            : "var(--bg-subtle)",
        }}
      >
        <Icon
          className="w-6 h-6"
          style={{
            color: disabled
              ? "var(--text-tertiary)"
              : variant === "primary"
              ? "var(--accent-purple)"
              : "var(--text-secondary)",
          }}
        />
      </div>

      {/* Content */}
      <h3
        className="text-lg font-bold mb-2"
        style={{
          color: disabled ? "var(--text-tertiary)" : "var(--text-primary)", // Fixed variable name
        }}
      >
        {title}
      </h3>

      <p
        className="text-sm mb-4 leading-relaxed"
        style={{
          color: disabled ? "var(--text-tertiary)" : "var(--text-secondary)",
        }}
      >
        {description}
      </p>

      {/* Meta Info */}
      {meta && (
        <div
          className="flex items-center gap-2 text-xs font-medium mb-4"
          style={{
            color: disabled ? "var(--text-tertiary)" : "var(--accent-purple)",
          }}
        >
          {meta}
        </div>
      )}

      {/* CTA */}
      <div
        className="flex items-center justify-between pt-4 border-t"
        style={{
          borderColor: disabled
            ? "var(--border-subtle)"
            : "var(--border-medium)",
        }}
      >
        <span
          className="font-medium"
          style={{
            color: disabled ? "var(--text-tertiary)" : "var(--text-primary)",
          }}
        >
          {ctaLabel}
        </span>
        {!disabled && (
          <ArrowRight
            className="w-5 h-5 transition-transform group-hover:translate-x-1"
            style={{ color: "var(--accent-purple)" }}
          />
        )}
      </div>
    </button>
  );
}
