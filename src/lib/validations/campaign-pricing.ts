import { z } from "zod";

const optionalUrl = z.string().url().or(z.literal("")).optional();

export const industryOptions = [
  {
    value: "technology",
    label: "Technology",
  },
  {
    value: "healthcare",
    label: "Healthcare",
  },
  {
    value: "finance",
    label: "Finance",
  },
  {
    value: "education",
    label: "Education",
  },
  {
    value: "e-commerce",
    label: "E-commerce & Retail",
  },
  {
    value: "manufacturing",
    label: "Manufacturing",
  },
  {
    value: "hospitality",
    label: "Hospitality",
  },
  {
    value: "real-estate",
    label: "Real Estate",
  },
  {
    value: "transportation",
    label: "Transportation & Logistics",
  },
  {
    value: "media",
    label: "Media & Entertainment",
  },
] as const;

export const companySizeOptions = ["0-50", "50-200", "200-500", "500-1000", "1000+"] as const;

export const createCampaignPricingSchema = z.object({
  // Basic Information
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  industry: z.enum(industryOptions.map(i => i.value) as [string, ...string[]], {
    required_error: "Industry is required",
    invalid_type_error: "Invalid industry selected",
  }),

  companySize: z.enum(companySizeOptions, {
    required_error: "Company size is required",
    invalid_type_error: "Invalid company size selected",
  }),

  // Contact Information - Email is required
  businessOverview: z
    .string()
    .min(1, "Overview is required")
    .max(500, "Overview must be less than 500 characters"),

  contactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(100, "Contact name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Contact name can only contain letters and spaces"),

  jobTitle: z
    .string()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Job title can only contain letters and spaces"),

  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),

  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number")
    .or(z.literal(""))
    .optional(),

  linkedinProfile: optionalUrl,
  department: z
    .string()
    .min(2, "Department must be at least 2 characters")
    .max(100, "Department must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Department can only contain letters and spaces"),

  location: z
    .string()
    .min(2, "Area must be at least 2 characters")
    .max(50, "Area must be less than 50 characters"),

  fullAddress: z
    .string()
    .min(10, "Full address must be at least 10 characters")
    .max(500, "Full address must be less than 500 characters"),

  // Agreement information
  accountManager: z.string().min(2, "Account manager must be at least 2 characters"),
  clientSince: z.date({
    required_error: "Client since date is required",
    invalid_type_error: "Invalid client since selected",
  }),
  agreementStartDate: z.date().min(new Date(), "Agreement start date must be in the future"),
  agreementEndDate: z.date().min(new Date(), "Agreement end date must be in the future"),
  contractDuration: z
    .string()
    .min(2, "Contract duration must be at least 2 characters")
    .max(50, "Contract duration must be less than 50 characters"),

  clientStatus: z.enum(["active", "inactive", "pending", "suspended"], {
    required_error: "Client status is required",
    invalid_type_error: "Invalid client status selected",
  }),

  monthlyBudget: z.string().min(0, "Monthly budget is required").optional(),

  priorityLevel: z.enum(["low", "medium", "high"], {
    required_error: "Priority level is required",
    invalid_type_error: "Invalid priority level selected",
  }),

  // Social Media URLs - Optional but validated if provided
  websiteUrl: z.string().url("Invalid Website URL").optional(),

  // Internal Notes
  internalNotes: z
    .string()
    .max(2000, "Internal notes must be less than 2000 characters")
    .optional(),
});

// Type inference from schema
export type CreateCampaignPricingFormData = z.infer<typeof createCampaignPricingSchema>;

// Partial schema for updates (all fields optional)
export const updateCampaignPricingSchema = createCampaignPricingSchema.partial();

// Type for update operations
export type UpdateClientFormData = z.infer<typeof updateCampaignPricingSchema>;

// Validation helper functions
export const validatePricingForm = (data: unknown) => {
  return createCampaignPricingSchema.safeParse(data);
};

export const validatePricingUpdate = (data: unknown) => {
  return updateCampaignPricingSchema.safeParse(data);
};

// Field-specific validation helpers
export const validateEmail = (email: string) => {
  return z.string().email().safeParse(email);
};

export const validatePhoneNumber = (phone: string) => {
  return z
    .string()
    .regex(/^[\+]?[0-9\s\-\(\)]+$/)
    .safeParse(phone);
};

export const validateUrl = (url: string) => {
  return z.string().url().safeParse(url);
};
