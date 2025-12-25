import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative overflow-hidden"
      style={{ background: "var(--gradient-bg)" }}
    >
      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-8 border"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <TrendingUp
            className="w-4 h-4"
            style={{ color: "var(--accent-purple)" }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            AI-Powered Portfolio Management
          </span>
        </div>

        {/* Main Heading */}
        <h1
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Invest Smarter with{" "}
          <span
            style={{
              background: "var(--gradient-text)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI Insights
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          Transform your investment strategy with advanced analytics, real-time
          insights, and intelligent portfolio management powered by AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-transform flex items-center space-x-2"
            style={{
              background: "var(--bg-button-primary)",
              color: "var(--text-inverse)",
              boxShadow: "var(--shadow-button)",
            }}
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <button
            className="px-8 py-4 border-2 rounded-lg font-semibold text-lg hover:scale-105 transition-transform"
            style={{
              backgroundColor: "var(--bg-button-secondary)",
              borderColor: "var(--border-medium)",
              color: "var(--text-primary)",
            }}
          >
            Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
          <div>
            <div
              className="text-4xl font-bold mb-2"
              style={{
                background: "var(--gradient-text)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              $2.5B+
            </div>
            <div style={{ color: "var(--text-secondary)" }}>Assets Managed</div>
          </div>
          <div>
            <div
              className="text-4xl font-bold mb-2"
              style={{
                background: "var(--gradient-text)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              50K+
            </div>
            <div style={{ color: "var(--text-secondary)" }}>Active Users</div>
          </div>
          <div>
            <div
              className="text-4xl font-bold mb-2"
              style={{
                background: "var(--gradient-text)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              98%
            </div>
            <div style={{ color: "var(--text-secondary)" }}>Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
}
