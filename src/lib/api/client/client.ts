import { fetchInstance } from "../../clients";

const clientsEndpoint = "/clients";

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
  contractDurationMonths: number | null;
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
};

interface ResponseT {
  id?: string;
  name?: string;
  value?: string;
}

export interface CreateClientRequest {
  clientName: string;
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
  languagesSupported: string[];
  visionStatement: string;
  missionStatement: string;
  serviceOfferingIds: string[];
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  websiteUrl: string;
  locationCity: string;
  locationCountry: string;
  fullAddress: string;
  accountManagerId: string;
  marketingStrategistId: string;
  assignedUserIds: string[];
  teamRoleIds: string[];
  type: string;
  fullName: string;
  companyName: string;
  industry: string;
  country: string;
  city: string;
  branchLocations: Record<string, unknown>;
  languagePreferences: string;
  businessMaturity: string;
}

export const createClient = async (
  data: CreateClientRequest,
): Promise<{
  status: number;
  data: ApiClient | null;
}> => {
  try {
    const response = await fetchInstance<ApiClient>(clientsEndpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log("data to send in api:", data);
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
    const response = await fetchInstance<ApiClient>(`${clientsEndpoint}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    console.log("Update client payload:", data);
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
): Promise<{
  status: number;
  data: ApiClient | null;
}> => {
  const response = await fetchInstance<ApiClient>(`${clientsEndpoint}/${id}`);

  if (!response.data) {
    return {
      status: response.status,
      data: null,
    };
  }
  console.log("Client by id:", id, " \ndata:", response.data);
  return {
    status: response.status,
    data: response.data,
  };
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
