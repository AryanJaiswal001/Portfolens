import PrivateLayout from "./PrivateLayout";
import { Briefcase } from "lucide-react";

export default function PortfolioPage() {
  return (
    <PrivateLayout pageTitle="Portfolio">
      <div
        className="rounded-2xl border p-12 text-center"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <Briefcase
          className="w-16 h-16 mx-auto mb-6"
          style={{ color: "var(--accent-purple)" }}
        ></Briefcase>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          Portfolio Management
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Your holdings, assets and allocation details will appear here.
        </p>
      </div>
    </PrivateLayout>
  );
}
