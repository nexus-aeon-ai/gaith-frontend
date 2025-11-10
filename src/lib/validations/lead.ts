import { z } from "zod";

// Lead Source options validation
const leadSourceSchema = z.enum([
  "website",
  "social-media",
  "referral",
  "campaign",
  "cold-call",
  "email",
  "trade-show",
  "other",
]);

// Assigned To options validation
const assignedToSchema = z.enum([
  "creative-director",
  "social-media-manager",
  "ux-researcher",
  "web-developer",
  "content-writer",
  "graphic-designer",
  "seo-specialist",
]);

// Products & Services validation for lead
const productsServicesSchema = z.object({
  software: z.boolean(),
  hardware: z.boolean(),
  consulting: z.boolean(),
  webDesign: z.boolean(),
  mobileApp: z.boolean(),
  cloudServices: z.boolean(),
});

// Products & Services validation for client
const clientProductsServicesSchema = z.object({
  socialMedia: z.boolean(),
  blogCreation: z.boolean(),
  marketingPlan: z.boolean(),
  mediaBuyingPlan: z.boolean(),
  graphicDesigns: z.boolean(),
});

// languages for client market/target audience
const languages = ["English", "Spanish", "French", "German", "Chinese"] as const;

const optionalUrl = z.string().url().or(z.literal("")).optional();

// Main Lead Form Validation Schema
export const createLeadSchema = z.object({
  // Basic Information
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  nationality: z
    .string()
    .min(2, "Nationality must be at least 2 characters")
    .max(50, "Nationality must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Nationality can only contain letters and spaces"),

  // Contact Information - Email is required
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),

  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number"),

  // Address Information
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country must be less than 50 characters"),

  region: z
    .string()
    .min(2, "Region must be at least 2 characters")
    .max(50, "Region must be less than 50 characters"),

  area: z
    .string()
    .min(2, "Area must be at least 2 characters")
    .max(50, "Area must be less than 50 characters"),

  fullAddress: z
    .string()
    .min(10, "Full address must be at least 10 characters")
    .max(500, "Full address must be less than 500 characters"),

  // Team Assignment
  leadSource: leadSourceSchema,
  assignedTo: assignedToSchema,

  // Company Profile
  visionStatement: z
    .string()
    .min(10, "Vision statement must be at least 10 characters")
    .max(1000, "Vision statement must be less than 1000 characters"),

  missionStatement: z
    .string()
    .min(10, "Mission statement must be at least 10 characters")
    .max(1000, "Mission statement must be less than 1000 characters"),

  // Social Media URLs - Optional but validated if provided
  linkedinUrl: optionalUrl,
  facebookUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  twitterUrl: optionalUrl,
  instagramUrl: optionalUrl,
  websiteUrl: z.string().url("Invalid Website URL").optional(),

  // Additional Notes
  additionalNotes: z.string().max(2000, "Additional notes must be less than 2000 characters"),

  // Products & Services
  productsServices: productsServicesSchema,

  // Additional Team Members
  additionalTeamMembers: z.record(z.boolean().optional()),

  //company logo
  companyLogo: z
    .instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      file => ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type),
      "Only .jpg, .jpeg, .png, .webp formats are supported",
    )
    .optional(),
});

export const createClientSchema = z.object({
  // Basic Information
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  industry: z
    .string()
    .min(2, "Industry must be at least 2 characters")
    .max(50, "Industry must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Industry can only contain letters and spaces"),

  // Contact Information - Email is required
  businessOverview: z
    .string()
    .min(10, "Business overview must be at least 10 characters")
    .max(100, "Business overview must be less than 100 characters"),

  email: z.string().email("Please enter a valid email address"),

  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number"),

  location: z
    .string()
    .min(2, "Area must be at least 2 characters")
    .max(50, "Area must be less than 50 characters"),

  fullAddress: z
    .string()
    .min(10, "Full address must be at least 10 characters")
    .max(500, "Full address must be less than 500 characters"),

  // Agreement information
  agreementStartDate: z.date().min(new Date(), "Agreement start date must be in the future"),
  agreementEndDate: z.date().min(new Date(), "Agreement end date must be in the future"),
  contractDuration: z
    .string()
    .min(2, "Contract duration must be at least 2 characters")
    .max(50, "Contract duration must be less than 50 characters"),

  // Market and target audience
  primaryRegion: z.enum(["North America", "Europe", "Asia", "Other"], {
    required_error: "Primary region is required",
    invalid_type_error: "Invalid region selected",
  }),

  targetAudience: z.enum(["B2B", "B2C", "Enterprise", "Startups"], {
    required_error: "Target audience is required",
    invalid_type_error: "Invalid target audience selected",
  }),

  secondaryMarkets: z
    .string()
    .min(2, "Secondary markets must be at least 2 characters")
    .max(50, "Secondary markets must be less than 50 characters"),

  languagesSupported: z.array(z.enum(languages)).nonempty({
    message: "Select at least one language",
  }),

  // Company profile
  visionStatement: z
    .string()
    .min(10, "Vision statement must be at least 10 characters")
    .max(1000, "Vision statement must be less than 1000 characters"),

  missionStatement: z
    .string()
    .min(10, "Mission statement must be at least 10 characters")
    .max(1000, "Mission statement must be less than 1000 characters"),

  clientProductsServicesSchema: clientProductsServicesSchema,

  // Social Media URLs - Optional but validated if provided
  linkedinUrl: optionalUrl,
  facebookUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  twitterUrl: optionalUrl,
  instagramUrl: optionalUrl,
  websiteUrl: z.string().url("Invalid Website URL").optional(),

  // Products & Services
  productsServices: productsServicesSchema,

  // Team Assignment
  leadSource: leadSourceSchema,
  assignedTo: assignedToSchema,

  // Additional Team Members
  additionalTeamMembers: z.record(z.boolean().optional()),

  // Additional Notes
  additionalNotes: z.string().max(2000, "Additional notes must be less than 2000 characters"),
});

// Type inference from schema
export type CreateLeadFormData = z.infer<typeof createLeadSchema>;
export type CreateClientFormData = z.infer<typeof createClientSchema>;

// Partial schema for updates (all fields optional)
export const updateLeadSchema = createLeadSchema.partial();

// Type for update operations
export type UpdateLeadFormData = z.infer<typeof updateLeadSchema>;

// Validation helper functions
export const validateLeadForm = (data: unknown) => {
  return createLeadSchema.safeParse(data);
};

export const validateLeadUpdate = (data: unknown) => {
  return updateLeadSchema.safeParse(data);
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
