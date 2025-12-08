import { fetchInstance } from "../../clients";
import { SocialMediaUrls } from "../leads";

const clientsEndpoint = "/clients";

// Nested type definitions for ClientByIdResponse
export interface IndustrySector {
  id: string;
  name: string;
}

export interface CompanySize {
  id: string;
  name: string;
}

export interface PrimaryMarketRegion {
  id: string;
  name: string;
}

export interface TargetAudience {
  id: string;
  name: string;
}

export interface AccountManager {
  id: string;
  fullName: string;
  email: string;
}

export interface MarketingStrategist {
  id: string;
  fullName: string;
  email: string;
}

export interface AssignedUser {
  id: string;
  fullName: string;
  email: string;
  departmentId: string | null;
}

export interface ServiceOffering {
  id: string;
  name: string;
}

export interface TeamRole {
  teamRole: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface SecondaryMarket {
  marketRegion: {
    id: string;
    name: string;
  };
}

export interface LanguageSupported {
  code: string;
  name: string;
}

export interface CountryType {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CityType {
  id: string;
  organizationId: string;
  countryTypeId: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  id: string;
  organizationId: string;
  cityId: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  status: string;
  populationStatus: string;
  priority: string;
  accountId: string;
  assignedTo: string;
  dueDate: string;
  estimatedHours: number | null;
  additionalComments: string;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Quotation {
  id: string;
  accountId: string;
  totalAmount: number;
  createdBy: string;
  createdAt: string;
  validUntil: string;
  description: string;
  termsAndConditions: string;
  title: string;
  quotationNumber: string;
  notes: string;
  status: string;
  isDeleted: boolean;
  isActive: boolean;
  updatedAt: string;
}

export interface Campaign {
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
}

export interface Communication {
  id: string;
  clientId: string;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  clientId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  createdAt: string;
  updatedAt: string;
}

// ClientByIdResponse type matching the actual API response
export interface ClientByIdResponse {
  id: string;
  type: string | null;
  fullName: string | null;
  companyName: string | null;
  industry: string | null;
  country: string | null;
  city: string | null;
  branchLocations: Record<string, unknown> | null;
  websiteUrl: string | null;
  languagePreferences: string | null;
  businessMaturity: string | null;
  clientName: string;
  emailAddress: string;
  phoneNumber: string;
  businessOverview: string | null;
  companyLogoUrl: string | null;
  contactName: string | null;
  jobTitle: string | null;
  department: string | null;
  industrySectorId: string | null;
  companySizeId: string | null;
  agreementStartDate: string;
  agreementEndDate: string;
  contractDuration: number | null;
  contractDurationUnit: string | null;
  primaryMarketRegionId: string;
  targetAudienceId: string;
  languagesSupported: LanguageSupported[];
  visionStatement: string | null;
  missionStatement: string | null;
  socialMediaUrls: SocialMediaUrls | string | null;
  countryId: string | null;
  cityId: string | null;
  areaId: string | null;
  locationCity: string | null;
  locationCountry: string | null;
  fullAddress: string | null;
  latitude: number | null;
  longitude: number | null;
  accountManagerId: string | null;
  marketingStrategistId: string | null;
  internalNotes: string | null;
  notes: string | null;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  industrySector: IndustrySector | null;
  companySize: CompanySize | null;
  primaryMarketRegion: PrimaryMarketRegion | null;
  targetAudience: TargetAudience | null;
  countryType: CountryType | null;
  cityType: CityType | null;
  area: Area | null;
  secondaryMarkets: SecondaryMarket[];
  serviceOfferings: ServiceOffering[];
  teamRoles: TeamRole[];
  assignedUsers: AssignedUser[];
  accountManager: AccountManager | null;
  marketingStrategist: MarketingStrategist | null;
  clientContacts: unknown[];
  agreements: unknown[];
  marketing: unknown[];
  sales: unknown[];
  competitors: unknown[];
  attachments: Attachment[];
  communications: Communication[];
  tasks: Task[];
  generatedAssets: unknown[];
  chatSessions: unknown[];
  reports: unknown[];
  Quotation: Quotation[];
  Campaign: Campaign[];
  conversations: unknown[];
}

// Keep the old ApiClient type for backward compatibility with list view
export type ApiClient = {
  id: string;
  type: string;
  fullName: string;
  companyName: string;
  industry: string;
  country: string;
  city: string;
  branchLocations: Record<string, unknown> | unknown[];
  websiteUrl: string;
  languagePreferences: string;
  businessMaturity: string;
  clientName: string | null;
  emailAddress: string | null;
  phoneNumber: string | null;
  businessOverview: string | null;
  industrySectorId: string | null;
  agreementStartDate: string | null;
  agreementEndDate: string | null;
  contractDuration: number | null;
  contractDurationUnit: string | null;
  primaryMarketRegionId: string | null;
  targetAudienceId: string | null;
  languagesSupported: string[];
  visionStatement: string | null;
  missionStatement: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  locationCity: string | null;
  locationCountry: string | null;
  fullAddress: string | null;
  accountManagerId: string | null;
  marketingStrategistId: string | null;
  internalNotes: string | null;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  serviceOfferings?: ServiceOffering[];
  industrySector?: IndustrySector | null;
};

export interface ResponseT {
  id?: string;
  name?: string;
  value?: string;
  code?: string;
}

export interface CreateClientRequest {
  // Required fields per API spec
  clientName: string;
  emailAddress: string;
  phoneNumber: string;
  industrySectorId: string;
  businessOverview: string;
  agreementStartDate: string;
  agreementEndDate: string;
  contractDurationMonths?: number;
  primaryMarketRegionId: string;
  targetAudienceId: string;
  secondaryMarketIds?: string[];
  
