import mongoose from "mongoose";

/**
 * FundReference Model
 *
 * Stores STATIC metadata about mutual funds
 * This is REFERENCE data - not user data
 *
 * Purpose:
 * - Asset allocation analysis
 * - Category clustering
 * - Diversification analysis
 * - Over-diversification warnings
 * - Fund suggestions
 *
 * This schema answers: "What IS this fund?"
 * It does NOT answer: "How did it perform?"
 *
 * ⚠️ This data should:
 * - NOT be editable by users
 * - NOT be modified at runtime
 * - ONLY be read by the analysis engine
 */

const fundReferenceSchema = new mongoose.Schema(
  {
    // Optional internal identifier
    fundCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },

    // Fund name (required, unique)
    fundName: {
      type: String,
      required: [true, "Fund name is required"],
      unique: true,
      trim: true,
      maxlength: [200, "Fund name cannot exceed 200 characters"],
    },

    // Primary asset type classification
    assetType: {
      type: String,
      required: [true, "Asset type is required"],
      enum: {
        values: ["Equity", "Debt", "Hybrid", "Gold"],
        message: "Asset type must be Equity, Debt, Hybrid, or Gold",
      },
      index: true,
    },

    // Fund category (more specific classification)
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: [100, "Category cannot exceed 100 characters"],
      index: true,
      // Examples: Large Cap, Mid Cap, Small Cap, Flexi Cap,
      // Index, ELSS, Corporate Bond, Short Duration, etc.
    },

    // Asset Management Company
    amc: {
      type: String,
      required: [true, "AMC is required"],
      trim: true,
      maxlength: [100, "AMC name cannot exceed 100 characters"],
      index: true,
    },

    // Benchmark index
    benchmark: {
      type: String,
      trim: true,
      maxlength: [150, "Benchmark name cannot exceed 150 characters"],
    },

    // Popularity rank (lower = more popular, used for suggestions)
    popularityRank: {
      type: Number,
      default: 999,
      min: 1,
      index: true,
    },

    // Link to HoldingTemplate (category-based mapping)
    holdingTemplateKey: {
      type: String,
      trim: true,
      uppercase: true,
      index: true,
      enum: {
        values: [
          "LARGE_CAP_EQUITY",
          "MID_CAP_EQUITY",
          "SMALL_CAP_EQUITY",
          "FLEXI_CAP_EQUITY",
          "INDEX_EQUITY",
          "HYBRID_EQUITY",
          "DEBT_CORPORATE_BOND",
          "DEBT_SHORT_DURATION",
          "GOLD",
        ],
        message: "Invalid holding template key",
      },
    },

    // Whether this fund is active/available
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

// Compound indexes for common queries
fundReferenceSchema.index({ assetType: 1, category: 1, popularityRank: 1 });
fundReferenceSchema.index({ amc: 1, assetType: 1 });
fundReferenceSchema.index({ fundName: "text" }); // Text search

// ==================
// STATIC METHODS
// ==================

/**
 * Find fund by exact name (case-insensitive)
 */
fundReferenceSchema.statics.findByName = function (fundName) {
  return this.findOne({
    fundName: { $regex: new RegExp(`^${escapeRegex(fundName)}$`, "i") },
    isActive: true,
  });
};

/**
 * Find funds by asset type
 */
fundReferenceSchema.statics.findByAssetType = function (assetType) {
  return this.find({ assetType, isActive: true }).sort({ popularityRank: 1 });
};

/**
 * Find funds by category
 */
fundReferenceSchema.statics.findByCategory = function (category) {
  return this.find({ category, isActive: true }).sort({ popularityRank: 1 });
};

/**
 * Find funds by AMC
 */
fundReferenceSchema.statics.findByAMC = function (amc) {
  return this.find({
    amc: { $regex: new RegExp(escapeRegex(amc), "i") },
    isActive: true,
  }).sort({ popularityRank: 1 });
};

/**
 * Search funds by name (partial match)
 */
fundReferenceSchema.statics.searchByName = function (searchTerm, limit = 10) {
  return this.find({
    fundName: { $regex: new RegExp(escapeRegex(searchTerm), "i") },
    isActive: true,
  })
    .sort({ popularityRank: 1 })
    .limit(limit);
};

/**
 * Get suggestions for similar funds
 * Used when a fund is not found in reference
 */
fundReferenceSchema.statics.getSuggestions = function (
  assetType,
  category = null,
  limit = 5
) {
  const query = { isActive: true };

  if (assetType) {
    query.assetType = assetType;
  }

  if (category) {
    query.category = category;
  }

  return this.find(query)
    .sort({ popularityRank: 1 })
    .limit(limit)
    .select("fundName assetType category amc popularityRank");
};

