import { createContext, useContext, useState, useEffect } from "react";
import { SAMPLE_PORTFOLIO } from "../data/samplePortfolio";

// Create the Portfolio Context
const PortfolioContext = createContext(null);

/**
 * Portfolio Mode - Single source of truth for portfolio state
 * NONE: brand-new user, no portfolio
 * SAMPLE: user is viewing demo/sample portfolio
 * USER: user has entered their own portfolio
 */
export const PORTFOLIO_MODE = {
  NONE: "NONE",
  SAMPLE: "SAMPLE",
  USER: "USER",
};

// Storage key for persistence
const PORTFOLIO_MODE_KEY = "portfolioMode";
const PORTFOLIO_DATA_KEY = "portfolioData";

// Portfolio Provider Component
export function PortfolioProvider({ children }) {
  // Initialize from localStorage if available
  const [portfolioMode, setPortfolioModeState] = useState(() => {
    const saved = localStorage.getItem(PORTFOLIO_MODE_KEY);
    return saved && Object.values(PORTFOLIO_MODE).includes(saved)
      ? saved
      : PORTFOLIO_MODE.NONE;
  });

  // Portfolio data state
  const [activePortfolio, setActivePortfolioState] = useState(() => {
    const mode = localStorage.getItem(PORTFOLIO_MODE_KEY);
    if (mode === PORTFOLIO_MODE.SAMPLE) {
      return SAMPLE_PORTFOLIO;
    }
    const savedData = localStorage.getItem(PORTFOLIO_DATA_KEY);
    return savedData ? JSON.parse(savedData) : null;
  });

  // Persist mode changes to localStorage
  const setPortfolioMode = (mode) => {
    setPortfolioModeState(mode);
    localStorage.setItem(PORTFOLIO_MODE_KEY, mode);
  };

  // Load sample portfolio
  const loadSamplePortfolio = () => {
    setPortfolioMode(PORTFOLIO_MODE.SAMPLE);
    setActivePortfolioState(SAMPLE_PORTFOLIO);
  };

  // Load user portfolio
  const loadUserPortfolio = (portfolioData) => {
    setPortfolioMode(PORTFOLIO_MODE.USER);
    const userPortfolio = {
      ...portfolioData,
      isSample: false,
    };
    setActivePortfolioState(userPortfolio);
    localStorage.setItem(PORTFOLIO_DATA_KEY, JSON.stringify(userPortfolio));
  };

  // Clear portfolio (reset to empty state)
  const clearPortfolio = () => {
    setPortfolioMode(PORTFOLIO_MODE.NONE);
    setActivePortfolioState(null);
    localStorage.removeItem(PORTFOLIO_DATA_KEY);
  };

  // Exit sample mode (go back to NONE)
  const exitSampleMode = () => {
    setPortfolioMode(PORTFOLIO_MODE.NONE);
    setActivePortfolioState(null);
  };

  // Computed values
  const hasPortfolio = portfolioMode !== PORTFOLIO_MODE.NONE;
  const isSampleMode = portfolioMode === PORTFOLIO_MODE.SAMPLE;
  const isUserMode = portfolioMode === PORTFOLIO_MODE.USER;
  const isEmptyMode = portfolioMode === PORTFOLIO_MODE.NONE;

  const value = {
    // State
    portfolioMode,
    activePortfolio,
    hasPortfolio,
    isSampleMode,
    isUserMode,
    isEmptyMode,

    // Legacy compatibility
    isSample: isSampleMode,

    // Actions
    setActivePortfolio: setActivePortfolioState,
    loadSamplePortfolio,
    loadUserPortfolio,
    clearPortfolio,
    exitSampleMode,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

// Custom hook to use portfolio context
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}

export default PortfolioContext;
