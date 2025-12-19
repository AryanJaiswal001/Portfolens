import { useNavigate } from "react-router-dom";
import PrivateLayout from "../PrivateLayout";
import { Upload, ChevronLeft } from "lucide-react";

export default function UploadPage() {
  const navigate = useNavigate();

  return (
    <PrivateLayout pageTitle="Upload Portfolio">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard/add-investment")}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Placeholder content */}
        <div
          className="rounded-2xl border p-12 text-center"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <Upload
            className="w-16 h-16 mx-auto mb-6"
            style={{ color: "var(--accent-purple)" }}
          />
          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            CSV/Excel Upload
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Upload functionality coming soon! We'll support files from popular
            brokers and investment platforms.
          </p>
        </div>
      </div>
    </PrivateLayout>
  );
}
