import { createContext, useContext, useState, useCallback } from "react";
import {
  generateAnalysis as generateAnalysisAPI,
  generateSampleAnalysis as generateSampleAnalysisAPI,
} from "../service/analysisService";

/**
 * Analysis Context
 *
 * Global state for portfolio analysis results.
 * Analysis is only triggered when user clicks "Generate Insights & Reports"
 *
 * State shape:
 * - loading: boolean
 * - error: string | null
 * - isDemoMode: boolean
 * - dataAsOf: string
 * - navPeriod: string
 * - disclaimer: { short, full, highlights }
 * - portfolioSummary: object
 * - diversification: object
 * - performance: object
 * - insights: object
 * - reports: object
 */

const AnalysisContext = createContext(null);

// Initial state
const initialState = {
  loading: false,
  error: null,
  hasAnalysis: false,
  // Analysis data
  isDemoMode: false,
  dataAsOf: null,
  navPeriod: null,
  disclaimer: null,
  portfolioSummary: null,
  diversification: null,
  performance: null,
  insights: null,
  reports: null,
  generatedAt: null,
  analysisVersion: null,
};

export function AnalysisProvider({ children }) {
  const [analysisState, setAnalysisState] = useState(initialState);

  /**
   * Generate analysis for a specific portfolio
   * Called when user clicks "Generate Insights & Reports"
   */
  const generateAnalysis = useCallback(async (portfolioId) => {
    setAnalysisState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await generateAnalysisAPI(portfolioId);

      if (response.success) {
        const data = response.data;
        setAnalysisState({
          loading: false,
          error: null,
          hasAnalysis: true,
          isDemoMode: data.isDemoMode,
          dataAsOf: data.dataAsOf,
          navPeriod: data.navPeriod,
          disclaimer: data.disclaimer,
          portfolioSummary: data.portfolioSummary,
          diversification: data.diversification,
          performance: data.performance,
          insights: data.insights,
          reports: data.reports,
          generatedAt: data.generatedAt,
          analysisVersion: data.analysisVersion,
        });
        return { success: true };
      } else {
        throw new Error(response.message || "Failed to generate analysis");
      }
    } catch (error) {
      setAnalysisState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to generate analysis",
        hasAnalysis: false,
      }));
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Generate sample analysis (no authentication required)
   * Used for demo/preview purposes
   */
  const generateSampleAnalysis = useCallback(async () => {
    setAnalysisState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await generateSampleAnalysisAPI();

      if (response.success) {
        const data = response.data;
        setAnalysisState({
          loading: false,
          error: null,
          hasAnalysis: true,
          isDemoMode: data.isDemoMode,
          dataAsOf: data.dataAsOf,
          navPeriod: data.navPeriod,
          disclaimer: data.disclaimer,
          portfolioSummary: data.portfolioSummary,
          diversification: data.diversification,
          performance: data.performance,
          insights: data.insights,
          reports: data.reports,
          generatedAt: data.generatedAt,
          analysisVersion: data.analysisVersion,
        });
        return { success: true };
      } else {
        throw new Error(
          response.message || "Failed to generate sample analysis"
        );
      }
    } catch (error) {
      setAnalysisState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to generate sample analysis",
        hasAnalysis: false,
      }));
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Clear analysis state
   * Called when user switches portfolios or logs out
   */
  const clearAnalysis = useCallback(() => {
    setAnalysisState(initialState);
  }, []);

  const value = {
    // State
    ...analysisState,

    // Actions
    generateAnalysis,
    generateSampleAnalysis,
    clearAnalysis,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

/**
 * Hook to use analysis context
 */
export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}

export default AnalysisContext;
