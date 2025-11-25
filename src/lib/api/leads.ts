import { useQuery } from "@tanstack/react-query";

import { fetchInstance } from "../clients";
import type { Lead } from "../types/lead";
import type { CreateLeadFormData } from "../validations/lead";

const leadsEndpoint = "/leads";

// Lookup types
export interface Country {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface City {
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

export interface ProductService {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeadSource {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamRole {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UtilsRole {
  id: string;
  code: string;
}

// Generic lookup fetcher
type LookupResponse<T> = { data?: T[] } | T[] | null;
type LookupTable =
  | "countries"
  | "regions"
  | "areas"
  | "product-services"
  | "lead-sources"
  | "team-roles";

type LookupParams = Record<string, string | null | undefined>;

const buildLookupUrl = (table: LookupTable, params?: LookupParams) => {
  if (!params) return `${leadsEndpoint}/lookups/${table}`;
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.append(key, value);
    }
  });
  const qs = query.toString();
  return qs ? `${leadsEndpoint}/lookups/${table}?${qs}` : `${leadsEndpoint}/lookups/${table}`;
};

export const getLeadsLookup = async <T = unknown>(
  table: "countries" | "cities" | "areas" | "product-services" | "lead-sources" | "team-roles",
): Promise<T[]> => {
  const response = await fetchInstance<LookupResponse<T>>(buildLookupUrl(table, params));

  if (!response.data) return [];
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.data.data)) return response.data.data;

  return [];
};

// API response shape
type BackendLeadResponse = {
  data: BackendLead[];
  total: number;
  skip: number;
  take: number;
};

export interface BackendLead {
  id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  status: string;
  isActive: boolean;
  createdAt?: string;
  leadSource?: { name: string };
  productServices?: Array<{ productService: { name: string } }>;
  serviceOfferings?: Array<{
    leadId: string;
    serviceOfferingId: string;
    serviceOffering: {
      id: string;
      name: string;
    };
  }>;
  assignedToUser?: { fullName: string };
  assignedUsers?: Array<{
    leadId: string;
    userId: string;
    user: {
      id: string;
      fullName: string;
      email: string;
    };
  }>;
}

function getStatus(active: boolean, status: string): "Active" | "Inactive" | "Pending" {
  if (!active) return "Inactive";
  // If status returned is "NEW" etc, treat as Pending, else Active
  if (status === "NEW") return "Pending";
  if (status === "ACTIVE") return "Active";
  if (status === "INACTIVE") return "Inactive";
  return "Active";
}

const COLORS = [
  "bg-red-500","bg-blue-500","bg-green-500","bg-yellow-500","bg-indigo-500","bg-pink-500",
];

function transformLead(lead: BackendLead, idx: number): Lead {

  // Transform assignedUsers to match the expected format
  const assignedTo = (lead.assignedUsers || []).map((au, index) => {
    const color = COLORS[index % COLORS.length];
    const fullName = au.user?.fullName || "Unknown";
    const initials = fullName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return {
      name: fullName,
      initial: initials,
      color,
    };
  });

  // Get services from serviceOfferings first, fallback to productServices
  const services = lead.serviceOfferings?.map(s => s.serviceOffering.name).join(", ") 
    || lead.productServices?.map(s => s.productService.name).join(", ") 
    || "-";

  return {
    id: lead.id,
    name: lead.fullName,
    email: lead.emailAddress,
    source: lead.leadSource?.name || "Unknown",
    status: getStatus(lead.isActive, lead.status),
    agreementPeriod: { start: "-", end: "-" },
    marketRegion: "-",
    services,
    contactInfo: lead.phoneNumber || "-",
    assignedTo,
    createdAt: lead.createdAt || undefined,
  };
}

export type LeadsFilters = {
  status?: string; // API expects values like NEW, CONTACTED, QUALIFIED, etc.
  assignedToUserIds?: string[];
  leadSourceId?: string;
};

export const getLeads = async (filters?: LeadsFilters) => {
  // Build query string from filters
  const params = new URLSearchParams();
  if (filters) {
    if (filters.status) params.append("status", filters.status);
    if (filters.leadSourceId) params.append("leadSourceId", filters.leadSourceId);
    if (Array.isArray(filters.assignedToUserIds)) {
      // Send repeated params e.g. assignedToUserIds=1&assignedToUserIds=2
      filters.assignedToUserIds.forEach(id => params.append("assignedToUserIds", id));
    }
  }

  const url = params.toString() ? `${leadsEndpoint}?${params.toString()}` : leadsEndpoint;
  console.log("getLeads URL:", url);
  console.log("getLeads filters:", filters);
  const response = await fetchInstance<BackendLeadResponse>(url);
  console.log("Fetched leads response:", response);
  return {
    status: response.status,
    data: response.data
      ? {
        results: response.data.data.map(transformLead),
        count: response.data.total,
      }
      : { results: [], count: 0 },
  };
};

