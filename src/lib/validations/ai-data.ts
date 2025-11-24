// this file will be used later on for AI data entry form

import { z } from "zod";

export const primaryAccManagers = [
  { value: "creative-director", label: "Creative Director" },
  { value: "social-media-manager", label: "Social Media Manager" },
  { value: "ux-researcher", label: "UX Researcher" },
  { value: "web-developer", label: "Web Developer" },
  { value: "content-writer", label: "Content Writer" },
  { value: "graphic-designer", label: "Graphic Designer" },
  { value: "seo-specialist", label: "SEO Specialist" },
] as const;

export const marketingStrategists = [
  { value: "creative-director", label: "Creative Director" },
  { value: "social-media-manager", label: "Social Media Manager" },
  { value: "ux-researcher", label: "UX Researcher" },
  { value: "web-developer", label: "Web Developer" },
  { value: "content-writer", label: "Content Writer" },
  { value: "graphic-designer", label: "Graphic Designer" },
  { value: "seo-specialist", label: "SEO Specialist" },
] as const;

// languages for client market/target au
export const primaryRegions = [
  "North America",
  "Europe",
  "Asia",
  "South America",
  "Africa",
  "Oceania",
] as const;

export const targetAudience = ["B2B", "B2C", "Enterprise", "Startups", "Other"] as const;

// const optionalUrl = z.string().url().or(z.literal("")).optional();

export const createAiDataSchema = z.object({
  // Basic Information
  clientName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  industry: z
    .string()
    .uuid("Each industry must be a valid ID")
    .min(1, "At least one industry is required"),

  companySize: z
    .string()
    .min(1, "Company size is required")
    .max(50, "Company size must be less than 50 characters"),

  businessOverview: z
    .string()
    .min(1, "Overview is required")
    .max(500, "Overview must be less than 500 characters"),

  // Contact Information - Email is required
  email: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country must be less than 50 characters"),

  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number")
    .or(z.literal(""))
    .optional(),

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
  contractDuration: z.number().optional(),
  contractDurationUnit: z.enum(["MONTH", "YEAR"]),

  // Market primary region and target audience, the array will
  // contain item ids instead of names for api request body
  primaryRegion: z.string().uuid("Each region must be a valid ID").optional(),
  targetAudience: z.string().uuid("Please select a valid target audience").optional(),

  secondaryMarkets: z
    .string()
    .min(2, "Secondary markets must be at least 2 characters")
    .max(50, "Secondary markets must be less than 50 characters"),

  languagesSupported: z.array(z.string()).min(1, "Select at least one language").optional(),

  // Company profile
  visionStatement: z
    .string()
    .min(10, "Vision statement must be at least 10 characters")
    .max(1000, "Vision statement must be less than 1000 characters"),

  missionStatement: z
    .string()
    .min(10, "Mission statement must be at least 10 characters")
    .max(1000, "Mission statement must be less than 1000 characters"),

  aiDataProdsServices: z
    .array(z.string().uuid("Each service offering must be a valid ID"))
    .min(1, "At least one service offering is required"),

  // Social Media Accounts
  linkedinUrl: z.string().url("Invalid URL").optional(),
  facebookUrl: z.string().url("Invalid URL").optional(),
  youtubeUrl: z.string().url("Invalid URL").optional(),
  twitterUrl: z.string().url("Invalid URL").optional(),
  instagramUrl: z.string().url("Invalid URL").optional(),
  websiteUrl: z.string().url("Invalid URL").optional(),

  // Team Assignment
  primaryAccManager: z.string().optional(),
  marketingStrategist: z.string().optional(),
  priorityLevel: z
    .enum(["High", "Medium", "Low"], {
      required_error: "Priority level is required",
      invalid_type_error: "Invalid priority level selected",
    })
    .optional(),

  // Additional Team Members
  additionalTeamMembers: z.array(z.string()).optional(),

  // Additional Notes
  additionalNotes: z.string().max(2000, "Additional notes must be less than 2000 characters"),
});

// Type inference from schema
export type CreateAiFormData = z.infer<typeof createAiDataSchema>;

// Partial schema for updates (all fields optional)
export const updateAiDataSchema = createAiDataSchema.partial();

// Type for update operations
export type UpdateClientFormData = z.infer<typeof updateAiDataSchema>;

// Validation helper functions
export const validateAiDataForm = (data: unknown) => {
  return createAiDataSchema.safeParse(data);
};

export const validateAiDataUpdate = (data: unknown) => {
  return updateAiDataSchema.safeParse(data);
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
