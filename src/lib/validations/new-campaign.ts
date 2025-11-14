import { z } from "zod";

// Choice constants
export const campaignTypes = ["email", "social", "search", "display"] as const;
export const targetAudiences = ["existingCustomers", "newProspects", "lookalike"] as const;
export const genderOptions = ["all", "male", "female"] as const;
export const biddingStrategies = [
  "maximize_clicks",
  "maximize_conversions",
  "target_roas",
] as const;
export const callToActionOptions = ["learn_more", "buy_now", "sign_up", "contact_us"] as const;
export const launchOptions = ["immediate", "scheduled"] as const;
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

const baseCampaignSchema = z.object({
  clientId: z.string(),
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
  headline: z.string().optional(),
  description: z.string().optional(),
  callToAction: z.string().min(1, "Call to action is required"),
  publishStartDate: dateFromInput,
  publishEndDate: dateFromInput,
  platforms: z.array(z.string()).default([]),
  launchOptions: z.enum([...launchOptions] as const).default("immediate"),
});

export const createCampaignSchema = baseCampaignSchema.superRefine((data, ctx) => {
  // startDate must be <= endDate
  if (data.startDate && data.endDate) {
    if (data.startDate.getTime() > data.endDate.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start date must be before or equal to end date",
        path: ["startDate"],
      });
    }
  }

  // publish dates must be valid
  if (data.publishStartDate && data.publishEndDate) {
    if (data.publishStartDate.getTime() > data.publishEndDate.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Publish start must be before or equal to publish end",
        path: ["publishStartDate"],
      });
    }
  }

  // budgetDistribution percentages should sum to <= 100
  if (Array.isArray(data.budgetDistribution) && data.budgetDistribution.length > 0) {
    const sum = data.budgetDistribution.reduce((s, b) => s + (b.percent || 0), 0);
    if (sum > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Budget distribution percentages must not exceed 100% total",
        path: ["budgetDistribution"],
      });
    }
  }
});

export type CampaignFormValues = z.infer<typeof baseCampaignSchema>;

export const updateCampaignSchema = baseCampaignSchema.partial();
export type CampaignUpdateValues = z.infer<typeof updateCampaignSchema>;

// Validation helpers
export const validateCampaignForm = (data: unknown) => createCampaignSchema.safeParse(data);
export const validateCampaignUpdate = (data: unknown) => updateCampaignSchema.safeParse(data);

export default createCampaignSchema;
