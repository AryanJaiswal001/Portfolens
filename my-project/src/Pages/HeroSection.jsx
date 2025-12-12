import {Link} from 'react-router-dom'
import {ArrowRight,Play} from 'lucide-react'

export default function HeroSection()
{
    return(
        <section className="pt-32 pb-20 px-4 sm:px-6 bg-linear-to-br from-purple-50 via-blue-50 to-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="space-y-8">
                        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                            Transform your {' '}
                            <span className="bg-linear-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">Portfolio Analysis</span>
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed">AI-Powered insights, real-time analytics, and personalized recommendations to optimize your investments.</p>
                        {/* Call-to-Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                            to="/signin"
                            className="px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition items-center flex justify-center space-x-2"
                            ><span>Get Started</span>
                            <ArrowRight className="w-5 h-5"/>
                            </Link>
                            <button className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-purple-600 hover:text-purple-600 transition font-semibold flex items-center justify-center space-x-2">
                                <Play className="w-5 h-5"/>
                                <span>Watch Demo</span>
                            </button>
                        </div>
                        {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-blue-400 border-2 border-white" />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">2,500+</span> investors trust PortfoLens
              </p>
            

                    </div>
                </div>
            </div>
            </div>
        </section>
    )
}