import Navbar from "./NavBar";
import HeroSection from "./HeroSection";
import FeatureCard from "./FeatureCard";
import {
  Brain,
  LineChart,
  Shield,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Machine learning algorithms analyze your portfolio to provide actionable insights and optimize investment strategies.",
    },
    {
      icon: LineChart,
      title: "Real-Time Analytics",
      description:
        "Stay updated with live market data and portfolio performance metrics to make informed decisions.",
    },
    {
      icon: Shield,
      title: "Intelligent Risk Management",
      description:
        "Advanced risk assessment tools help you identify potential threats and safeguard your investments.",
    },
    {
      icon: Zap,
      title: "Automated Rebalancing",
      description:
        "Set your investment goals and let our AI-driven system automatically rebalance your portfolio for optimal performance.",
    },
    {
      icon: Target,
      title: "Personalized Recommendations",
      description:
        "Receive tailored investment suggestions based on your risk tolerance, financial goals, and market trends.",
    },
    {
      icon: TrendingUp,
      title: "Comprehensive Reporting",
      description:
        "Generate detailed reports on portfolio performance, asset allocation, and investment returns with just a few clicks.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools and insights to help you make smarter investments
              decisions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/*Footer*/}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 PortfoLens. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
