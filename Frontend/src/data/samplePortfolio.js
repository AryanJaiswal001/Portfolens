// Sample Portfolio Data
// This provides realistic sample data for demo/preview purposes

export const SAMPLE_PORTFOLIO = {
  isSample: true,
  portfolioName: "Sample Investment Portfolio",

  // Summary Metrics
  totalInvested: 1250000, // ₹12,50,000
  currentValue: 1485230, // ₹14,85,230
  absoluteReturn: 235230, // ₹2,35,230
  percentageReturn: 18.82,

  // Duration
  investmentDuration: "2 years 4 months",
  startDate: "2023-08-15",

  // Risk Assessment
  riskLevel: "Moderate",
  diversificationScore: 72, // out of 100

  // Number of funds
  numberOfFunds: 8,

  // Asset Allocation (percentages)
  allocation: {
    equity: 65,
    debt: 25,
    gold: 7,
    cash: 3,
  },

  // Fund-wise Breakdown
  funds: [
    {
      id: 1,
      name: "HDFC Mid-Cap Opportunities Fund",
      category: "Equity - Mid Cap",
      invested: 312500,
      currentValue: 378125,
      allocation: 25,
      returns: 21.0,
    },
    {
      id: 2,
      name: "Axis Bluechip Fund",
      category: "Equity - Large Cap",
      invested: 250000,
      currentValue: 287500,
      allocation: 20,
      returns: 15.0,
    },
    {
      id: 3,
      name: "SBI Small Cap Fund",
      category: "Equity - Small Cap",
      invested: 187500,
      currentValue: 234375,
      allocation: 15,
      returns: 25.0,
    },
    {
      id: 4,
      name: "ICICI Prudential Value Discovery Fund",
      category: "Equity - Value",
      invested: 187500,
      currentValue: 215625,
      allocation: 15,
      returns: 15.0,
    },
    {
      id: 5,
      name: "Parag Parikh Flexi Cap Fund",
      category: "Equity - Flexi Cap",
      invested: 125000,
      currentValue: 153750,
      allocation: 10,
      returns: 23.0,
    },
    {
      id: 6,
      name: "Kotak Equity Hybrid Fund",
      category: "Hybrid - Aggressive",
      invested: 125000,
      currentValue: 143750,
      allocation: 10,
      returns: 15.0,
    },
    {
      id: 7,
      name: "HDFC Corporate Bond Fund",
      category: "Debt - Corporate Bond",
      invested: 37500,
      currentValue: 40875,
      allocation: 3,
      returns: 9.0,
    },
    {
      id: 8,
      name: "SBI Gold Fund",
      category: "Commodity - Gold",
      invested: 25000,
      currentValue: 31230,
      allocation: 2,
      returns: 24.9,
    },
  ],

  // Stock Overlap Data (for Overlap & Concentration tab)
  stockOverlap: [
    {
      stock: "HDFC Bank",
      fundsHolding: 5,
      totalFunds: 8,
      combinedExposure: 12.5,
      severity: "high",
    },
    {
      stock: "Infosys",
      fundsHolding: 4,
      totalFunds: 8,
      combinedExposure: 8.2,
      severity: "moderate",
    },
    {
      stock: "Reliance Industries",
      fundsHolding: 4,
      totalFunds: 8,
      combinedExposure: 7.8,
      severity: "moderate",
    },
    {
      stock: "ICICI Bank",
      fundsHolding: 3,
      totalFunds: 8,
      combinedExposure: 5.4,
      severity: "low",
    },
    {
      stock: "TCS",
      fundsHolding: 3,
      totalFunds: 8,
      combinedExposure: 4.9,
      severity: "low",
    },
  ],

  // Sector Concentration
  sectorConcentration: [
    { sector: "Financial Services", percentage: 28 },
    { sector: "Information Technology", percentage: 22 },
    { sector: "Consumer Goods", percentage: 15 },
    { sector: "Healthcare", percentage: 12 },
    { sector: "Energy", percentage: 10 },
    { sector: "Others", percentage: 13 },
  ],

  // Risk Scenarios
  riskScenarios: {
    marketFall20: {
      potentialLossMin: 250000,
      potentialLossMax: 300000,
    },
    marketFall10: {
      potentialLossMin: 125000,
      potentialLossMax: 150000,
    },
  },

  // Performance History (for charts - monthly data points)
  performanceHistory: [
    { month: "Aug 2023", invested: 500000, value: 500000 },
    { month: "Nov 2023", invested: 650000, value: 680000 },
    { month: "Feb 2024", invested: 800000, value: 880000 },
    { month: "May 2024", invested: 950000, value: 1090000 },
    { month: "Aug 2024", invested: 1100000, value: 1265000 },
    { month: "Nov 2024", invested: 1250000, value: 1485230 },
  ],
};

// Helper function to format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper to format currency without symbol
export const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-IN").format(amount);
};

export default SAMPLE_PORTFOLIO;