export const createLead = async (formData: CreateLeadFormData): Promise<{
  status: number;
  data: Lead | null;
}> => {
  const body: Record<string, unknown> = {
    fullName: formData.fullName,
    nationality: formData.nationality,
    emailAddress: formData.email,
    phoneNumber: formData.phoneNumber,
    countryId: formData.country,
    cityId: formData.city,
    areaId: formData.area,
    fullAddress: formData.fullAddress,
    visionStatement: formData.visionStatement,
    missionStatement: formData.missionStatement,
    linkedinUrl: formData.linkedinUrl,
    twitterUrl: formData.twitterUrl,
    instagramUrl: formData.instagramUrl,
    facebookUrl: formData.facebookUrl,
    youtubeUrl: formData.youtubeUrl,
    websiteUrl: formData.websiteUrl,
    additionalNotes: formData.additionalNotes,
    productServiceIds: formData.productServiceIds,
    serviceOfferingIds: formData.serviceOfferingIds,
    teamRoleIds: formData.teamRoleIds,
    assignedToUserIds: formData.assignedToUserIds,
    leadSourceId: formData.leadSource,
    status: "NEW",
  };
  console.log("body to be sent in createLead api:", body);
  Object.keys(body).forEach(k => body[k] === undefined && delete body[k]);
  try {
    const response = await fetchInstance(leadsEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!(response.status >= 200 && response.status < 300)) {
      console.error("Lead creation failed:", response.status, response.data);
    }
    return {
      status: response.status,
      data: (response.data as Lead) ?? null,
    };
  } catch (error) {
    console.error("An error occurred during lead creation:", error);
    return { status: 500, data: null };
  }
};

export const editLead = async (
  id: string,
  formData: CreateLeadFormData,
): Promise<{ status: number; data: Lead | null }> => {
  const body: Record<string, unknown> = {
    fullName: formData.fullName,
    nationality: formData.nationality,
    emailAddress: formData.email,
    phoneNumber: formData.phoneNumber,
    countryId: formData.country,
    cityId: formData.city,
    areaId: formData.area,
    fullAddress: formData.fullAddress,
    visionStatement: formData.visionStatement,
    missionStatement: formData.missionStatement,
    linkedinUrl: formData.linkedinUrl,
    twitterUrl: formData.twitterUrl,
    instagramUrl: formData.instagramUrl,
    facebookUrl: formData.facebookUrl,
    youtubeUrl: formData.youtubeUrl,
    websiteUrl: formData.websiteUrl,
    additionalNotes: formData.additionalNotes,
    productServiceIds: formData.productServiceIds,
    serviceOfferingIds: formData.serviceOfferingIds,
    teamRoleIds: formData.teamRoleIds,
    assignedToUserId: "a4a5bc80-c882-4ef9-8134-fe7affb08a0a",
  };
  Object.keys(body).forEach(k => body[k] === undefined && delete body[k]);
  try {
    const response = await fetchInstance(`${leadsEndpoint}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!(response.status >= 200 && response.status < 300)) {
      console.error("Edit lead failed:", response.status, response.data);
    }
    return { status: 500, data: null };
  } catch (error) {
    console.error("An error occurred during lead edit:", error);
    return { status: 500, data: null };
  }
};

export const deleteLead = async (id: string): Promise<{ status: number }> => {
  try {
    const response = await fetchInstance(`/leads/${id}`, { method: "DELETE" });
    if (!(response.status >= 200 && response.status < 300)) {
      console.error("Delete lead failed:", response.status, response.data);
    }
    return { status: response.status };
  } catch (error) {
    console.error("An error occurred during lead delete:", error);
    throw error;
  }
};

export const getUtilsRoles = async (): Promise<UtilsRole[]> => {
  const response = await fetchInstance<UtilsRole[]>("/utils/roles");
  return response.data || [];
};

// Add LeadByIdResponse type export
export interface LeadByIdResponse {
  id: string;
  organizationId: string;
  fullName: string;
  nationality: string;
  emailAddress: string;
  phoneNumber: string;
  countryId: string;
  regionId: string;
  areaId: string;
  fullAddress: string;
  visionStatement: string;
  missionStatement: string;
  companyLogoUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  websiteUrl: string;
  leadSourceId: string;
  assignedToUserId: string;
  additionalNotes: string;
  status: string;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  country: string;
  city: string;
  area: string;
  leadSource: string;
  assignedToUser: string;
  productServices: any[];
  teamRoles: any[];
  communications: any[];
  attachments: any[];
}

export const getLeadById = async (id: string): Promise<LeadByIdResponse> => {
  const response = await fetchInstance<LeadByIdResponse>(`/leads/${id}`);
  return response.data as LeadByIdResponse;
};

export const useLeadSources = () => {
  return useQuery({
    queryKey: ["lead-sources"],
    queryFn: () => getLeadsLookup("lead-sources"),
  });
};