import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

import FundReference from "../models/FundReferenceModel.js";
import HoldingTemplate from "../models/HoldingTemplateModel.js";

/**
 * Validation Script: Verify Fund → Template Mapping
 *
 * Checks:
 * 1. 100% of funds have holdingTemplateKey
 * 2. All template keys are valid (exist in HoldingTemplate)
 * 3. No orphan templates (templates with no funds)
 * 4. Distribution is reasonable
 */

const VALID_TEMPLATE_KEYS = [
  "LARGE_CAP_EQUITY",
  "MID_CAP_EQUITY",
  "SMALL_CAP_EQUITY",
  "FLEXI_CAP_EQUITY",
  "INDEX_EQUITY",
  "HYBRID_EQUITY",
  "DEBT_CORPORATE_BOND",
  "DEBT_SHORT_DURATION",
  "GOLD",
];

async function validateFundTemplateMapping() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB\n");

    console.log("=".repeat(60));
    console.log("🔍 FUND → TEMPLATE MAPPING VALIDATION");
    console.log("=".repeat(60));

    const results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      details: [],
    };

    // ==================
    // TEST 1: All funds have holdingTemplateKey
    // ==================
    console.log("\n📋 Test 1: All funds have holdingTemplateKey");

    const totalFunds = await FundReference.countDocuments({ isActive: true });
    const fundsWithTemplate = await FundReference.countDocuments({
      isActive: true,
      holdingTemplateKey: { $exists: true, $ne: null, $ne: "" },
    });
    const fundsWithoutTemplate = totalFunds - fundsWithTemplate;

    if (fundsWithoutTemplate === 0) {
      console.log(
        `   ✅ PASS: ${fundsWithTemplate}/${totalFunds} funds have template key`
      );
      results.passed++;
    } else {
      console.log(
        `   ❌ FAIL: ${fundsWithoutTemplate} funds missing template key`
      );
      results.failed++;

      // List funds without template
      const unmapped = await FundReference.find({
        isActive: true,
        $or: [
          { holdingTemplateKey: { $exists: false } },
          { holdingTemplateKey: null },
          { holdingTemplateKey: "" },
        ],
      }).select("fundName category");

      unmapped.forEach((f) => {
        console.log(`      - ${f.fundName} (${f.category})`);
      });
    }

    // ==================
    // TEST 2: All template keys are valid
    // ==================
    console.log("\n📋 Test 2: All template keys are valid");

    const fundsWithInvalidKey = await FundReference.find({
      isActive: true,
      holdingTemplateKey: { $nin: VALID_TEMPLATE_KEYS },
    }).select("fundName holdingTemplateKey");

    if (fundsWithInvalidKey.length === 0) {
      console.log(`   ✅ PASS: All template keys are valid`);
      results.passed++;
    } else {
      console.log(
        `   ❌ FAIL: ${fundsWithInvalidKey.length} funds have invalid template key`
      );
      results.failed++;

      fundsWithInvalidKey.forEach((f) => {
        console.log(`      - ${f.fundName}: "${f.holdingTemplateKey}"`);
      });
    }

    // ==================
    // TEST 3: Template distribution
    // ==================
    console.log("\n📋 Test 3: Template distribution");

    const distribution = await FundReference.aggregate([
      { $match: { isActive: true, holdingTemplateKey: { $exists: true } } },
      { $group: { _id: "$holdingTemplateKey", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log(`   📊 Distribution by template:`);

    let hasEmptyTemplates = false;
    VALID_TEMPLATE_KEYS.forEach((key) => {
      const found = distribution.find((d) => d._id === key);
      const count = found ? found.count : 0;

      if (count === 0) {
        hasEmptyTemplates = true;
        console.log(`      ⚠️  ${key.padEnd(25)}: ${count} funds (unused)`);
      } else {
        console.log(`      ✅ ${key.padEnd(25)}: ${count} funds`);
      }
    });

    if (hasEmptyTemplates) {
      console.log(`   ⚠️  WARNING: Some templates have no funds mapped`);
      results.warnings++;
    } else {
      console.log(`   ✅ PASS: All templates have at least one fund`);
      results.passed++;
    }

    // ==================
    // TEST 4: Category-Template consistency
    // ==================
    console.log("\n📋 Test 4: Category-Template consistency");

    const expectedMappings = {
      "Large Cap": "LARGE_CAP_EQUITY",
      "Mid Cap": "MID_CAP_EQUITY",
      "Small Cap": "SMALL_CAP_EQUITY",
      "Flexi Cap": "FLEXI_CAP_EQUITY",
      Index: "INDEX_EQUITY",
      Hybrid: "HYBRID_EQUITY",
      "Corporate Bond": "DEBT_CORPORATE_BOND",
      "Short Duration": "DEBT_SHORT_DURATION",
      "Medium Duration": "DEBT_SHORT_DURATION",
      "Dynamic Bond": "DEBT_SHORT_DURATION",
      Gold: "GOLD",
    };

    let inconsistencies = 0;

    for (const [category, expectedKey] of Object.entries(expectedMappings)) {
      const mismatchedFunds = await FundReference.find({
        isActive: true,
        category: category,
        holdingTemplateKey: { $ne: expectedKey },
      }).select("fundName holdingTemplateKey");

      if (mismatchedFunds.length > 0) {
        inconsistencies += mismatchedFunds.length;
        console.log(`   ❌ ${category} → expected ${expectedKey}`);
        mismatchedFunds.forEach((f) => {
          console.log(`      - ${f.fundName}: has "${f.holdingTemplateKey}"`);
        });
      }
    }

    if (inconsistencies === 0) {
      console.log(`   ✅ PASS: All category-template mappings are consistent`);
      results.passed++;
    } else {
      console.log(`   ❌ FAIL: ${inconsistencies} inconsistent mappings found`);
      results.failed++;
    }

    // ==================
    // SUMMARY
    // ==================
    console.log("\n" + "=".repeat(60));
    console.log("📊 VALIDATION SUMMARY");
    console.log("=".repeat(60));
    console.log(`\n   Tests Passed:  ${results.passed} ✅`);
    console.log(`   Tests Failed:  ${results.failed} ❌`);
    console.log(`   Warnings:      ${results.warnings} ⚠️`);
    console.log(`\n   Total Funds:   ${totalFunds}`);
    console.log(`   Mapped:        ${fundsWithTemplate}`);
    console.log(
      `   Coverage:      ${((fundsWithTemplate / totalFunds) * 100).toFixed(
        1
      )}%`
    );

    if (results.failed === 0) {
      console.log("\n   🎉 ALL VALIDATIONS PASSED!");
    } else {
      console.log("\n   ⚠️  SOME VALIDATIONS FAILED - Please fix issues above");
    }

    console.log("\n");
  } catch (error) {
    console.error("\n❌ Validation failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run validation
validateFundTemplateMapping();
