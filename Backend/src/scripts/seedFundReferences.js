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
import fundReferenceSeedData from "../utils/FundReferenceSeed.js";

/**
 * Seed Script for FundReference Collection
 *
 * Run: npm run seed:funds
 *
 * This script:
 * 1. Connects to MongoDB
 * 2. Clears existing fund references (optional)
 * 3. Inserts seed data using upsert
 * 4. Displays summary statistics
 */

async function seedFundReferences() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB\n");

    // Check for --clear flag
    const shouldClear = process.argv.includes("--clear");

    if (shouldClear) {
      console.log("🗑️  Clearing existing fund references...");
      await FundReference.deleteMany({});
      console.log("✅ Cleared existing data\n");
    }

    console.log("🌱 Starting FundReference seed...");
    console.log(`📦 Seeding ${fundReferenceSeedData.length} funds...\n`);

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const fund of fundReferenceSeedData) {
      try {
        const result = await FundReference.findOneAndUpdate(
          { fundName: fund.fundName },
          { ...fund, isActive: true },
          {
            upsert: true,
            new: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          }
        );

        // Check if created or updated
        const isNew = result.createdAt.getTime() === result.updatedAt.getTime();

        if (isNew) {
          created++;
          console.log(`  ✅ Created: ${fund.fundName}`);
        } else {
          updated++;
          console.log(`  🔄 Updated: ${fund.fundName}`);
        }
      } catch (err) {
        errors++;
        console.error(`  ❌ Error with ${fund.fundName}:`, err.message);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 SEED SUMMARY");
    console.log("=".repeat(50));
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Errors:  ${errors}`);
    console.log(`   Total:   ${fundReferenceSeedData.length}`);

    // Statistics
    console.log("\n" + "=".repeat(50));
    console.log("📈 FUND STATISTICS");
    console.log("=".repeat(50));

    // By Asset Type
    const assetTypes = await FundReference.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$assetType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log("\n🏷️  By Asset Type:");
    assetTypes.forEach((type) => {
      console.log(`   ${type._id.padEnd(10)} : ${type.count} funds`);
    });

    // By Category
    const categories = await FundReference.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log("\n📂 By Category:");
    categories.forEach((cat) => {
      console.log(`   ${cat._id.padEnd(20)} : ${cat.count} funds`);
    });

    // By AMC
    const amcs = await FundReference.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$amc", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log("\n🏢 By AMC:");
    amcs.forEach((amc) => {
      console.log(`   ${amc._id.padEnd(15)} : ${amc.count} funds`);
    });

    // Sample document
    console.log("\n" + "=".repeat(50));
    console.log("📄 SAMPLE DOCUMENT");
    console.log("=".repeat(50));

    const sample = await FundReference.findOne({ popularityRank: 1 });
    console.log(JSON.stringify(sample, null, 2));

    console.log("\n✅ Seed completed successfully!\n");
  } catch (error) {
    console.error("\n❌ Seed failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run seed
seedFundReferences();
