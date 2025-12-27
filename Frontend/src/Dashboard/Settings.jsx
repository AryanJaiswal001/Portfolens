import { useNavigate } from "react-router-dom";
import PrivateLayout from "./PrivateLayout";
import { Settings as SettingsIcon, LogOut, User, Shield, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin", { replace: true });
  };

  return (
    <PrivateLayout pageTitle="Settings">
      <div className="space-y-6">
        {/* Profile Section */}
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--accent-purple)" }}
            >
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {user?.name || "User"}
              </h3>
              <p style={{ color: "var(--text-secondary)" }}>
                {user?.email || "email@example.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Settings Options */}
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Preferences
          </h3>
          
          <div className="space-y-3">
            <button
              className="w-full flex items-center gap-3 p-4 rounded-xl transition-all hover:opacity-80"
              style={{
                backgroundColor: "var(--bg-app)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <User className="w-5 h-5" style={{ color: "var(--accent-purple)" }} />
              <span style={{ color: "var(--text-primary)" }}>Edit Profile</span>
            </button>
            
            <button
              className="w-full flex items-center gap-3 p-4 rounded-xl transition-all hover:opacity-80"
              style={{
                backgroundColor: "var(--bg-app)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <Shield className="w-5 h-5" style={{ color: "var(--accent-purple)" }} />
              <span style={{ color: "var(--text-primary)" }}>Security</span>
            </button>
            
            <button
              className="w-full flex items-center gap-3 p-4 rounded-xl transition-all hover:opacity-80"
              style={{
                backgroundColor: "var(--bg-app)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <Bell className="w-5 h-5" style={{ color: "var(--accent-purple)" }} />
              <span style={{ color: "var(--text-primary)" }}>Notifications</span>
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Account
          </h3>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
            }}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </PrivateLayout>
  );
}
