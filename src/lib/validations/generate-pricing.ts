import { z } from "zod";

// --- Constants ---
export const currencyOptions = ["USD", "EUR", "AED"] as const;
export const discountTypeOptions = ["percentage", "fixed"] as const;

// --- Interfaces ---
export interface ServiceItem {
  name: string;
  description: string;
  price: number;
  isSelected: boolean;
}

export interface AdditionalItem {
  name: string;
  description: string;
  price: number;
  isSelected: boolean;
}

// --- Base schema without superRefine ---
const basePricingSchema = z.object({
  // Client Info
  fullName: z
    .string()
    .min(2, "Client name must be at least 2 characters")
    .max(100, "Client name must be less than 100 characters"),

  email: z
    .string()
    .email("Invalid email format")
    .max(100, "Email must be less than 100 characters"),

  proposalDate: z.date({
    required_error: "Proposal date is required",
    invalid_type_error: "Proposal date must be a valid date",
  }),

  validUntilDate: z
    .date({
      invalid_type_error: "Valid until must be a valid date",
    })
    .optional(),

  // Services
  services: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number().nonnegative("Price cannot be negative"),
        isSelected: z.boolean(),
      }).superRefine((data, ctx) => {
        // Only validate name if the service is selected
        if (data.isSelected && (!data.name || data.name.trim().length === 0)) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            minimum: 1,
            type: "string",
            inclusive: true,
            path: ["name"],
            message: "Service name is required",
          });
        }
      }),
    )
    .min(1, "At least one service is required"),

  // Discount Section
  applyDiscount: z.boolean(),
  discountType: z.enum(discountTypeOptions).optional(),
  discountAmount: z.number().nonnegative("Discount cannot be negative").optional(),
  discountReason: z.enum(["new-client", "seasonal", "loyalty", "custom"]).optional(),
  discountNotes: z.string().max(200, "Notes must be under 200 characters").optional(),

  // Additional Items
  additionalItems: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number().nonnegative("Price cannot be negative"),
        isSelected: z.boolean(),
      }).superRefine((data, ctx) => {
        // Only validate name if the additional item is selected
        if (data.isSelected && (!data.name || data.name.trim().length === 0)) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            minimum: 1,
            type: "string",
            inclusive: true,
            path: ["name"],
            message: "Item name is required",
          });
        }
      }),
    )
    .optional(),

  // Currency
  currency: z.enum(currencyOptions, {
    required_error: "Currency is required",
    invalid_type_error: "Invalid currency format",
  }),
});

// --- Main Generate Pricing Schema with validation ---
export const generatePricingSchema = basePricingSchema.superRefine((data, ctx) => {
  // Validate validUntilDate is after proposalDate
  if (data.validUntilDate && data.proposalDate) {
    if (data.validUntilDate < data.proposalDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid until must be after Proposal date",
        path: ["validUntilDate"],
      });
    }
  }
});

// --- Types ---
export type GeneratePricingFormData = z.infer<typeof generatePricingSchema>;

// --- Partial Schema for updates ---
export const updatePricingSchema = basePricingSchema.partial();
export type UpdatePricingFormData = z.infer<typeof updatePricingSchema>;

// --- Validation Helpers ---
export const validatePricingForm = (data: unknown) => {
  return generatePricingSchema.safeParse(data);
};

export const validatePricingUpdate = (data: unknown) => {
  return updatePricingSchema.safeParse(data);
};
