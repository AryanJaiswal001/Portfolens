import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

import HoldingTemplate from "../models/HoldingTemplateModel.js";
import holdingTemplateSeedData from "../utils/HoldingTemplateSeed.js";

/**
 * Seed Script for HoldingTemplate Collection
 *
 * Run: npm run seed:templates
 *
 * This script:
 * 1. Connects to MongoDB
 * 2. Clears existing templates (optional with --clear)
 * 3. Inserts seed data using upsert
 * 4. Displays summary statistics
 */

async function seedHoldingTemplates() {
  try {
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
      console.log("🗑️  Clearing existing holding templates...");
      await HoldingTemplate.deleteMany({});
      console.log("✅ Cleared existing data\n");
    }

    console.log("=".repeat(50));
    console.log("🌱 HOLDING TEMPLATE SEED");
    console.log("=".repeat(50));
    console.log(
      `\n📦 Seeding ${holdingTemplateSeedData.length} templates...\n`
    );

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const template of holdingTemplateSeedData) {
      try {
        const result = await HoldingTemplate.findOneAndUpdate(
          { templateKey: template.templateKey },
          { ...template, isActive: true },
          {
            upsert: true,
            new: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          }
        );

        const isNew = result.createdAt.getTime() === result.updatedAt.getTime();

        if (isNew) {
          created++;
          console.log(`   ✅ Created: ${template.templateKey}`);
        } else {
          updated++;
          console.log(`   🔄 Updated: ${template.templateKey}`);
        }
      } catch (err) {
        errors++;
        console.error(`   ❌ Error with ${template.templateKey}:`, err.message);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 SEED SUMMARY");
    console.log("=".repeat(50));
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Errors:  ${errors}`);
    console.log(`   Total:   ${holdingTemplateSeedData.length}`);

    // Statistics
    console.log("\n" + "=".repeat(50));
    console.log("📈 TEMPLATE STATISTICS");
    console.log("=".repeat(50));

    const byAssetType = await HoldingTemplate.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$assetType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log("\n🏷️  By Asset Type:");
    byAssetType.forEach((type) => {
      console.log(`   ${type._id.padEnd(10)} : ${type.count} templates`);
    });

    // List all templates
    console.log("\n📋 All Templates:");
    const allTemplates = await HoldingTemplate.find({ isActive: true }).sort({
      templateKey: 1,
    });
    allTemplates.forEach((t) => {
      console.log(
        `   ${t.templateKey.padEnd(25)} (${t.assetType} - ${t.category})`
      );
    });

    // Sample document
    console.log("\n" + "=".repeat(50));
    console.log("📄 SAMPLE DOCUMENT");
    console.log("=".repeat(50));

    const sample = await HoldingTemplate.findOne({
      templateKey: "LARGE_CAP_EQUITY",
    });
    if (sample) {
      const sampleObj = sample.toJSON();
      console.log(JSON.stringify(sampleObj, null, 2));
    }

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
seedHoldingTemplates();
