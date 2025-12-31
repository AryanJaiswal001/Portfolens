/**
 * Test Analysis Script
 *
 * Tests various portfolio scenarios to verify calculations work correctly:
 * - Multi-Fund SIP (same category)
 * - Multi-Fund SIP (different categories)
 * - Same Fund: SIP + Lumpsum
 * - SIP + Lumpsum across multiple funds
 * - Multi-Fund Lumpsum
 *
 * Usage: node --experimental-modules src/scripts/testAnalysis.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { generateSampleAnalysis } from "../services/analysis/analysis.service.js";
import {
  analyzePerformance,
  fetchNavData,
} from "../services/analysis/performance.service.js";
import {
  analyzeDiversification,
  fetchFundMetadata,
  fetchHoldingTemplates,
} from "../services/analysis/diversification.service.js";

dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/Portfolens";

// Test scenarios
const testScenarios = [
  {
    name: "Multi-Fund SIP (same category - Mid Cap)",
    portfolio: {
      portfolioName: "Test: Multi-Fund SIP Same Category",
      funds: [
        {
          id: 1,
          name: "HDFC Mid-Cap Opportunities Fund",
          category: "Equity - Mid Cap",
          invested: 120000,
        },
        {
          id: 2,
          name: "Kotak Emerging Equity Fund",
          category: "Equity - Mid Cap",
          invested: 100000,
        },
      ],
    },
    expected: {
      fundCount: 2,
      allFundsHavePositiveInvested: true,
    },
  },
  {
    name: "Multi-Fund SIP (different categories)",
    portfolio: {
      portfolioName: "Test: Multi-Fund SIP Different Categories",
      funds: [
        {
          id: 1,
          name: "Axis Bluechip Fund",
          category: "Equity - Large Cap",
          invested: 100000,
        },
        {
          id: 2,
          name: "HDFC Mid-Cap Opportunities Fund",
          category: "Equity - Mid Cap",
          invested: 80000,
        },
        {
          id: 3,
          name: "SBI Small Cap Fund",
          category: "Equity - Small Cap",
          invested: 60000,
        },
      ],
    },
    expected: {
      fundCount: 3,
      assetAllocationHasEquity: true,
    },
  },
  {
    name: "Same Fund: SIP + Lumpsum",
    portfolio: {
      portfolioName: "Test: SIP + Lumpsum Same Fund",
      funds: [
        {
          id: 1,
          name: "ICICI Prudential Flexi Cap Fund",
          category: "Equity - Flexi Cap",
          invested: 150000,
          // This will be converted to SIP by generateSampleAnalysis
          // We need to test actual portfolio with both
        },
      ],
    },
    expected: {
      fundCount: 1,
      totalInvestedPositive: true,
    },
  },
  {
    name: "Multi-Fund Lumpsum",
    portfolio: {
      portfolioName: "Test: Multi-Fund Lumpsum",
      funds: [
        {
          id: 1,
          name: "Kotak Equity Hybrid Fund",
          category: "Hybrid - Aggressive",
          invested: 200000,
        },
        {
          id: 2,
          name: "HDFC Corporate Bond Fund",
          category: "Debt - Corporate Bond",
          invested: 100000,
        },
      ],
    },
    expected: {
      fundCount: 2,
      hasDiverseAssetAllocation: true,
    },
  },
];

async function runTests() {
  console.log("\n🧪 Portfolio Analysis Test Suite");
  console.log("═".repeat(60));

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    let passed = 0;
    let failed = 0;

    for (const scenario of testScenarios) {
      console.log(`\n📋 Test: ${scenario.name}`);
      console.log("-".repeat(50));

      try {
        const analysis = await generateSampleAnalysis(scenario.portfolio);

        // Verify results
        const checks = [];

        // Check fund count
        if (scenario.expected.fundCount) {
          const actualCount = analysis.performance.fundPerformance.length;
          const pass = actualCount === scenario.expected.fundCount;
          checks.push({
            name: "Fund Count",
            expected: scenario.expected.fundCount,
            actual: actualCount,
            pass,
          });
        }

        // Check all funds have positive invested
        if (scenario.expected.allFundsHavePositiveInvested) {
          const allPositive = analysis.performance.fundPerformance.every(
            (f) => f.totalInvested > 0
          );
          checks.push({
            name: "All Funds Have Investments",
            expected: true,
            actual: allPositive,
            pass: allPositive,
          });
        }

        // Check asset allocation has equity
        if (scenario.expected.assetAllocationHasEquity) {
          const hasEquity = analysis.diversification.assetAllocation.Equity > 0;
          checks.push({
            name: "Asset Allocation Has Equity",
            expected: true,
            actual: hasEquity,
            pass: hasEquity,
          });
        }

        // Check total invested is positive
        if (scenario.expected.totalInvestedPositive) {
          const positive = analysis.performance.summary.totalInvested > 0;
          checks.push({
            name: "Total Invested > 0",
            expected: true,
            actual: positive,
            pass: positive,
          });
        }

        // Check diverse asset allocation
        if (scenario.expected.hasDiverseAssetAllocation) {
          const assetTypes = Object.keys(
            analysis.diversification.assetAllocation
          );
          const diverse = assetTypes.length > 1;
          checks.push({
            name: "Diverse Asset Allocation",
            expected: true,
            actual: diverse,
            pass: diverse,
          });
        }

        // Print results
        let scenarioPassed = true;
        for (const check of checks) {
          const icon = check.pass ? "✅" : "❌";
          console.log(
            `  ${icon} ${check.name}: expected=${check.expected}, actual=${check.actual}`
          );
          if (!check.pass) scenarioPassed = false;
        }

        // Print summary values
        console.log(`\n  📊 Summary:`);
        console.log(
          `     Total Invested: ₹${analysis.performance.summary.totalInvested.toLocaleString()}`
        );
        console.log(
          `     Current Value: ₹${analysis.performance.summary.currentValue.toLocaleString()}`
        );
        console.log(
          `     Return: ${analysis.performance.summary.absoluteReturnPercent}%`
        );
        console.log(`     XIRR: ${analysis.performance.summary.xirr}%`);

        console.log(`\n  📈 Fund-wise:`);
        for (const fund of analysis.performance.fundPerformance) {
          console.log(
            `     - ${
              fund.fundName
            }: ₹${fund.totalInvested.toLocaleString()} → ₹${fund.currentValue.toLocaleString()} (${
              fund.absoluteReturnPercent
            }%)`
          );
        }

        console.log(`\n  🎯 Asset Allocation:`);
        for (const [asset, pct] of Object.entries(
          analysis.diversification.assetAllocation
        )) {
          console.log(`     - ${asset}: ${pct}%`);
        }

        if (scenarioPassed) {
          console.log(`\n  ✅ PASSED`);
          passed++;
        } else {
          console.log(`\n  ❌ FAILED`);
          failed++;
        }
      } catch (error) {
        console.log(`  ❌ ERROR: ${error.message}`);
        failed++;
      }
    }

    console.log("\n" + "═".repeat(60));
    console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
    console.log("═".repeat(60) + "\n");

    // ═══════════════════════════════════════════════════════════════
    // DIRECT PERFORMANCE TESTS (SIP + Lumpsum combinations)
    // ═══════════════════════════════════════════════════════════════
    console.log("\n🔬 Direct Performance Tests (SIP + Lumpsum)");
    console.log("═".repeat(60));

    // Test: Same Fund with SIP + Lumpsum
    console.log("\n📋 Direct Test: Same Fund SIP + Lumpsum");
    console.log("-".repeat(50));

    const directTestFunds = [
      {
        assetName: "ICICI Prudential Flexi Cap Fund",
        assetType: "Mutual Fund",
        sips: [
          { amount: 5000, startMonth: 1, startYear: 2024, isOngoing: true },
        ],
        lumpsums: [{ amount: 50000, month: 1, year: 2024 }],
      },
    ];

    const fundNames = directTestFunds.map((f) => f.assetName);
    const [navData, fundMeta, templates] = await Promise.all([
      fetchNavData(fundNames),
      fetchFundMetadata(fundNames),
      fetchHoldingTemplates(),
    ]);

    const perfResult = analyzePerformance(directTestFunds, navData);
    const divResult = analyzeDiversification(
      directTestFunds,
      fundMeta,
      templates
    );

    console.log(`  📊 Performance Summary:`);
    console.log(
      `     Total Invested: ₹${perfResult.summary.totalInvested.toLocaleString()}`
    );
    console.log(
      `     Current Value: ₹${perfResult.summary.currentValue.toLocaleString()}`
    );
    console.log(`     Return: ${perfResult.summary.absoluteReturnPercent}%`);
    console.log(`     XIRR: ${perfResult.summary.xirr}%`);

    const fund = perfResult.fundPerformance[0];
    console.log(`\n  📈 Fund Details:`);
    console.log(`     Fund: ${fund.fundName}`);
    console.log(`     SIP Count: ${fund.sipCount}`);
    console.log(`     Lumpsum Count: ${fund.lumpsumCount}`);
    console.log(`     Total Invested: ₹${fund.totalInvested.toLocaleString()}`);
    console.log(`     Current Value: ₹${fund.currentValue.toLocaleString()}`);
    console.log(`     Return: ${fund.absoluteReturnPercent}%`);

    // Verify both SIP and Lumpsum were counted
    const sipLumpsumPass = fund.sipCount === 1 && fund.lumpsumCount === 1;
    const investedPass = fund.totalInvested > 0;
    const returnPass = fund.currentValue > 0;

    console.log(`\n  🔍 Verification:`);
    console.log(
      `     ${sipLumpsumPass ? "✅" : "❌"} SIP + Lumpsum both counted: SIP=${
        fund.sipCount
      }, Lumpsum=${fund.lumpsumCount}`
    );
    console.log(
      `     ${
        investedPass ? "✅" : "❌"
      } Total invested positive: ₹${fund.totalInvested.toLocaleString()}`
    );
    console.log(
      `     ${
        returnPass ? "✅" : "❌"
      } Current value positive: ₹${fund.currentValue.toLocaleString()}`
    );

    if (sipLumpsumPass && investedPass && returnPass) {
      console.log(`\n  ✅ DIRECT TEST PASSED`);
    } else {
      console.log(`\n  ❌ DIRECT TEST FAILED`);
    }

    // Test: Multiple Funds with Mixed Investments
    console.log("\n📋 Direct Test: Multiple Funds with Mixed SIP + Lumpsum");
    console.log("-".repeat(50));

    const mixedFunds = [
      {
        assetName: "Axis Bluechip Fund",
        assetType: "Mutual Fund",
        sips: [
          { amount: 10000, startMonth: 1, startYear: 2024, isOngoing: true },
        ],
        lumpsums: [],
      },
      {
        assetName: "SBI Small Cap Fund",
        assetType: "Mutual Fund",
        sips: [],
        lumpsums: [{ amount: 100000, month: 3, year: 2024 }],
      },
      {
        assetName: "HDFC Mid-Cap Opportunities Fund",
        assetType: "Mutual Fund",
        sips: [
          { amount: 5000, startMonth: 2, startYear: 2024, isOngoing: true },
        ],
        lumpsums: [{ amount: 25000, month: 1, year: 2024 }],
      },
    ];

    const mixedFundNames = mixedFunds.map((f) => f.assetName);
    const [mixedNavData, mixedFundMeta, mixedTemplates] = await Promise.all([
      fetchNavData(mixedFundNames),
      fetchFundMetadata(mixedFundNames),
      fetchHoldingTemplates(),
    ]);

    const mixedPerfResult = analyzePerformance(mixedFunds, mixedNavData);
    const mixedDivResult = analyzeDiversification(
      mixedFunds,
      mixedFundMeta,
      mixedTemplates
    );

    console.log(`  📊 Portfolio Summary:`);
    console.log(`     Total Funds: ${mixedPerfResult.fundPerformance.length}`);
    console.log(
      `     Total Invested: ₹${mixedPerfResult.summary.totalInvested.toLocaleString()}`
    );
    console.log(
      `     Current Value: ₹${mixedPerfResult.summary.currentValue.toLocaleString()}`
    );
    console.log(
      `     Return: ${mixedPerfResult.summary.absoluteReturnPercent}%`
    );

    console.log(`\n  📈 Fund-wise:`);
    for (const f of mixedPerfResult.fundPerformance) {
      console.log(
        `     - ${f.fundName}: SIP=${f.sipCount}, Lumpsum=${
          f.lumpsumCount
        }, Invested=₹${f.totalInvested.toLocaleString()}, Return=${
          f.absoluteReturnPercent
        }%`
      );
    }

    console.log(`\n  🎯 Asset Allocation:`);
    for (const [asset, pct] of Object.entries(mixedDivResult.assetAllocation)) {
      console.log(`     - ${asset}: ${pct}%`);
    }

    // Verify all 3 funds were processed
    const allFundsProcessed = mixedPerfResult.fundPerformance.length === 3;
    const allHaveValue = mixedPerfResult.fundPerformance.every(
      (f) => f.totalInvested > 0 && f.currentValue > 0
    );

    console.log(`\n  🔍 Verification:`);
    console.log(
      `     ${allFundsProcessed ? "✅" : "❌"} All 3 funds processed`
    );
    console.log(
      `     ${
        allHaveValue ? "✅" : "❌"
      } All funds have positive invested and current value`
    );

    if (allFundsProcessed && allHaveValue) {
      console.log(`\n  ✅ MIXED FUNDS TEST PASSED`);
    } else {
      console.log(`\n  ❌ MIXED FUNDS TEST FAILED`);
    }

    console.log("\n" + "═".repeat(60));
  } catch (error) {
    console.error("Fatal error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

runTests();
