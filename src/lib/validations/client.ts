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

export const createClientSchema = z.object({
  // Basic Information
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  industry: z.string().min(1, "Industry is required"),

  companySize: z.string().min(1, "Company size is required"),

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
  department: z.string().optional().or(z.literal("")),

  location: z
    .string()
    .min(2, "Area must be at least 2 characters")
    .max(50, "Area must be less than 50 characters")
    .optional()
    .or(z.literal("")),

  country: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  area: z.string().optional().or(z.literal("")),

  fullAddress: z
    .string()
    .min(10, "Full address must be at least 10 characters")
    .max(500, "Full address must be less than 500 characters"),

  // Agreement information
  accountManager: z.string().optional().or(z.literal("")),
  clientSince: z.date({
    required_error: "Client since date is required",
    invalid_type_error: "Invalid client since selected",
  }),
  agreementStartDate: z.date(),
  agreementEndDate: z.date(),


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
  // Social Media URLs - Optional but validated if provided
  websiteUrl: z.string().url("Invalid Website URL").optional().or(z.literal("")),
  facebookUrl: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
  twitterUrl: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  instagramUrl: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),

  // Internal Notes
  internalNotes: z
    .string()
    .max(2000, "Internal notes must be less than 2000 characters")
    .optional(),

  // New Fields
  primaryMarketRegionId: z.string().min(1, "Primary market region is required"),
  secondaryMarketIds: z.array(z.string()).optional(),
  targetAudienceId: z.string().min(1, "Target audience is required"),
  languagesSupported: z.array(z.string()).optional(),
  serviceOfferingIds: z.array(z.string()).optional(),
  assignedUserIds: z.array(z.string()).optional(),
  teamRoleIds: z.array(z.string()).optional(),
  visionStatement: z.string().optional(),
  missionStatement: z.string().optional(),
  businessMaturity: z.string().optional(),
});

// Type inference from schema
export type CreateClientFormData = z.infer<typeof createClientSchema>;

// Partial schema for updates (all fields optional)
export const updateClientSchema = createClientSchema.partial();

// Type for update operations
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;

// Validation helper functions
export const validateClientForm = (data: unknown) => {
  return createClientSchema.safeParse(data);
};

export const validateClientUpdate = (data: unknown) => {
  return updateClientSchema.safeParse(data);
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
