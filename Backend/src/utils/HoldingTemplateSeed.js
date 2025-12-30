/**
 * HoldingTemplate Seed Data
 *
 * 9 category-level templates for fund holdings approximation
 *
 * These templates provide:
 * - Sector exposure percentages
 * - Market cap distribution
 * - Typical holdings (representative stocks/instruments)
 *
 * ⚠️ This is REFERENCE data only
 * NO fund-specific holdings
 * NO real-time data
 */

const holdingTemplateSeedData = [
  // ==================
  // EQUITY TEMPLATES
  // ==================
  {
    templateKey: "LARGE_CAP_EQUITY",
    assetType: "Equity",
    category: "Large Cap",
    sectorExposure: {
      Banking: 28,
      IT: 14,
      FMCG: 10,
      Energy: 9,
      Pharma: 6,
      Auto: 5,
      Metals: 4,
      Others: 24,
    },
    marketCapExposure: {
      LargeCap: 85,
      MidCap: 10,
      SmallCap: 5,
    },
    typicalHoldings: [
      "HDFC Bank",
      "Reliance Industries",
      "Infosys",
      "ICICI Bank",
      "ITC",
    ],
  },
  {
    templateKey: "MID_CAP_EQUITY",
    assetType: "Equity",
    category: "Mid Cap",
    sectorExposure: {
      Banking: 24,
      IT: 15,
      FMCG: 9,
      Pharma: 8,
      Auto: 10,
      Metals: 6,
      Energy: 5,
      Others: 23,
    },
    marketCapExposure: {
      LargeCap: 10,
      MidCap: 75,
      SmallCap: 15,
    },
    typicalHoldings: [
      "Trent",
      "Persistent Systems",
      "Federal Bank",
      "Cummins India",
    ],
  },
  {
    templateKey: "SMALL_CAP_EQUITY",
    assetType: "Equity",
    category: "Small Cap",
    sectorExposure: {
      Banking: 18,
      IT: 12,
      FMCG: 10,
      Pharma: 9,
      Auto: 14,
      Metals: 8,
      Energy: 5,
      Others: 24,
    },
    marketCapExposure: {
      LargeCap: 5,
      MidCap: 25,
      SmallCap: 70,
    },
    typicalHoldings: [
      "Kalyan Jewellers",
      "RITES",
      "Cera Sanitaryware",
      "V-Guard Industries",
    ],
  },
  {
    templateKey: "FLEXI_CAP_EQUITY",
    assetType: "Equity",
    category: "Flexi Cap",
    sectorExposure: {
      Banking: 25,
      IT: 18,
      FMCG: 10,
      Energy: 8,
      Pharma: 6,
      Auto: 5,
      Metals: 3,
      Others: 25,
    },
    marketCapExposure: {
      LargeCap: 65,
      MidCap: 25,
      SmallCap: 10,
    },
    typicalHoldings: ["HDFC Bank", "ITC", "Reliance Industries", "Infosys"],
  },
  {
    templateKey: "INDEX_EQUITY",
    assetType: "Equity",
    category: "Index",
    sectorExposure: {
      Banking: 32,
      IT: 15,
      FMCG: 10,
      Energy: 11,
      Pharma: 5,
      Auto: 6,
      Metals: 4,
      Others: 17,
    },
    marketCapExposure: {
      LargeCap: 100,
      MidCap: 0,
      SmallCap: 0,
    },
    typicalHoldings: ["Reliance Industries", "HDFC Bank", "Infosys", "TCS"],
  },

  // ==================
  // HYBRID TEMPLATE
  // ==================
  {
    templateKey: "HYBRID_EQUITY",
    assetType: "Hybrid",
    category: "Hybrid",
    sectorExposure: {
      Banking: 20,
      IT: 10,
      FMCG: 8,
      Energy: 7,
      Pharma: 5,
      Auto: 6,
      Metals: 4,
      Debt: 25,
      Others: 15,
    },
    marketCapExposure: {
      LargeCap: 55,
      MidCap: 15,
      SmallCap: 5,
    },
    typicalHoldings: [
      "ICICI Bank",
      "Reliance Industries",
      "Infosys",
      "Government Bonds",
    ],
  },

  // ==================
  // DEBT TEMPLATES
  // ==================
  {
    templateKey: "DEBT_CORPORATE_BOND",
    assetType: "Debt",
    category: "Corporate Bond",
    sectorExposure: {
      Banking: 40,
      Infrastructure: 15,
      Energy: 10,
      PSU: 10,
      Others: 25,
    },
    marketCapExposure: {
      LargeCap: 0,
      MidCap: 0,
      SmallCap: 0,
    },
    typicalHoldings: ["HDFC Ltd Bonds", "NTPC Bonds", "REC Bonds"],
  },
  {
    templateKey: "DEBT_SHORT_DURATION",
    assetType: "Debt",
    category: "Short Duration",
    sectorExposure: {
      Banking: 35,
      PSU: 20,
      Infrastructure: 15,
      Energy: 10,
      Others: 20,
    },
    marketCapExposure: {
      LargeCap: 0,
      MidCap: 0,
      SmallCap: 0,
    },
    typicalHoldings: ["Treasury Bills", "PSU Bonds", "AAA Corporate Bonds"],
  },

  // ==================
  // GOLD TEMPLATE
  // ==================
  {
    templateKey: "GOLD",
    assetType: "Gold",
    category: "Gold",
    sectorExposure: {
      Gold: 95,
      Cash: 5,
    },
    marketCapExposure: {
      LargeCap: 0,
      MidCap: 0,
      SmallCap: 0,
    },
    typicalHoldings: ["Physical Gold", "Gold ETF Units"],
  },
];

export default holdingTemplateSeedData;
