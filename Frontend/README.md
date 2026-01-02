# PortfoLens Frontend

> AI-powered mutual fund portfolio analysis platform - React frontend application

A modern, responsive React application built with Vite that provides comprehensive portfolio insights, diversification analysis, and AI-powered investment recommendations.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Authentication Flow](#-authentication-flow)
- [State Management](#-state-management)
- [Routing](#-routing)
- [UI/UX Patterns](#-uiux-patterns)
- [API Integration](#-api-integration)
- [Available Scripts](#-available-scripts)
- [Development Guidelines](#-development-guidelines)

---

## 🛠 Tech Stack

### Core

- **React 19.2.0** - UI framework with latest concurrent features
- **Vite 7.2.4** - Lightning-fast build tool and dev server
- **React Router DOM 7.10.1** - Client-side routing

### Styling

- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **CSS Variables** - Dynamic theming (light/dark mode)
- **Lucide React** - Beautiful, consistent icon set

### State Management

- **React Context API** - Global state (Auth, Portfolio, Analysis)
- **Local Storage** - Persistent state and token storage

### Utilities

- **ESLint** - Code quality and consistency
- **React Error Boundaries** - Error handling

---

## ✨ Features

### Authentication

- ✅ Email/Password registration and login
- ✅ Google OAuth integration
- ✅ JWT-based authentication
- ✅ Persistent sessions with token refresh
- ✅ Protected routes with loading states

### Portfolio Management

- ✅ Manual portfolio entry
- ✅ Sample portfolio for demo
- ✅ Portfolio CRUD operations
- ✅ Multiple portfolio support
- ✅ Fund reference data integration

### Analysis & Insights

- ✅ AI-powered portfolio analysis
- ✅ Asset allocation charts (Donut, Bar, Growth)
- ✅ Diversification scoring
- ✅ Risk assessment
- ✅ Performance metrics (XIRR, returns)
- ✅ Sector exposure analysis

### User Experience

- ✅ Choice Screen (Survey or Dashboard) on every login
- ✅ Interactive onboarding flow
- ✅ Dark/Light theme toggle
- ✅ Responsive design (mobile-first)
- ✅ Loading states and error boundaries
- ✅ 404 page handling
- ✅ Full-page loaders for async operations

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:5000`

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd PortfoLens/Frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
Frontend/
├── public/                      # Static assets
├── src/
│   ├── assets/                  # Images, fonts, etc.
│   ├── components/              # Reusable components
│   │   ├── ErrorBoundary.jsx    # Global error handling
│   │   ├── FullPageLoader.jsx   # Loading states
│   │   ├── ProtectedRoute.jsx   # Route guards
│   │   ├── ThemeToggle.jsx      # Dark/light mode
│   │   └── charts/              # Chart components
│   ├── context/                 # React Context providers
│   │   ├── AuthContext.jsx      # Authentication state
│   │   ├── PortfolioContext.jsx # Portfolio state
│   │   └── AnalysisContext.jsx  # Analysis state
│   ├── Dashboard/               # Main dashboard pages
│   │   ├── DashboardPage.jsx    # Dashboard home
│   │   ├── PortfolioPage.jsx    # Portfolio management
│   │   ├── InsightsPage.jsx     # AI insights
│   │   ├── ReportsPage.jsx      # Detailed reports
│   │   ├── Settings.jsx         # User settings
│   │   ├── PrivateLayout.jsx    # Sidebar + Topbar
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   ├── Topbar.jsx           # Header bar
│   │   ├── Dashboard_inner_components/
│   │   ├── Insights_page_components/
│   │   ├── Portfolio_Components/
│   │   └── Reports_componenets/
│   ├── LandingPage_components/  # Public pages
│   │   ├── LandingPage.jsx      # Marketing page
│   │   ├── SignInPage.jsx       # Login
│   │   ├── RegisterUser.jsx     # Sign up
│   │   └── NavBar.jsx           # Landing nav
│   ├── Onboarding_components/   # Onboarding flow
│   │   ├── ChoiceScreen.jsx     # Survey or Dashboard choice
│   │   ├── Survey.jsx           # Investor survey
│   │   └── ChoiceCard.jsx       # Choice card UI
│   ├── pages/                   # Special pages
│   │   ├── OAuthCallBack.jsx    # OAuth redirect handler
│   │   └── NotFoundPage.jsx     # 404 page
│   ├── service/                 # API service layer
│   │   ├── analysisService.jsx  # Analysis API calls
│   │   └── portfolioService.jsx # Portfolio API calls
│   ├── data/                    # Static data
│   │   └── samplePortfolio.js   # Demo portfolio data
│   ├── App.jsx                  # Root component
│   ├── App.css                  # Global styles
│   ├── index.css                # Tailwind imports
│   └── main.jsx                 # App entry point
├── .env                         # Environment variables
├── package.json                 # Dependencies
├── vite.config.js               # Vite configuration
├── eslint.config.js             # ESLint rules
└── README.md                    # This file
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Optional: Google OAuth Client ID (if using frontend OAuth)
# VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🔑 Authentication Flow

### Login Flow (UX)

```
Landing Page → Login/Register → Choice Screen → Survey OR Dashboard
```

**Every login redirects to Choice Screen**, allowing users to:

1. Take the Investor Survey (optional)
2. Go to Dashboard (main app)

### Technical Flow

1. **Email Login**

   - User submits credentials → `AuthContext.login()`
   - Backend validates → Returns JWT + user object
   - Frontend stores token in localStorage
   - Redirects to `/onboarding` (Choice Screen)

2. **Google OAuth**

   - User clicks "Sign in with Google"
   - Redirects to `http://localhost:5000/auth/google` (note: no /api prefix)
   - Backend handles OAuth → Redirects to `/oauth/callback?token=...`
   - Frontend extracts token → Calls `setAuthFromToken()`
   - Redirects to `/onboarding` (Choice Screen)

3. **Protected Routes**

   - `ProtectedRoute` checks `isAuthenticated`
   - Shows `FullPageLoader` during auth verification
   - Redirects to `/signin` if unauthenticated

4. **Token Persistence**
   - Token stored in localStorage
   - On app reload, `AuthContext` verifies token via `/auth/me`
   - User stays on current page (no forced redirect)

---

## 🗂 State Management

### AuthContext

```jsx
{
  user: Object,                    // Current user data
  token: String,                   // JWT token
  isAuthenticated: Boolean,        // Auth status
  isLoading: Boolean,              // Loading state
  hasCompletedOnboarding: Boolean, // Onboarding flag
  login: Function,                 // Email login
  register: Function,              // Email registration
  loginWithGoogle: Function,       // OAuth login
  setAuthFromToken: Function,      // OAuth token handler
  logout: Function,                // Clear auth state
  completeOnboarding: Function,    // Mark onboarding done
  updateProfile: Function          // Update user profile
}
```

### PortfolioContext

```jsx
{
  portfolioMode: String,           // 'NONE' | 'SAMPLE' | 'USER'
  activePortfolio: Object,         // Current portfolio data
  hasPortfolio: Boolean,           // Has any portfolio
  isSampleMode: Boolean,           // Using sample portfolio
  isUserMode: Boolean,             // Using real portfolio
  loadSamplePortfolio: Function,   // Load demo portfolio
  loadUserPortfolio: Function,     // Load user portfolio
  clearPortfolio: Function         // Reset portfolio state
}
```

### AnalysisContext

```jsx
{
  loading: Boolean,                // Analysis loading state
  error: String,                   // Error message
  hasAnalysis: Boolean,            // Analysis generated
  isDemoMode: Boolean,             // Sample analysis
  portfolioSummary: Object,        // Summary metrics
  diversification: Object,         // Diversification data
  performance: Object,             // Performance metrics
  insights: Object,                // AI insights
  reports: Object,                 // Report data
  generateAnalysis: Function,      // Generate real analysis
  generateSampleAnalysis: Function // Generate demo analysis
}
```

---

## 🛣 Routing

### Public Routes

- `/` - Landing page
- `/signin` - Login page
- `/signup` - Registration page
- `/oauth/callback` - OAuth redirect handler

### Protected Routes

All require authentication:

- `/onboarding` - Choice Screen (Survey or Dashboard)
- `/survey` - Investor Survey
- `/dashboard` - Dashboard home
- `/portfolio` - Portfolio management
- `/insights` - AI-powered insights
- `/reports` - Detailed reports
- `/settings` - User settings
- `/dashboard/add-investment` - Add portfolio
- `/dashboard/add-investment/manual` - Manual entry
- `/dashboard/add-investment/upload` - Upload file
- `/dashboard/edit-portfolio/:id` - Edit portfolio

### Error Handling

- `*` (404) - Not found page with navigation

---

## 🎨 UI/UX Patterns

### Theming

- CSS variables in `App.css` for consistent theming
- Dark/Light mode toggle
- Smooth transitions

### Loading States

- `FullPageLoader` - Full-screen loading spinner
- Inline skeletons - Component-level loading
- Disabled buttons during async operations

### Error Handling

- `ErrorBoundary` - Catches JavaScript errors
- Inline error messages - Form validation errors
- Toast notifications - Success/error feedback

### Responsive Design

- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Collapsible sidebar on mobile

---

## 🔌 API Integration

### Base URL

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
```

### Service Layer

API calls are organized in `src/service/`:

**analysisService.jsx**

```javascript
-generateAnalysis(portfolioId) - generateSampleAnalysis();
```

**portfolioService.jsx**

```javascript
-getPortfolios() -
  getPortfolioById(id) -
  createPortfolio(data) -
  updatePortfolio(id, data) -
  deletePortfolio(id);
```

### Authentication Headers

```javascript
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});
```

---

## 📜 Available Scripts

```bash
# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

---

## 📝 Development Guidelines

### Code Style

- Use functional components with hooks
- Use arrow functions for consistency
- Destructure props and state
- Use Tailwind utility classes

### Component Structure

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ComponentName() {
  // Hooks
  const navigate = useNavigate();
  const [state, setState] = useState();

  // Handlers
  const handleClick = () => {};

  // Render
  return <div>...</div>;
}
```

### State Management

- Use Context for global state
- Use useState for local component state
- Keep state as close to where it's used as possible

### Styling

```jsx
// Inline styles for CSS variables
style={{ color: 'var(--text-primary)' }}

// Tailwind classes
className="px-4 py-2 rounded-lg"

// Combined
className="flex items-center"
style={{ backgroundColor: 'var(--bg-card)' }}
```

### Error Handling

- Always wrap API calls in try/catch
- Show user-friendly error messages
- Log errors to console in development

### Performance

- Lazy load heavy components
- Memoize expensive calculations
- Use React.memo for pure components
- Avoid inline functions in renders

---

## 🔒 Security

- JWT tokens stored in localStorage
- No sensitive data in Redux/Context
- XSS protection via React's built-in escaping
- CORS configured to backend domain only
- Protected routes require valid authentication

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linter: `npm run lint`
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

Proprietary - PortfoLens v1.0

---

## 📞 Support

For issues or questions, contact the development team.

---

**Built with ❤️ using React + Vite**
