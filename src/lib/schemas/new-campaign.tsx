import { z } from "zod";

export const campaignTypes = ["email", "social", "search", "display"] as const;
export const targetAudiences = ["existingCustomers", "newProspects", "lookalike"] as const;
export const genderOptions = ["all", "male", "female"] as const;
export const biddingStrategies = [
  "maximize_clicks",
  "maximize_conversions",
  "target_roas",
] as const;
export const callToActionOptions = ["learn_more", "buy_now", "sign_up", "contact_us"] as const;
export const launchOptions = ["immediate", "scheduled", "draft"] as const;
export const dailySpendOptions = ["0-50", "51-100", "101-200", "200+"] as const;

// Date preprocessor: accepts Date instances or ISO/date strings
const dateFromInput = z.preprocess(val => {
  if (val instanceof Date) return val;
  if (typeof val === "string") {
    const parsed = new Date(val);
    return isNaN(parsed.getTime()) ? val : parsed;
  }
  return val;
}, z.date());

export const FormSchema = z.object({
  campaignName: z.string().min(1, "Campaign name is required"),
  campaignType: z.string().min(1, "Campaign type is required"),
  startDate: dateFromInput,
  endDate: dateFromInput,
  targetAudience: z.string().min(1, "Target audience is required"),
  ageRange: z.string().default("18-24"),
  gender: z.string().default("all"),
  interests: z.array(z.string()).default([]),
  objectives: z.array(z.string()).default([]),
  country: z.string().optional().nullable(),
  stateRegion: z.string().optional().nullable(),
  totalBudget: z.number().min(0, "Total budget must be >= 0").default(1000),
  dailySpendLimit: z.string().optional().nullable(),
  budgetDistribution: z
    .array(z.object({ channel: z.string(), percent: z.number().min(0).max(100) }))
    .default([]),
  biddingStrategy: z.string().min(1, "Bidding strategy is required"),
  primaryImage: z.any().nullable().optional(),
  secondaryImages: z.array(z.any()).default([]),
  headline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  callToAction: z.string().min(1, "Call to action is required"),
  publishStartDate: dateFromInput,
  publishEndDate: dateFromInput,
  platforms: z.array(z.string()).default([]),
  launchOptions: z.enum([...launchOptions] as const).default("immediate"),
});
