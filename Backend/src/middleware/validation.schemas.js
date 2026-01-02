/**
 * Validation Schemas
 *
 * Zod schemas for request validation
 * All API inputs must be validated before processing
 */

import { z } from "zod";

// ═══════════════════════════════════════════════════════════════
// COMMON SCHEMAS
// ═══════════════════════════════════════════════════════════════

/**
 * MongoDB ObjectId pattern
 */
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

/**
 * Email schema
 */
const emailSchema = z
  .string()
  .email("Invalid email format")
  .max(255, "Email too long")
  .transform((val) => val.toLowerCase().trim());

/**
 * Password schema
 */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long");

/**
 * Name schema
 */
const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name too long")
  .transform((val) => val.trim());

// ═══════════════════════════════════════════════════════════════
// AUTH SCHEMAS
// ═══════════════════════════════════════════════════════════════

/**
 * Registration request schema
 */
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Login request schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

/**
 * Update profile schema
 */
export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  avatar: z.string().url("Invalid avatar URL").optional(),
});

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

// ═══════════════════════════════════════════════════════════════
// PORTFOLIO SCHEMAS
// ═══════════════════════════════════════════════════════════════

/**
 * SIP entry schema
 */
const sipSchema = z.object({
  amount: z
    .number()
    .positive("SIP amount must be positive")
    .max(10000000, "SIP amount too large"),
  startYear: z
    .number()
    .int()
    .min(2000, "Invalid start year")
    .max(new Date().getFullYear() + 1, "Start year cannot be in the future"),
  startMonth: z
    .number()
    .int()
    .min(1, "Invalid month")
    .max(12, "Invalid month")
    .optional()
    .default(1),
  endYear: z
    .number()
    .int()
    .min(2000, "Invalid end year")
    .max(new Date().getFullYear() + 10, "End year too far in future")
    .optional(),
  endMonth: z.number().int().min(1).max(12).optional(),
});

/**
 * Lumpsum entry schema
 */
const lumpsumSchema = z.object({
  amount: z
    .number()
    .positive("Lumpsum amount must be positive")
    .max(100000000, "Lumpsum amount too large"),
  year: z
    .number()
    .int()
    .min(2000, "Invalid year")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  month: z.number().int().min(1).max(12).optional().default(1),
});

/**
 * Fund entry schema
 */
const fundSchema = z
  .object({
    assetType: z.enum(
      [
        "Mutual Fund",
        "Stock",
        "ETF",
        "Bond",
        "FD",
        "Gold",
        "Real Estate",
        "Equity",
        "Debt",
        "Hybrid",
        "Other",
      ],
      {
        errorMap: () => ({ message: "Invalid asset type" }),
      }
    ),
    assetName: z
      .string()
      .min(3, "Fund name too short")
      .max(200, "Fund name too long"),

    // New format: array of SIPs
    sips: z.array(sipSchema).optional().default([]),

    // Legacy format: single SIP (for backward compatibility)
    sip: z.number().positive().optional(),
    investmentStartYear: z.number().int().min(2000).optional(),

    // Lumpsums
    lumpsums: z.array(lumpsumSchema).optional().default([]),
  })
  .refine(
    (data) => {
      // Must have at least one SIP or lumpsum
      const hasSips = data.sips && data.sips.length > 0;
      const hasLegacySip = data.sip && data.sip > 0;
      const hasLumpsums = data.lumpsums && data.lumpsums.length > 0;
      return hasSips || hasLegacySip || hasLumpsums;
    },
    { message: "Fund must have at least one SIP or lumpsum investment" }
  );

/**
 * Create portfolio schema
 */
export const createPortfolioSchema = z.object({
  name: z
    .string()
    .min(1, "Portfolio name is required")
    .max(100, "Portfolio name too long")
    .optional()
    .default("My Portfolio"),
  funds: z
    .array(fundSchema)
    .min(1, "Portfolio must have at least one fund")
    .max(20, "Portfolio cannot have more than 20 funds"),
});

/**
 * Update portfolio schema
 */
export const updatePortfolioSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  funds: z.array(fundSchema).min(1).max(20).optional(),
});

// ═══════════════════════════════════════════════════════════════
// ANALYSIS SCHEMAS
// ═══════════════════════════════════════════════════════════════

/**
 * Generate analysis schema
 */
export const generateAnalysisSchema = z.object({
  portfolioId: objectIdSchema,
});

// ═══════════════════════════════════════════════════════════════
// OAUTH SCHEMAS
// ═══════════════════════════════════════════════════════════════

/**
 * OAuth token exchange schema
 */
export const oauthTokenSchema = z.object({
  provider: z.literal("google", {
    errorMap: () => ({ message: "Invalid provider" }),
  }),
  credential: z.string().optional(),
  profile: z.object({
    id: z.string().min(1, "Profile ID required"),
    email: emailSchema,
    name: nameSchema,
    picture: z.string().url().optional(),
  }),
});

// ═══════════════════════════════════════════════════════════════
// VALIDATION MIDDLEWARE FACTORY
// ═══════════════════════════════════════════════════════════════

/**
 * Create validation middleware for a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {string} source - Where to validate ('body', 'query', 'params')
 */
export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
        // Defensive check for edge cases where errors might be undefined
        const zodErrors = result.error?.errors || [];
        const errors = zodErrors.map((err) => ({
          field: err.path?.join(".") || "unknown",
          message: err.message || "Validation error",
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors:
            errors.length > 0
              ? errors
              : [{ field: "unknown", message: "Invalid request data" }],
        });
      }

      // Replace with parsed/transformed data
      req[source] = result.data;
      next();
    } catch (error) {
      console.error("Validation error:", error);
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
      });
    }
  };
};

export default {
  // Auth
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  // Portfolio
  createPortfolioSchema,
  updatePortfolioSchema,
  // Analysis
  generateAnalysisSchema,
  // OAuth
  oauthTokenSchema,
  // Middleware
  validate,
};