/**
 * Get category distribution for given fund names
 */
fundReferenceSchema.statics.getCategoryDistribution = async function (
  fundNames
) {
  const normalizedNames = fundNames.map(
    (name) => new RegExp(`^${escapeRegex(name)}$`, "i")
  );

  return this.aggregate([
    {
      $match: {
        fundName: { $in: normalizedNames.map((r) => ({ $regex: r })) },
        isActive: true,
      },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        funds: { $push: "$fundName" },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

/**
 * Get asset type distribution for given fund names
 */
fundReferenceSchema.statics.getAssetTypeDistribution = async function (
  fundNames
) {
  return this.aggregate([
    {
      $match: {
        fundName: { $in: fundNames },
        isActive: true,
      },
    },
    {
      $group: {
        _id: "$assetType",
        count: { $sum: 1 },
        funds: { $push: "$fundName" },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

/**
 * Get all unique categories
 */
fundReferenceSchema.statics.getAllCategories = function () {
  return this.distinct("category", { isActive: true });
};

/**
 * Get all unique AMCs
 */
fundReferenceSchema.statics.getAllAMCs = function () {
  return this.distinct("amc", { isActive: true });
};

/**
 * Validate multiple fund names and return coverage info
 */
fundReferenceSchema.statics.validateFunds = async function (fundNames) {
  const results = {
    fullCoverage: [], // Funds found in reference
    partialCoverage: [], // Funds not found but have known asset type
    unsupported: [], // Completely unknown funds
  };

  for (const name of fundNames) {
    const fund = await this.findOne({
      fundName: { $regex: new RegExp(`^${escapeRegex(name)}$`, "i") },
      isActive: true,
    });

    if (fund) {
      results.fullCoverage.push({
        inputName: name,
        matchedFund: fund,
        analysisCoverage: "full",
      });
    } else {
      // Try to infer asset type from name
      const inferredType = inferAssetTypeFromName(name);

      if (inferredType) {
        results.partialCoverage.push({
          inputName: name,
          inferredAssetType: inferredType,
          analysisCoverage: "partial",
        });
      } else {
        results.unsupported.push({
          inputName: name,
          analysisCoverage: "unsupported",
        });
      }
    }
  }

  return results;
};

// ==================
// INSTANCE METHODS
// ==================

/**
 * Transform output for JSON responses
 */
fundReferenceSchema.methods.toJSON = function () {
  const fund = this.toObject();
  delete fund.__v;
  return fund;
};

// ==================
// HELPER FUNCTIONS
// ==================

/**
 * Escape special regex characters in string
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Infer asset type from fund name
 * Used for partial coverage when fund not in reference
 */
function inferAssetTypeFromName(fundName) {
  const name = fundName.toLowerCase();

  // Equity indicators
  if (
    name.includes("equity") ||
    name.includes("bluechip") ||
    name.includes("large cap") ||
    name.includes("largecap") ||
    name.includes("mid cap") ||
    name.includes("midcap") ||
    name.includes("small cap") ||
    name.includes("smallcap") ||
    name.includes("flexi cap") ||
    name.includes("flexicap") ||
    name.includes("multicap") ||
    name.includes("multi cap") ||
    name.includes("index fund") ||
    name.includes("nifty") ||
    name.includes("sensex") ||
    name.includes("elss") ||
    name.includes("tax saver")
  ) {
    return "Equity";
  }

  // Debt indicators
  if (
    name.includes("debt") ||
    name.includes("bond") ||
    name.includes("gilt") ||
    name.includes("liquid") ||
    name.includes("money market") ||
    name.includes("short term") ||
    name.includes("short duration") ||
    name.includes("medium term") ||
    name.includes("long term") ||
    name.includes("corporate") ||
    name.includes("credit risk") ||
    name.includes("overnight") ||
    name.includes("ultra short")
  ) {
    return "Debt";
  }

  // Hybrid indicators
  if (
    name.includes("hybrid") ||
    name.includes("balanced") ||
    name.includes("aggressive") ||
    name.includes("conservative") ||
    name.includes("dynamic asset") ||
    name.includes("equity savings") ||
    name.includes("arbitrage")
  ) {
    return "Hybrid";
  }

  // Gold indicators
  if (name.includes("gold") || name.includes("precious metal")) {
    return "Gold";
  }

  return null; // Cannot infer
}

const FundReference = mongoose.model("FundReference", fundReferenceSchema);

export default FundReference;
