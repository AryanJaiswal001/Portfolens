import {Link} from 'react-router-dom'
import Logo from '../components/Logo'

export default function Navbar(){
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/*Logo+Brand*/}
            <Link
              to="/"
              className="flex items-center space-x-3 hover:opacity-80 transition"
            >
              <Logo className="w-8 h-8" />
              <span className="text-xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                PortfoLens
              </span>
            </Link>

            {/*Navigation Links*/}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-purple-600 transition font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-purple-600 transition font-medium"
              >
                Pricing
              </a>
              <Link
                to="/signin"
                className="px-6 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition font-medium"
              >
                Sign-in
              </Link>

              {/*Mobile Menu Button*/}
              <button className="md:hidden text-gray-700">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
}