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

export interface Region {
  id: string;
  organizationId: string;
  countryId: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  id: string;
  organizationId: string;
  regionId: string;
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
  table: LookupTable,
  params?: LookupParams,
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
  leadSource?: { name: string };
  productServices?: Array<{ productService: { name: string } }>;
  assignedToUser?: { fullName: string };
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
  const assignedName = lead.assignedToUser?.fullName || "Unassigned";
  return {
    id: lead.id,
    name: lead.fullName,
    email: lead.emailAddress,
    source: lead.leadSource?.name || "Unknown",
    status: getStatus(lead.isActive, lead.status),
    agreementPeriod: { start: "-", end: "-" }, // API lacks these fields
    marketRegion: "-", // Not in API, fallback
    services: lead.productServices?.map(s => s.productService.name).join(", ") || "-",
    contactInfo: lead.phoneNumber || "-",
    assignedTo: [
      {
        name: assignedName,
        initial: assignedName[0] || "U",
        color: COLORS[idx % COLORS.length],
      },
    ],
  };
}

export const getLeads = async () => {
  const response = await fetchInstance<BackendLeadResponse>(leadsEndpoint);
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
    regionId: formData.region,
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
    teamRoleIds: formData.teamRoleIds,
    assignedToUserId: "a4a5bc80-c882-4ef9-8134-fe7affb08a0a",
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
    regionId: formData.region,
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
  country: any;
  region: any;
  area: any;
  leadSource: any;
  assignedToUser: any;
  productServices: any[];
  teamRoles: any[];
  communications: any[];
  attachments: any[];
}

export const getLeadById = async (id: string): Promise<LeadByIdResponse> => {
  const response = await fetchInstance<LeadByIdResponse>(`/leads/${id}`);
  if (!response.data) {
    throw new Error("Lead not found");
  }
  return response.data;
};
