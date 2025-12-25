import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreedToTerms) {
      setError("Please accept the terms and conditions");
      return;
    }

    console.log("Sign up attempt", formData);
    setError("");

    //Add registeration API here
    navigate("/onboarding")
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative"
      style={{ background: "var(--gradient-bg)" }}
    >
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full">
        {/* Logo + Back to Home */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-3 hover:opacity-80 transition"
          >
            <Logo className="w-12 h-12" />
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
          </Link>
          <h1
            className="text-3xl font-bold mt-6 mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Create Your Account
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Start managing your portfolio with AI-powered insights
          </p>
        </div>

        {/* Sign Up Form */}
        <div
          className="rounded-2xl p-8 border"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: "var(--text-tertiary)" }}
                />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border rounded-lg outline-none"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    borderColor: "var(--border-medium)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--border-focus)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--border-medium)")
                  }
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: "var(--text-tertiary)" }}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border rounded-lg outline-none"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    borderColor: "var(--border-medium)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--border-focus)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--border-medium)")
                  }
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: "var(--text-tertiary)" }}
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border rounded-lg outline-none"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    borderColor: "var(--border-medium)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--border-focus)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--border-medium)")
                  }
                  placeholder="••••••••"
                />
              </div>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                Must be at least 8 characters
              </p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: "var(--text-tertiary)" }}
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border rounded-lg outline-none"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    borderColor: "var(--border-medium)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--border-focus)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--border-medium)")
                  }
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start space-x-3">
              <button
                type="button"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className="mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: agreedToTerms
                    ? "var(--accent-purple)"
                    : "var(--bg-input)",
                  borderColor: agreedToTerms
                    ? "var(--accent-purple)"
                    : "var(--border-medium)",
                }}
              >
                {agreedToTerms && (
                  <Check className="w-3 h-3" style={{ color: "white" }} />
                )}
              </button>
              <label
                className="text-sm cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
                onClick={() => setAgreedToTerms(!agreedToTerms)}
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="font-medium hover:opacity-80 transition"
                  style={{ color: "var(--accent-purple)" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium hover:opacity-80 transition"
                  style={{ color: "var(--accent-purple)" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="px-4 py-3 rounded-lg text-sm border"
                style={{
                  backgroundColor: "var(--error-bg)",
                  borderColor: "var(--error-border)",
                  color: "var(--error-text)",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg hover:scale-105 transition-transform font-semibold flex items-center justify-center space-x-2"
              style={{
                background: "var(--bg-button-primary)",
                color: "var(--text-inverse)",
                boxShadow: "var(--shadow-button)",
              }}
            >
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div
                className="w-full border-t"
                style={{ borderColor: "var(--border-subtle)" }}
              ></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className="px-4"
                style={{
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-secondary)",
                }}
              >
                Or sign up with
              </span>
            </div>
          </div>

          {/* Google Sign Up */}
          <button
            className="w-full py-3 border-2 rounded-lg hover:scale-105 transition-transform font-semibold flex items-center justify-center space-x-2"
            style={{
              backgroundColor: "var(--bg-button-secondary)",
              borderColor: "var(--border-medium)",
              color: "var(--text-primary)",
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>

          {/* Sign In Link */}
          <p
            className="text-center text-sm mt-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-medium hover:opacity-80 transition"
              style={{ color: "var(--accent-purple)" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
