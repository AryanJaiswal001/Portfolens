import { AlertTriangle, FlaskConical, Info } from "lucide-react";

/**
 * Demo Disclaimer Banner
 *
 * MANDATORY: Shows when isDemoMode === true
 * Must appear at the top of Insights and Reports pages
 */
export default function DemoDisclaimer({ disclaimer, dataAsOf, navPeriod }) {
  if (!disclaimer) return null;

  return (
    <div
      className="mb-6 rounded-xl overflow-hidden"
      style={{
        backgroundColor: "rgba(245, 158, 11, 0.08)",
        border: "1px solid rgba(245, 158, 11, 0.3)",
      }}
    >
      {/* Main Banner */}
      <div className="p-4 flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "rgba(245, 158, 11, 0.15)" }}
        >
          <FlaskConical className="w-5 h-5 text-amber-500" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-amber-500">Demo Mode</h4>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "rgba(245, 158, 11, 0.2)",
                color: "#f59e0b",
              }}
            >
              Simulated Data
            </span>
          </div>

          <p
            className="text-sm mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            {disclaimer.short}
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2">
            {disclaimer.highlights?.map((highlight, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                  color: "var(--text-secondary)",
                }}
              >
                <Info className="w-3 h-3 text-amber-500" />
                {highlight}
              </span>
            ))}
          </div>
        </div>

        {/* Data Period Badge */}
        {dataAsOf && (
          <div
            className="text-right flex-shrink-0 hidden sm:block"
            style={{ color: "var(--text-tertiary)" }}
          >
            <div className="text-xs mb-1">Data as of</div>
            <div
              className="font-semibold text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {dataAsOf}
            </div>
            {navPeriod && (
              <div
                className="text-xs mt-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                NAV Period: {navPeriod}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expandable Full Disclaimer (collapsible) */}
      <details className="group">
        <summary
          className="px-4 py-2 text-xs cursor-pointer flex items-center gap-1 hover:bg-amber-500/5"
          style={{
            color: "var(--text-tertiary)",
            borderTop: "1px solid rgba(245, 158, 11, 0.15)",
          }}
        >
          <AlertTriangle className="w-3 h-3" />
          Read full disclaimer
          <svg
            className="w-3 h-3 ml-auto transition-transform group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </summary>
        <div
          className="px-4 py-3 text-sm"
          style={{
            color: "var(--text-secondary)",
            backgroundColor: "rgba(245, 158, 11, 0.03)",
            borderTop: "1px solid rgba(245, 158, 11, 0.1)",
          }}
        >
          {disclaimer.full}
        </div>
      </details>
    </div>
  );
}

/**
 * Compact Demo Badge
 * For use in headers alongside page titles
 */
export function DemoBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        background:
          "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.1) 100%)",
        color: "#f59e0b",
        border: "1px solid rgba(245, 158, 11, 0.3)",
      }}
    >
      <FlaskConical className="w-3 h-3" />
      Demo Mode
    </span>
  );
}
