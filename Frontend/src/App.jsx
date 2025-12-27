import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PortfolioProvider } from "./context/PortfolioContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import LandingPage from "./LandingPage_components/LandingPage";
import SignInPage from "./LandingPage_components/SignInPage";
import RegisterUser from "./LandingPage_components/RegisterUser";
import OAuthCallback from "./pages/OAuthCallBack";

// Onboarding
import ChoiceScreen from "./Onboarding_components/ChoiceScreen";
import Survey from "./Onboarding_components/Survey";

// Dashboard Pages
import DashboardPage from "./Dashboard/DashboardPage";
import PortfolioPage from "./Dashboard/PortfolioPage";
import InsightsPage from "./Dashboard/InsightsPage";
import ReportsPage from "./Dashboard/ReportsPage";
import SettingsPage from "./Dashboard/Settings";

// Dashboard Inner Components
import SelectMethod from "./Dashboard/Dashboard_inner_components/SelectMethod";
import ManualEntryPage from "./Dashboard/Dashboard_inner_components/ManualEntry";
import UploadPage from "./Dashboard/Dashboard_inner_components/UploadPage";

import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <PortfolioProvider>
          <Routes>
            {/* ======================== */}
            {/* PUBLIC ROUTES */}
            {/* ======================== */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<RegisterUser />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />

            {/* ======================== */}
            {/* PROTECTED ROUTES */}
            {/* ======================== */}

            {/* Onboarding (protected) */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <ChoiceScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/survey"
              element={
                <ProtectedRoute>
                  <Survey />
                </ProtectedRoute>
              }
            />

            {/* Main Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <PortfolioPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/insights"
              element={
                <ProtectedRoute>
                  <InsightsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Dashboard Inner Routes */}
            <Route
              path="/dashboard/add-investment"
              element={
                <ProtectedRoute>
                  <SelectMethod />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/add-investment/manual"
              element={
                <ProtectedRoute>
                  <ManualEntryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/add-investment/upload"
              element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </PortfolioProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
