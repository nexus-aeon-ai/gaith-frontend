import { z } from "zod";

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
    .min(2, "Quotation number must be at least 2 characters")
    .max(50, "Quotation number must be less than 50 characters")
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Quotation number can only contain letters, numbers, dashes, or underscores",
    ),

  validUntil: z.date().optional(),

  // store selected currency id (from /quotations/currencies) to send to backend
  currencyId: z.string({ required_error: "Currency is required" }).min(1, "Currency is required"),

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
      description: z.string().min(2, "Description must be at least 2 characters"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      servicePrice: z.number(),
      tax: z.number().optional().nullable(),
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
