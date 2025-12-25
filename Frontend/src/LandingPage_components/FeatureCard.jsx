export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div
      className="p-8 rounded-2xl border hover:scale-105 transition-transform"
      style={{
        backgroundColor: "var(--bg-app)",
        borderColor: "var(--border-subtle)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
        style={{
          background: "var(--gradient-bg)",
          border: "2px solid",
          borderColor: "var(--border-subtle)",
        }}
      >
        <Icon className="w-7 h-7" style={{ color: "var(--accent-purple)" }} />
      </div>

      <h3
        className="text-xl font-bold mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>

      <p style={{ color: "var(--text-secondary)" }}>{description}</p>
    </div>
  );
}
