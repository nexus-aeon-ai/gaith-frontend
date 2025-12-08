import { fetchInstance } from "../../clients";

const campaignEndpoint = "/campaign";
// New campaign creation API matching provided spec
export interface NewCampaignRequest {
  clientId?: string;
  name: string;
  description: string;
  primaryHeadline: string;
  campaignTypeId: string;
  targetAudienceTypeId: string;
  ageRangeTypeIds: string[];
  genderTypeId: string;
  countryTypeIds: string[];
  regionTypeIds: string[];
  callToActionTypeId: string;
  totalBudget: number;
  dailySpendLimit: number;
  biddingStrategyTypeId: string;
  manualCpc: number;
  startAt: string;
  endAt: string;
  scheduledAt: string;
  launchOption: string;
  isTermsAgreed: boolean;
  objectiveTypeIds: string[];
  interestTypeIds: string[];
  platformTypeIds: string[];
  budgetAllocations: Array<{
    channelTypeId: string;
    percentage: number;
    amount: number;
  }>;
  // assets?: Array<{ ... }>; // skip for now
}

export const createNewCampaign = async (
  data: NewCampaignRequest,
): Promise<{ status: number; data: any }> => {
  console.log("payload in new campaign:", data);
  try {
    const response = await fetchInstance<any>(campaignEndpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error("Error creating new campaign:", error);
    throw error;
  }
};

export interface ApiCampaign {
  id: string;
  organizationId: string;
  clientId: string;
  name: string;
  description: string;
  primaryHeadline: string;
  campaignTypeId: string;
  genderTypeId: string;
  callToActionTypeId: string;
  totalBudget: number;
  dailySpendLimit: number;
  currencyId: string | null;
  currency: string | null;
  biddingStrategyTypeId: string;
  manualCpc: number;
  startAt: string;
  endAt: string;
  scheduledAt: string;
  launchOption: string;
  currentStatusTypeId: string | null;
  isLaunched: boolean;
  isTermsAgreed: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  campaignType: {
    id: string;
    name: string;
    description: string;
  };
  genderType: {
    id: string;
    name: string;
  };
  callToActionType: {
    id: string;
    name: string;
  };
  biddingStrategyType: {
    id: string;
    name: string;
  };
  currentStatusType: any | null;
  targetAudiences: any[];
  ageRanges: any[];
  objectives: Array<{
    objectiveType: {
      name: string;
    };
  }>;
  interests: Array<{
    interestType: {
      name: string;
    };
  }>;
  platforms: Array<{
    platformType: {
      name: string;
    };
  }>;
  countries: Array<{
    countryType: {
      name: string;
    };
  }>;
  regions: Array<{
    regionType: {
      name: string;
    };
  }>;
  budget: any[];
  assets: any[];
}

export interface CreateCampaignRequest {
  // Required fields per API spec
  campaignName: string;
  emailAddress: string;
  phoneNumber: string;
  industrySectorId: string;
  businessOverview: string;
  agreementStartDate: string;
  agreementEndDate: string;
  contractDurationMonths: number;
  primaryMarketRegionId: string;
  targetAudienceId: string;
  secondaryMarketIds: string[];

  // Optional fields
  languagesSupported?: string[];
  visionStatement?: string;
  missionStatement?: string;
  serviceOfferingIds?: string[];
  linkedinUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  websiteUrl?: string;
  locationCity?: string;
  locationCountry?: string;
  fullAddress?: string;
  accountManagerId?: string;
  marketingStrategistId?: string;
  assignedUserIds?: string[];
  teamRoleIds?: string[];
  type?: string;
  fullName?: string;
  companyName?: string;
  industry?: string;
  country?: string;
  city?: string;
  branchLocations?: Record<string, unknown>;
  languagePreferences?: string;
  businessMaturity?: string;
}

export const createCampaign = async (
  data: CreateCampaignRequest,
): Promise<{
  status: number;
  data: ApiCampaign | null;
}> => {
  try {
    const response = await fetchInstance<ApiCampaign>(campaignEndpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log("data to send in api:", data);
    console.log("Create campaign response response:", response);

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
};

// Update (edit) an existing campaign by ID. Uses the same request body shape as createClient.
export const updateClient = async (
  id: string,
  data: CreateCampaignRequest,
): Promise<{
  status: number;
  data: ApiCampaign | null;
}> => {
  try {
    const response = await fetchInstance<ApiCampaign>(`${campaignEndpoint}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    console.log("Update campaign payload:", data);
    console.log("Update campaign response:", response);

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error updating campaign:", error);
    throw error;
  }
};

// Alias/semantic name for updating a campaign
export const updateCampaign = async (
  id: string,
  data: Partial<NewCampaignRequest> | CreateCampaignRequest,
): Promise<{
  status: number;
  data: ApiCampaign | null;
}> => {
  // reuse the same patch implementation
  console.log("campaign id to be updated:", id);
  console.log("data to be updated:", data);

  try {
    const response = await fetchInstance<ApiCampaign>(`${campaignEndpoint}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error updating campaign:", error);
    throw error;
  }
};

export interface CampaignListResponse {
  items: ApiCampaign[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const getCampaigns = async (
  page: number = 1,
  pageSize: number = 20,
  filters?: {
    campaignTypeId?: string;
    statusTypeId?: string;
    platformTypeIds?: string[];
    minBudget?: number;
    maxBudget?: number;
    startFrom?: string;
    startTo?: string;
  },
): Promise<{
  status: number;
  data: CampaignListResponse | null;
}> => {
  // Build query string with optional filters
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  if (filters) {
    if (filters.campaignTypeId) params.set("campaignTypeId", filters.campaignTypeId);
    if (filters.statusTypeId) params.set("statusTypeId", filters.statusTypeId);
    if (filters.platformTypeIds && filters.platformTypeIds.length > 0) {
      // send multiple platformTypeIds as repeated params
      filters.platformTypeIds.forEach(pt => params.append("platformTypeIds", pt));
    }
    if (filters.minBudget !== undefined) params.set("minBudget", String(filters.minBudget));
    if (filters.maxBudget !== undefined) params.set("maxBudget", String(filters.maxBudget));
    if (filters.startFrom) params.set("startFrom", filters.startFrom);
    if (filters.startTo) params.set("startTo", filters.startTo);
  }

  const url = `${campaignEndpoint}?${params.toString()}`;
  const response = await fetchInstance<CampaignListResponse>(url);
  if (!response.data) {
    return {
      status: response.status,
      data: null,
    };
  }

  return {
    status: response.status,
    data: response.data,
  };
};

export const getCampaignById = async (
  id: string,
): Promise<{
  status: number;
  data: ApiCampaign | null;
}> => {
  const response = await fetchInstance<ApiCampaign>(`${campaignEndpoint}/${id}`);

  if (!response.data) {
    return {
      status: response.status,
      data: null,
    };
  }
  console.log("Campaign by id:", id, " \ndata:", response.data);
  return {
    status: response.status,
    data: response.data,
  };
};

export const deleteCampaign = async (
  id: string,
): Promise<{
  status: number;
  data: null;
}> => {
  try {
    const response = await fetchInstance(`${campaignEndpoint}/${id}`, {
      method: "DELETE",
    });

    console.log("Delete response status:", response.status);
    console.log("Delete response data:", response.data);

    // If status is not successful (200-299), log the error
    if (response.status < 200 || response.status >= 300) {
      console.error("Delete failed with status:", response.status);
      console.error("Error response:", response.data);
    }

    return response as { status: number; data: null };
  } catch (error) {
    console.error("Delete error caught:", error);
    throw error;
  }
};

// Lookup APIs for campaign
export const getCampaignLookup = async (name: string) => {
  const { data } = await fetchInstance(`/campaign/lookups/${name}`);
  return data;
};
