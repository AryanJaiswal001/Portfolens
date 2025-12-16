import PrivateLayout from "./PrivateLayout";
import { FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <PrivateLayout pageTitle="Reports">
      <div
        className="rounded-2xl border p-12 text-center"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <FileText
          className="w-16 h-16 mx-auto mb-6"
          style={{ color: "var(--accent-purple)" }}
        />
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          Financial Reports
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Generate and export detailed portfolio reports.
        </p>
      </div>
    </PrivateLayout>
  );
}
