import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";

export default function Navbar() {
  return (
    <nav
      className="px-4 sm:px-6 lg:px-8 py-4 border-b"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Logo className="w-10 h-10" />
          <span
            className="text-2xl font-bold"
            style={{
              background: "var(--gradient-text)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            PortfoLens
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="font-medium hover:opacity-70 transition"
            style={{ color: "var(--text-secondary)" }}
          >
            Features
          </a>
          <a
            href="#pricing"
            className="font-medium hover:opacity-70 transition"
            style={{ color: "var(--text-secondary)" }}
          >
            Pricing
          </a>
          <a
            href="#about"
            className="font-medium hover:opacity-70 transition"
            style={{ color: "var(--text-secondary)" }}
          >
            About
          </a>
        </div>

        {/* Right Side: Theme Toggle + Auth Buttons */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <Link
            to="/signin"
            className="font-medium hover:opacity-70 transition"
            style={{ color: "var(--text-secondary)" }}
          >
            Sign In
          </Link>

          <Link
            to="/signup"
            className="px-6 py-2.5 rounded-lg font-semibold hover:scale-105 transition-transform"
            style={{
              background: "var(--bg-button-primary)",
              color: "var(--text-inverse)",
              boxShadow: "var(--shadow-button)",
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
