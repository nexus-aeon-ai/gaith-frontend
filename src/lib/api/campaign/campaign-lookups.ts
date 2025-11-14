import { useQueries } from "@tanstack/react-query";

import { getCampaignLookup } from "./campaign";

// Lookup names (as backend expects)
const campaignLookupNames = [
  "types",
  "objective-types",
  "audience-types",
  "age-range-types",
  "gender-types",
  "interest-types",
  "country-types",
  "region-types",
  "platform-types",
  "channel-types",
  "bidding-strategy-types",
  "cta-types",
  "assets-types",
  "status-types",
] as const;

// Utility: convert "objective-types" → "objectiveTypes"
const toCamelCase = (str: string) => str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

// 1️⃣ Define the type map for camelCase keys
export type CampaignLookupKeys = ReturnType<typeof toCamelCase> extends infer K
  ? K extends string
    ? K
    : never
  : never;

export interface CampaignLookupsResult {
  types: any[];
  objectiveTypes: any[];
  audienceTypes: any[];
  ageRangeTypes: any[];
  genderTypes: any[];
  interestTypes: any[];
  countryTypes: any[];
  regionTypes: any[];
  platformTypes: any[];
  channelTypes: any[];
  biddingStrategyTypes: any[];
  ctaTypes: any[];
  assetsTypes: any[];
  statusTypes: any[];
  isLoading: boolean;
  isError: boolean;
}

// 2️⃣ The hook
export const useCampaignLookups = (): CampaignLookupsResult => {
  const results = useQueries({
    queries: campaignLookupNames.map(name => ({
      queryKey: ["campaignLookups", name],
      queryFn: async () => {
        const response = await getCampaignLookup(name);
        return response ?? [];
      },
      initialData: [],
    })),
  });

  // Build the lookup data object with camelCase keys
  const lookupData = Object.fromEntries(
    campaignLookupNames.map((name, i) => [toCamelCase(name), results[i].data]),
  );

  const isLoading = results.some(r => r.isLoading);
  const isError = results.some(r => r.isError);

  return {
    ...(lookupData as Omit<CampaignLookupsResult, "isLoading" | "isError">),
    isLoading,
    isError,
  };
};
