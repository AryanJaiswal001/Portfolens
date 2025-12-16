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

import "./App.css";

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

        {/* Private Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
