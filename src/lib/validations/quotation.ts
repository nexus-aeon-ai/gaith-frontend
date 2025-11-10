import { z } from "zod";

export const currencyOptions = ["USD", "EUR", "AED"] as const;

export const statusOptions = ["pending", "approved", "rejected"] as const;

export interface ServiceInstance {
  description: string;
  quantity: number;
  servicePrice: number;
  tax: number;
  total: number;
}

// Main Lead Form Validation Schema
export const createQuoteSchema = z.object({
  // Basic Information
  customerName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  quoteNumber: z
    .string()
    .min(2, "Nationality must be at least 2 characters")
    .max(50, "Nationality must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Nationality can only contain letters and spaces"),

  validUntil: z.date().optional(),

  currency: z.enum(currencyOptions, {
    required_error: "Currency is required",
    invalid_type_error: "Currency must be a string",
  }),

  quotationTitle: z
    .string()
    .min(2, "Quotation title must be at least 2 characters")
    .max(50, "Quotation title must be less than 50 characters"),

  description: z
    .string()
    .min(2, "Description must be at least 2 characters")
    .max(100, "Description must be less than 100 characters"),

  // Service & pricing details
  serviceInstance: z.array(
    z.object({
      description: z.string(),
      quantity: z.number(),
      servicePrice: z.number(),
      tax: z.number(),
      total: z.number(),
    }),
  ),

  notes: z
    .string()
    .min(2, "Notes must be at least 2 characters")
    .max(100, "Notes must be less than 100 characters"),

  status: z.enum(statusOptions, {
    required_error: "Status is required",
    invalid_type_error: "Status must be a string",
  }),
});

// Type inference from schema
export type CreateQuotationFormData = z.infer<typeof createQuoteSchema>;

// Partial schema for updates (all fields optional)
export const udpateQuoteSchema = createQuoteSchema.partial();

// Type for update operations
export type UpdateQuoteFormData = z.infer<typeof udpateQuoteSchema>;

// Validation helper functions
export const validateQuoteForm = (data: unknown) => {
  return createQuoteSchema.safeParse(data);
};

export const validateQuoteUpdate = (data: unknown) => {
  return udpateQuoteSchema.safeParse(data);
};
