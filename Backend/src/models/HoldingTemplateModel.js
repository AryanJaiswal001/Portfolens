import mongoose from "mongoose";

/**
 * HoldingTemplate Model
 *
 * Stores category-level holdings templates
 * These are STATIC reference templates, NOT fund-specific data
 *
 * Purpose:
 * - Provide default sector/market cap exposure for fund categories
 * - Power diversification analysis without fund-specific holdings
 * - Enable category-level overlap detection
 *
 * ⚠️ This data should:
 * - NOT be editable by users
 * - NOT be modified at runtime
 * - ONLY be read by the analysis engine
 */

const holdingTemplateSchema = new mongoose.Schema(
  {
    // Unique template identifier (e.g., LARGE_CAP_EQUITY)
    templateKey: {
      type: String,
      required: [true, "Template key is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    // Asset type this template applies to
    assetType: {
      type: String,
      required: [true, "Asset type is required"],
      enum: {
        values: ["Equity", "Debt", "Hybrid", "Gold"],
        message: "Asset type must be Equity, Debt, Hybrid, or Gold",
      },
      index: true,
    },

    // Category this template represents
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },

    // Sector exposure percentages
    sectorExposure: {
      type: Map,
      of: Number,
      default: {},
    },

    // Market cap exposure percentages
    marketCapExposure: {
      LargeCap: { type: Number, default: 0, min: 0, max: 100 },
      MidCap: { type: Number, default: 0, min: 0, max: 100 },
      SmallCap: { type: Number, default: 0, min: 0, max: 100 },
    },

    // Typical holdings (representative, not exhaustive)
    typicalHoldings: [
      {
        type: String,
        trim: true,
      },
    ],

    // Whether this template is active
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==================
// STATIC METHODS
// ==================

/**
 * Find template by key
 */
holdingTemplateSchema.statics.findByKey = function (templateKey) {
  return this.findOne({
    templateKey: templateKey.toUpperCase(),
    isActive: true,
  });
};

/**
 * Get all active templates
 */
holdingTemplateSchema.statics.getAllActive = function () {
  return this.find({ isActive: true }).sort({ templateKey: 1 });
};

/**
 * Get template by category
 */
holdingTemplateSchema.statics.findByCategory = function (category) {
  return this.findOne({
    category,
    isActive: true,
  });
};

/**
 * Transform output for JSON responses
 */
holdingTemplateSchema.methods.toJSON = function () {
  const template = this.toObject();
  delete template.__v;

  // Convert Map to plain object for sectorExposure
  if (template.sectorExposure instanceof Map) {
    template.sectorExposure = Object.fromEntries(template.sectorExposure);
  }

  return template;
};

const HoldingTemplate = mongoose.model(
  "HoldingTemplate",
  holdingTemplateSchema
);

export default HoldingTemplate;
