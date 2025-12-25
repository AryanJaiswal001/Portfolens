import { createContext, useContext, useState } from "react";
import { SAMPLE_PORTFOLIO } from "../data/samplePortfolio";

// Create the Portfolio Context
const PortfolioContext = createContext(null);

// Portfolio Provider Component
export function PortfolioProvider({ children }) {
  // Single source of truth for portfolio data
  // Can be: null (no portfolio), user portfolio object, or sample portfolio
  const [activePortfolio, setActivePortfolio] = useState(null);

  // Load sample portfolio
  const loadSamplePortfolio = () => {
    setActivePortfolio(SAMPLE_PORTFOLIO);
  };

  // Load user portfolio (for future use when user adds their own)
  const loadUserPortfolio = (portfolioData) => {
    setActivePortfolio({
      ...portfolioData,
      isSample: false,
    });
  };

  // Clear portfolio (reset to empty state)
  const clearPortfolio = () => {
    setActivePortfolio(null);
  };

  // Computed values
  const hasPortfolio = Boolean(activePortfolio);
  const isSample = activePortfolio?.isSample === true;

  const value = {
    // State
    activePortfolio,
    hasPortfolio,
    isSample,

    // Actions
    setActivePortfolio,
    loadSamplePortfolio,
    loadUserPortfolio,
    clearPortfolio,
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
