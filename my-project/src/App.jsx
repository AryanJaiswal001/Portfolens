import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage_components/LandingPage";
import SignInPage from "./LandingPage_components/SignInPage";
import RegisterUser from "./LandingPage_components/RegisterUser";
import ChoiceScreen from "./Onboarding_components/ChoiceScreen";
import Survey from "./Onboarding_components/Survey";
import DashboardPage from "./Dashboard/DashboardPage";
import PortfolioPage from "./Dashboard/PortfolioPage";
import InsightsPage from "./Dashboard/InsightsPage";
import ReportsPage from "./Dashboard/ReportsPage";
import SettingsPage from "./Dashboard/Settings";


// Import Dashboard Inner Components
import SelectMethod from "./Dashboard/Dashboard_inner_components/SelectMethod";
import ManualEntryPage from "./Dashboard/Dashboard_inner_components/ManualEntry";
import UploadPage from "./Dashboard/Dashboard_inner_components/UploadPage";

import "./App.css";
import SurveyPage from "./Onboarding_components/Survey";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<RegisterUser />} />
        <Route path="/onboarding" element={<ChoiceScreen />} />
        <Route path="/survey" element={<Survey />} />

        {/* Private Routes - Main Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Dashboard Inner Routes - Add Investment Flow */}
        <Route path="/dashboard/add-investment" element={<SelectMethod />} />
        <Route
          path="/dashboard/add-investment/manual"
          element={<ManualEntryPage />}
        />
        <Route
          path="/dashboard/add-investment/upload"
          element={<UploadPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
