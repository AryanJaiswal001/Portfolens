import mongoose from "mongoose";

/**
 * Portfolio Model
 *
 * Stores user's investment portfolio data
 * - Linked to user via userId
 * - Contains array of funds with raw investment data
 * - Supports multiple SIPs and lumpsums per fund
 * - No calculations stored - those happen at query time via analysis services
 */

/**
 * SIP Entry Schema
 * Each SIP is an independent cashflow stream
 */
const sipEntrySchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "SIP amount is required"],
      min: [0, "SIP amount cannot be negative"],
    },
    startMonth: {
      type: Number,
      required: [true, "Start month is required"],
      min: 1,
      max: 12,
    },
    startYear: {
      type: Number,
      required: [true, "Start year is required"],
      min: 1990,
      max: new Date().getFullYear(),
    },
    isOngoing: {
      type: Boolean,
      default: true,
    },
    // Only required if isOngoing is false
    endMonth: {
      type: Number,
      min: 1,
      max: 12,
      default: null,
    },
    endYear: {
      type: Number,
      min: 1990,
      default: null,
    },
  },
  { _id: true }
);

/**
 * Lumpsum Entry Schema
 * Each lumpsum is a one-time investment
 */
const lumpsumEntrySchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Lumpsum amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    month: {
      type: Number,
      required: [true, "Investment month is required"],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, "Investment year is required"],
      min: 1990,
      max: new Date().getFullYear(),
    },
  },
  { _id: true }
);

/**
 * Fund Schema
 * Each fund can have multiple SIPs and lumpsums
 */
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
    // Multiple SIP entries (each is an independent cashflow)
    sips: {
      type: [sipEntrySchema],
      default: [],
    },
    // Multiple lumpsum entries
    lumpsums: {
      type: [lumpsumEntrySchema],
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
    // Track if this is a sample/demo portfolio
    isSample: {
      type: Boolean,
      default: false,
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
