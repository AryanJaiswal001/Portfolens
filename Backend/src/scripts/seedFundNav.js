/**
 * Seed Fund NAV Data
 *
 * Populates FundNAV collection with 12 months of historical NAV data
 * Period: Jan 2024 → Dec 2024
 *
 * Usage:
 *   npm run seed:nav           # Seed sample portfolio funds only
 *   npm run seed:nav:all       # Seed all funds
 *   npm run seed:nav -- --all  # Alternative for all funds
 *
 * Options:
 *   --all     Seed all funds (sample + additional)
 *   --clean   Clear existing NAV data before seeding
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import FundNAV from "../models/FundNAVModel.js";
import FundReference from "../models/FundReferenceModel.js";
import {
  getSamplePortfolioNavSeedData,
  getAllFundNavSeedData,
  SAMPLE_PORTFOLIO_NAV_DATA,
  ADDITIONAL_FUNDS_NAV_DATA,
} from "../utils/FundNavSeed.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI environment variable is not set");
  console.error("   Please set MONGODB_URI in your .env file");
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const seedAll = args.includes("--all");
const cleanFirst = args.includes("--clean");

async function seedFundNav() {
  console.log("\n🌱 Fund NAV Seeding Script");
  console.log("═".repeat(50));
  console.log(`Mode: ${seedAll ? "ALL FUNDS" : "SAMPLE PORTFOLIO ONLY"}`);
  console.log(`Clean: ${cleanFirst ? "Yes" : "No"}`);
  console.log("");

  try {
    // Connect to MongoDB
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Optionally clean existing data
    if (cleanFirst) {
      console.log("🧹 Cleaning existing NAV data...");
      const deleteResult = await FundNAV.deleteMany({});
      console.log(`   Deleted ${deleteResult.deletedCount} existing records\n`);
    }

    // Get seed data
    const navRecords = seedAll
      ? getAllFundNavSeedData()
      : getSamplePortfolioNavSeedData();

    const fundCount = seedAll
      ? SAMPLE_PORTFOLIO_NAV_DATA.length + ADDITIONAL_FUNDS_NAV_DATA.length
      : SAMPLE_PORTFOLIO_NAV_DATA.length;

    console.log(
      `📊 Seeding NAV data for ${fundCount} funds (${navRecords.length} records)...\n`
    );

    // Validate fund names against FundReference
    const fundNames = [...new Set(navRecords.map((r) => r.fundName))];
    const existingFunds = await FundReference.find({
      fundName: { $in: fundNames },
    })
      .select("fundName")
      .lean();
    const existingFundNames = new Set(existingFunds.map((f) => f.fundName));

    const missingFunds = fundNames.filter(
      (name) => !existingFundNames.has(name)
    );
    if (missingFunds.length > 0) {
      console.log("⚠️  Warning: Some funds not found in FundReference:");
      missingFunds.forEach((name) => console.log(`   - ${name}`));
      console.log("   (NAV data will still be seeded)\n");
    }

    // Bulk upsert NAV records
    console.log("💾 Inserting NAV records...");
    const result = await FundNAV.bulkUpsertNav(navRecords);

    console.log(`   ✅ Inserted: ${result.upsertedCount}`);
    console.log(`   🔄 Updated: ${result.modifiedCount}`);
    console.log(`   📝 Matched: ${result.matchedCount}\n`);

    // Verification
    console.log("🔍 Verification:");
    const totalRecords = await FundNAV.countDocuments();
    const uniqueFunds = await FundNAV.distinct("fundName");
    const dateRange = await FundNAV.aggregate([
      {
        $group: {
          _id: null,
          minDate: { $min: "$date" },
          maxDate: { $max: "$date" },
        },
      },
    ]);

    console.log(`   Total NAV records: ${totalRecords}`);
    console.log(`   Unique funds: ${uniqueFunds.length}`);
    if (dateRange.length > 0) {
      console.log(
        `   Date range: ${dateRange[0].minDate} → ${dateRange[0].maxDate}`
      );
    }

    // Sample output for verification
    console.log("\n📈 Sample NAV Series (first 3 funds):\n");

    const sampleFunds = uniqueFunds.slice(0, 3);
    for (const fundName of sampleFunds) {
      const navSeries = await FundNAV.getNavSeries(fundName);
      const months = Object.keys(navSeries).sort();
      const startNav = navSeries[months[0]];
      const endNav = navSeries[months[months.length - 1]];
      const returnPct = (((endNav - startNav) / startNav) * 100).toFixed(2);

      console.log(`   ${fundName}`);
      console.log(`   ├─ Start (${months[0]}): ₹${startNav.toFixed(4)}`);
      console.log(
        `   ├─ End (${months[months.length - 1]}): ₹${endNav.toFixed(4)}`
      );
      console.log(`   └─ Return: ${returnPct}%\n`);
    }

    console.log("═".repeat(50));
    console.log("✅ Fund NAV seeding completed successfully!\n");
  } catch (error) {
    console.error("\n❌ Error seeding Fund NAV data:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("📡 Disconnected from MongoDB");
  }
}

// Run the script
seedFundNav();
