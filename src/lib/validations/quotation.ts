import { z } from "zod";

export const statusOptions = ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"] as const;

export interface ServiceInstance {
  description: string;
  servicePrice: number;
  taxPercentage: number;
  total: number;
}

// Main Lead Form Validation Schema
export const createQuoteSchema = z.object({
  // Basic Information
  clientId: z.string().optional(),

  validUntil: z.date().optional(),

  title: z
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
      serviceId: z.string(),
      currencyId: z.string(),
      servicePrice: z.number(),
      taxPercentage: z.number(),
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
