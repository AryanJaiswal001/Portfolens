import mongoose from "mongoose";

/**
 * Portfolio Model
 *
 * Stores user's investment portfolio data
 * - Linked to user via userId
 * - Contains array of funds with raw investment data
 * - No calculations stored - those happen at query time
 */

const lumpsumSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: [true, "Lumpsum year is required"],
    },
    amount: {
      type: Number,
      required: [true, "Lumpsum amount is required"],
      min: [0, "Amount cannot be negative"],
    },
  },
  { _id: false }
);

const fundSchema = new mongoose.Schema(
  {
    assetType: {
      type: String,
      required: [true, "Asset type is required"],
      enum: [
        "Mutual Fund",
        "Stock",
        "ETF",
        "Bond",
        "FD",
        "Gold",
        "Real Estate",
        "Other",
      ],
    },
    assetName: {
      type: String,
      required: [true, "Asset name is required"],
      trim: true,
      maxlength: [200, "Asset name cannot exceed 200 characters"],
    },
    investmentStartYear: {
      type: Number,
      required: [true, "Investment start year is required"],
      min: [1990, "Start year must be 1990 or later"],
      max: [new Date().getFullYear(), "Start year cannot be in the future"],
    },
    sip: {
      type: Number,
      default: null,
      min: [0, "SIP amount cannot be negative"],
    },
    lumpsums: {
      type: [lumpsumSchema],
      default: [],
    },
  },
  { _id: true }
);

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Portfolio name is required"],
      trim: true,
      maxlength: [100, "Portfolio name cannot exceed 100 characters"],
      default: "My Portfolio",
    },
    funds: {
      type: [fundSchema],
      validate: {
        validator: function (funds) {
          return funds.length > 0;
        },
        message: "Portfolio must have at least one fund",
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for faster user portfolio queries
portfolioSchema.index({ userId: 1, createdAt: -1 });

/**
 * Transform output for JSON responses
 */
portfolioSchema.methods.toJSON = function () {
  const portfolio = this.toObject();
  delete portfolio.__v;
  return portfolio;
};

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
