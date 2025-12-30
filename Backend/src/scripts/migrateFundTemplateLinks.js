import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

import FundReference from "../models/FundReferenceModel.js";

/**
 * Category to HoldingTemplateKey Mapping
 *
 * STRICT: Only category-based mapping
 * NO fund-specific overrides
 * NO complex logic
 */
const CATEGORY_TO_TEMPLATE_MAP = {
  // Equity categories
  "Large Cap": "LARGE_CAP_EQUITY",
  "Mid Cap": "MID_CAP_EQUITY",
  "Small Cap": "SMALL_CAP_EQUITY",
  "Flexi Cap": "FLEXI_CAP_EQUITY",
  Index: "INDEX_EQUITY",

  // Hybrid category
  Hybrid: "HYBRID_EQUITY",

  // Debt categories
  "Corporate Bond": "DEBT_CORPORATE_BOND",
  "Short Duration": "DEBT_SHORT_DURATION",
  "Medium Duration": "DEBT_SHORT_DURATION", // Maps to short duration as per requirements
  "Dynamic Bond": "DEBT_SHORT_DURATION", // Maps to short duration

  // Gold category
  Gold: "GOLD",
};

/**
 * Get template key from category
 * Pure category-based lookup, no exceptions
 */
function getTemplateKeyForCategory(category) {
  return CATEGORY_TO_TEMPLATE_MAP[category] || null;
}

/**
 * Migration Script: Link FundReference to HoldingTemplate
 *
 * This script:
 * 1. Reads all FundReference documents
 * 2. Determines holdingTemplateKey from category
 * 3. Updates each document
 * 4. Reports mapping statistics
 */
async function migrateFundTemplateLinks() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB\n");

    console.log("=".repeat(60));
    console.log("🔗 FUND → TEMPLATE MAPPING MIGRATION");
    console.log("=".repeat(60));
    console.log("\n📋 Mapping Rules:");
    Object.entries(CATEGORY_TO_TEMPLATE_MAP).forEach(([cat, key]) => {
      console.log(`   ${cat.padEnd(20)} → ${key}`);
    });
    console.log("\n");

    // Get all funds
    const funds = await FundReference.find({});
    console.log(`📦 Found ${funds.length} funds to process\n`);

    if (funds.length === 0) {
      console.log("⚠️  No funds found. Run seed:funds first.");
      return;
    }

    // Tracking
    const stats = {
      total: funds.length,
      mapped: 0,
      unmapped: 0,
      errors: 0,
      byTemplate: {},
      unmappedFunds: [],
    };

    // Process each fund
    console.log("🔄 Processing funds...\n");

    for (const fund of funds) {
      try {
        const templateKey = getTemplateKeyForCategory(fund.category);

        if (templateKey) {
          // Update fund with template key
          await FundReference.findByIdAndUpdate(
            fund._id,
            { holdingTemplateKey: templateKey },
            { runValidators: true }
          );

          stats.mapped++;
          stats.byTemplate[templateKey] =
            (stats.byTemplate[templateKey] || 0) + 1;

          console.log(`   ✅ ${fund.fundName}`);
          console.log(`      Category: ${fund.category} → ${templateKey}`);
        } else {
          stats.unmapped++;
          stats.unmappedFunds.push({
            name: fund.fundName,
            category: fund.category,
          });

          console.log(`   ⚠️  ${fund.fundName}`);
          console.log(`      Category: ${fund.category} → NO MAPPING`);
        }
      } catch (err) {
        stats.errors++;
        console.error(`   ❌ Error with ${fund.fundName}:`, err.message);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 MIGRATION SUMMARY");
    console.log("=".repeat(60));
    console.log(`\n   Total Funds:    ${stats.total}`);
    console.log(`   Mapped:         ${stats.mapped} ✅`);
    console.log(`   Unmapped:       ${stats.unmapped} ⚠️`);
    console.log(`   Errors:         ${stats.errors} ❌`);
    console.log(
      `   Coverage:       ${((stats.mapped / stats.total) * 100).toFixed(1)}%`
    );

    // By Template breakdown
    console.log("\n📈 Mapping by Template:");
    Object.entries(stats.byTemplate)
      .sort((a, b) => b[1] - a[1])
      .forEach(([template, count]) => {
        console.log(`   ${template.padEnd(25)} : ${count} funds`);
      });

    // Unmapped funds warning
    if (stats.unmappedFunds.length > 0) {
      console.log("\n⚠️  Unmapped Funds (need mapping rule):");
      stats.unmappedFunds.forEach((f) => {
        console.log(`   - ${f.name} (Category: ${f.category})`);
      });
    }

    // Validation
    console.log("\n" + "=".repeat(60));
    console.log("🔍 VALIDATION");
    console.log("=".repeat(60));

    // Check for funds without holdingTemplateKey
    const fundsWithoutTemplate = await FundReference.countDocuments({
      $or: [
        { holdingTemplateKey: { $exists: false } },
        { holdingTemplateKey: null },
        { holdingTemplateKey: "" },
      ],
    });

    // Check for invalid template keys
    const validKeys = Object.values(CATEGORY_TO_TEMPLATE_MAP);
    const fundsWithInvalidKey = await FundReference.countDocuments({
      holdingTemplateKey: { $nin: [...validKeys, null, ""] },
    });

    console.log(`\n   Funds without template: ${fundsWithoutTemplate}`);
    console.log(`   Funds with invalid key: ${fundsWithInvalidKey}`);

    if (fundsWithoutTemplate === 0 && fundsWithInvalidKey === 0) {
      console.log("\n   ✅ All validations passed!");
    } else {
      console.log(
        "\n   ⚠️  Some validations failed. Check unmapped funds above."
      );
    }

    console.log("\n✅ Migration completed!\n");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run migration
migrateFundTemplateLinks();
