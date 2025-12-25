import PrivateLayout from "./PrivateLayout";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <PrivateLayout pageTitle="Settings">
      <div
        className="rounded-2xl border p-12 text-center"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <SettingsIcon
          className="w-16 h-16 mx-auto mb-6"
          style={{ color: "var(--accent-purple)" }}
        />
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          Account Settings
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Manage your profile, preferences, and security settings.
        </p>
      </div>
    </PrivateLayout>
  );
}
