import { z } from "zod";

export const FormSchema = z.object({
  // Step 1: Campaign Basics
  campaignName: z.string().min(1, "Campaign name is required"),
  campaignType: z.enum(["social", "email", "search", "display", "video"], {
    required_error: "Campaign type is required",
  }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  targetAudience: z.enum(["existingCustomers", "lookalikeAudience", "newProspects"], {
    required_error: "Target audience is required",
  }),
  ageRange: z.enum(["13-17", "18-24", "25-34", "35-44", "45-54", "55+"], {
    required_error: "Age range is required",
  }),
  gender: z.enum(["all", "male", "female"], {
    required_error: "Gender selection is required",
  }),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  objectives: z.array(z.string()).min(1, "Select at least one objective"),
  country: z.string().min(1, "Country is required"),
  stateRegion: z.string().min(1, "State/Region is required"),

  totalBudget: z.number().min(1, "Total budget is required"),
  dailySpendLimit: z.enum(["0-50", "51-100", "101-200", "201-500", "500+"], {
    required_error: "Daily spend limit is required",
  }),
  budgetDistribution: z.array(
    z.object({
      channel: z.string(),
      percentage: z.number().min(0).max(100),
    }),
  ),
  biddingStrategy: z.enum(["maximize_clicks", "maximize_conversions", "target_cpa", "manual_cpc"], {
    required_error: "Bidding strategy is required",
  }),
  primaryImage: z
    .custom<File | null>(val => val instanceof File, "Primary image is required")
    .refine(
      file => file instanceof File && file.size <= 10 * 1024 * 1024,
      "File size must be less than 10MB",
    ),
  secondaryImages: z
    .array(
      z
        .custom<File>(val => val instanceof File, "File must be valid")
        .refine(
          file => file instanceof File && file.size <= 10 * 1024 * 1024,
          "File size must be less than 10MB",
        ),
    )
    .max(5, "Maximum 5 secondary images allowed"),
  headline: z
    .string()
    .min(1, "Headline is required")
    .max(60, "Headline must be less than 60 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(300, "Description must be less than 300 characters"),
  callToAction: z.enum(
    ["learn_more", "sign_up", "shop_now", "contact_us", "download", "book_now", "subscribe"],
    {
      required_error: "Call to action is required",
    },
  ),
  publishStartDate: z.date({
    required_error: "Start publishing date is required",
  }),
  publishEndDate: z.date({
    required_error: "End publishing date is required",
  }),
  launchOptions: z.enum(["immediate", "scheduled", "draft"], {
    required_error: "Launch option is required",
  }),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
});
