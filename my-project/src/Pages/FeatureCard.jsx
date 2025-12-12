export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="w-14 h-14 bg-linear-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
        <Icon className="w-7 h-7 text-purple-600" />
      </div>

      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
