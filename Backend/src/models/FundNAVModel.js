/**
 * FundNAV Model
 *
 * Stores historical monthly NAV data for mutual funds.
 * This is READ-ONLY reference data - not user-editable.
 *
 * Key Format: YYYY-MM (e.g., "2024-01", "2024-12")
 * NAV utilities consume this data for calculations.
 */

import mongoose from "mongoose";

const fundNAVSchema = new mongoose.Schema(
  {
    // Fund name - must match FundReference.fundName exactly
    fundName: {
      type: String,
      required: [true, "Fund name is required"],
      trim: true,
      index: true,
    },

    // Month in YYYY-MM format
    date: {
      type: String,
      required: [true, "Date is required"],
      match: [/^\d{4}-\d{2}$/, "Date must be in YYYY-MM format"],
      index: true,
    },

    // NAV value (Net Asset Value per unit)
    nav: {
      type: Number,
      required: [true, "NAV is required"],
      min: [0, "NAV cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one NAV per fund per month
fundNAVSchema.index({ fundName: 1, date: 1 }, { unique: true });

// Index for efficient time-series queries
fundNAVSchema.index({ date: -1 });

/**
 * Static method: Get NAV series for a fund
 * Returns object in format { "YYYY-MM": nav }
 */
fundNAVSchema.statics.getNavSeries = async function (fundName) {
  const records = await this.find({ fundName })
    .select("date nav -_id")
    .sort({ date: 1 })
    .lean();

  const navData = {};
  for (const record of records) {
    navData[record.date] = record.nav;
  }

  return navData;
};

/**
 * Static method: Get NAV for specific month
 */
fundNAVSchema.statics.getNavForMonth = async function (fundName, date) {
  const record = await this.findOne({ fundName, date }).lean();
  return record ? record.nav : null;
};

/**
 * Static method: Get latest NAV for a fund
 */
fundNAVSchema.statics.getLatestNav = async function (fundName) {
  const record = await this.findOne({ fundName }).sort({ date: -1 }).lean();
  return record;
};

/**
 * Static method: Get NAV series for multiple funds
 * Returns { fundName: { date: nav } }
 */
fundNAVSchema.statics.getMultipleFundNavs = async function (fundNames) {
  const records = await this.find({ fundName: { $in: fundNames } })
    .select("fundName date nav -_id")
    .sort({ fundName: 1, date: 1 })
    .lean();

  const result = {};
  for (const record of records) {
    if (!result[record.fundName]) {
      result[record.fundName] = {};
    }
    result[record.fundName][record.date] = record.nav;
  }

  return result;
};

/**
 * Static method: Bulk upsert NAV data
 * Used by seed scripts
 */
fundNAVSchema.statics.bulkUpsertNav = async function (navRecords) {
  const operations = navRecords.map((record) => ({
    updateOne: {
      filter: { fundName: record.fundName, date: record.date },
      update: { $set: record },
      upsert: true,
    },
  }));

  return this.bulkWrite(operations);
};

const FundNAV = mongoose.model("FundNAV", fundNAVSchema);

export default FundNAV;
