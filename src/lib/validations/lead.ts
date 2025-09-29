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

// Products & Services validation
const productsServicesSchema = z.object({
  software: z.boolean(),
  hardware: z.boolean(),
  consulting: z.boolean(),
  webDesign: z.boolean(),
  mobileApp: z.boolean(),
  cloudServices: z.boolean(),
});

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
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional(),
  facebookUrl: z.string().url("Invalid Facebook URL").optional(),
  youtubeUrl: z.string().url("Invalid YouTube URL").optional(),
  twitterUrl: z.string().url("Invalid Twitter URL").optional(),
  instagramUrl: z.string().url("Invalid Instagram URL").optional(),
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

// Type inference from schema
export type CreateLeadFormData = z.infer<typeof createLeadSchema>;

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