  // Optional fields
  languagesSupported?: string[];
  visionStatement?: string;
  missionStatement?: string;
  serviceOfferingIds?: string[];
  socialMediaUrls?: SocialMediaUrls | null;
  websiteUrl?: string;
  locationCity?: string;
  locationCountry?: string;
  fullAddress?: string;
  countryId?: string;
  cityId?: string;
  areaId?: string;
  accountManagerId?: string;
  departmentId?: string;
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
  companySizeId?: string;
  contractDuration?: number;
  contractDurationUnit?: string;
  latitude?: number;
  longitude?: number;
  internalNotes?: string;
  notes?: string;
  jobTitle?: string;
  department?: string;
  contactName?: string;
}

export const createClient = async (
  data: CreateClientRequest,
): Promise<{
  status: number;
  data: ApiClient | null;
}> => {
  try {
    // Ensure socialMediaUrls is properly formatted as JSON object
    const body: Record<string, unknown> = { ...data };
    
    // If socialMediaUrls is provided, ensure it's an object (not individual fields)
    if (data.socialMediaUrls) {
      body.socialMediaUrls = data.socialMediaUrls;
    }

    const response = await fetchInstance<ApiClient>(clientsEndpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
    console.log("data to send in api:", body);
    console.log("Create client response:", response);

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

// Update (edit) an existing client by ID. Uses the same request body shape as createClient.
export const updateClient = async (
  id: string,
  data: CreateClientRequest,
): Promise<{
  status: number;
  data: ApiClient | null;
}> => {
  try {
    // Ensure socialMediaUrls is properly formatted as JSON object
    const body: Record<string, unknown> = { ...data };
    
    // If socialMediaUrls is provided, ensure it's an object (not individual fields)
    if (data.socialMediaUrls) {
      body.socialMediaUrls = data.socialMediaUrls;
    }

    const response = await fetchInstance<ApiClient>(`${clientsEndpoint}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    console.log("Update client payload:", body);
    console.log("Update client response:", response);

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

export const getClients = async (): Promise<{
  status: number;
  data: ApiClient[] | null;
}> => {
  const response = await fetchInstance<ApiClient[]>(clientsEndpoint);
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

export const getClientById = async (
  id: string,
): Promise<ClientByIdResponse> => {
  const response = await fetchInstance<ClientByIdResponse>(`${clientsEndpoint}/${id}`);

  if (!response.data) {
    throw new Error(`Failed to fetch client with id: ${id}`);
  }
  return response.data;
};

export const deleteClient = async (
  id: string,
): Promise<{
  status: number;
  data: null;
}> => {
  try {
    const response = await fetchInstance(`${clientsEndpoint}/${id}`, {
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

// Lookup APIs for client
export const getClientLanguages = async (): Promise<ResponseT[]> => {
  const response = await fetchInstance<ResponseT[]>(`${clientsEndpoint}/lookups/languages`);
  if (!response.data) {
    return [];
  }
  return response.data;
};

export const getClientBusinessMaturity = async (): Promise<ResponseT[]> => {
  const response = await fetchInstance<ResponseT[]>(`${clientsEndpoint}/lookups/business-maturity`);
  if (!response.data) {
    return [];
  }
  return response.data;
};

export const getClientIndustries = async (): Promise<ResponseT[]> => {
  const response = await fetchInstance<ResponseT[]>(`${clientsEndpoint}/lookups/industry-sectors`);
  if (!response.data) {
    return [];
  }
  return response.data;
};

export const getClientMartketRegions = async (): Promise<ResponseT[]> => {
  const response = await fetchInstance<ResponseT[]>(`${clientsEndpoint}/lookups/market-regions`);
  if (!response.data) {
    return [];
  }
  return response.data;
};

export const getClientTargetAudiences = async (): Promise<ResponseT[]> => {
  const response = await fetchInstance<ResponseT[]>(`${clientsEndpoint}/lookups/target-audiences`);
  if (!response.data) {
    return [];
  }
  return response.data;
};

export const getClientServiceOffers = async (): Promise<ResponseT[]> => {
  const response = await fetchInstance<ResponseT[]>(`${clientsEndpoint}/lookups/service-offerings`);
  if (!response.data) {
    return [];
  }
  return response.data;
};

export const getClientTeamRoles = async (): Promise<ResponseT[]> => {
  const response = await fetchInstance<ResponseT[]>(`${clientsEndpoint}/lookups/team-roles`);
  if (!response.data) {
    return [];
  }
  return response.data;
};

export const getClientCompanySizes = async (): Promise<ResponseT[]> => {
  const response = await fetchInstance<ResponseT[]>(`${clientsEndpoint}/lookups/company-size`);
  if (!response.data) {
    return [];
  }
  return response.data;
};
