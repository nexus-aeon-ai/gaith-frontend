import { fetchInstance } from "../clients";

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

export const getClientById = async (id: string): Promise<{
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

  return {
    status: response.status,
    data: response.data,
  };
};

export const deleteClient = async (id: string): Promise<{
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

