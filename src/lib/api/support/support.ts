import { fetchInstance } from "../../clients";
import type { SupportTicket } from "../../types";

const supportEndpoint = "/support/tickets";

// Query parameters for listing tickets
export interface TicketListParams {
  searchTerm?: string;
  status?: "Open" | "In Progress" | "Closed" | "Resolved";
  priority?: "Low" | "Medium" | "High" | "Critical";
  isDraft?: boolean;
  issueCategoryId?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
  skip?: number;
  take?: number;
  orderBy?: "subject" | "status" | "priority" | "createdAt" | "updatedAt";
  orderDirection?: "asc" | "desc";
}

// API response types - matches actual API response
export interface ApiTicket {
  id: string;
  organizationId: string;
  userId: string;
  issueCategoryId: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  subject: string;
  description: string;
  attachments: string[];
  isDraft: boolean;
  status: "Open" | "In Progress" | "Closed" | "Resolved";
  assignedToUserId: string | null;
  createdAt: string;
  updatedAt: string;
  issueCategory: {
    id: string;
    name: string;
    description: string;
    organizationId: string;
    isDeleted: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface ApiTicketListResponse {
  data: ApiTicket[];
  total: number;
  skip: number;
  take: number;
}

// Transform API ticket to SupportTicket format
const transformApiTicket = (apiTicket: ApiTicket): SupportTicket => {
  // Format dates for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Generate ticketId from id (e.g., #SUP-2024-001)
  const generateTicketId = (id: string): string => {
    // Use first 8 chars of id and current year
    const year = new Date().getFullYear();
    const shortId = id.substring(0, 8).toUpperCase();
    return `#SUP-${year}-${shortId}`;
  };

  return {
    id: apiTicket.id,
    ticketId: generateTicketId(apiTicket.id),
    subject: apiTicket.subject,
    description: apiTicket.description,
    issueCategoryId: apiTicket.issueCategoryId,
    issueCategory: apiTicket.issueCategory,
    priority: apiTicket.priority,
    status: apiTicket.status,
    createdDate: formatDate(apiTicket.createdAt),
    lastUpdated: formatDate(apiTicket.updatedAt),
    createdBy: apiTicket.user.fullName,
    user: apiTicket.user,
    assignedTo: apiTicket.assignedTo ? {
      id: apiTicket.assignedTo.id,
      fullName: apiTicket.assignedTo.fullName,
      email: apiTicket.assignedTo.email,
    } : undefined,
    assignedToUserId: apiTicket.assignedToUserId,
    attachments: apiTicket.attachments,
    isDraft: apiTicket.isDraft,
    organizationId: apiTicket.organizationId,
    userId: apiTicket.userId,
    createdAt: apiTicket.createdAt,
    updatedAt: apiTicket.updatedAt,
  };
};

export interface CreateTicketRequest {
  issueCategoryId: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  subject: string;
  description: string;
  attachments?: string[];
  isDraft: boolean;
  status?: "Open" | "In Progress" | "Closed" | "Resolved";
}

export interface UpdateTicketRequest {
  issueCategoryId?: string;
  priority?: "Low" | "Medium" | "High" | "Critical";
  subject?: string;
  description?: string;
  attachments?: string[];
  isDraft?: boolean;
  status?: "Open" | "In Progress" | "Closed" | "Resolved";
}

export interface ApiTicketReply {
  id: string;
  ticketId: string;
  author: string;
  role: "user" | "support";
  message: string;
  timestamp: string;
  attachments?: string[];
}

export interface CreateReplyRequest {
  message: string;
  attachments?: string[];
}

export interface ApiTicketActivity {
  id: string;
  ticketId: string;
  activityType: string;
  description: string;
  timestamp: string;
  performedBy: string;
}

export interface AssignTicketRequest {
  assignedToUserId?: string;
}

// Build query string from parameters
const buildQueryString = (params: TicketListParams): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

// List tickets with filters
export const listTickets = async (
  params: TicketListParams = {},
): Promise<{
  status: number;
  data: {
    data: SupportTicket[];
    total: number;
    skip: number;
    take: number;
  } | null;
}> => {
  try {
    const queryString = buildQueryString(params);
    const response = await fetchInstance<ApiTicketListResponse>(
      `${supportEndpoint}${queryString}`,
    );

    if (!response.data) {
      return {
        status: response.status,
        data: null,
      };
    }

    // Transform API tickets to SupportTicket format
    const transformedData = {
      data: response.data.data.map(transformApiTicket),
      total: response.data.total,
      skip: response.data.skip,
      take: response.data.take,
    };

    return {
      status: response.status,
      data: transformedData,
    };
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

// Get ticket by ID
export const getTicketById = async (
  id: string,
): Promise<{
  status: number;
  data: SupportTicket | null;
}> => {
  try {
    const response = await fetchInstance<ApiTicket>(`${supportEndpoint}/${id}`);

    if (!response.data) {
      return {
        status: response.status,
        data: null,
      };
    }

    return {
      status: response.status,
      data: transformApiTicket(response.data),
    };
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error;
  }
};

// Create ticket
export const createTicket = async (
  data: CreateTicketRequest,
): Promise<{
  status: number;
  data: SupportTicket | null;
}> => {
  try {
    const response = await fetchInstance<ApiTicket>(supportEndpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.data) {
      return {
        status: response.status,
        data: null,
      };
    }

    return {
      status: response.status,
      data: transformApiTicket(response.data),
    };
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

// Update ticket
export const updateTicket = async (
  id: string,
  data: UpdateTicketRequest,
): Promise<{
  status: number;
  data: SupportTicket | null;
}> => {
  try {
    const response = await fetchInstance<ApiTicket>(`${supportEndpoint}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (!response.data) {
      return {
        status: response.status,
        data: null,
      };
    }

    return {
      status: response.status,
      data: transformApiTicket(response.data),
    };
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
};

// Delete ticket
export const deleteTicket = async (
  id: string,
): Promise<{
  status: number;
  data: null;
}> => {
  try {
    const response = await fetchInstance(`${supportEndpoint}/${id}`, {
      method: "DELETE",
    });

    return {
      status: response.status,
      data: null,
    };
  } catch (error) {
    console.error("Error deleting ticket:", error);
    throw error;
  }
};

// Get ticket activities
export const getTicketActivities = async (
  id: string,
): Promise<{
  status: number;
  data: ApiTicketActivity[] | null;
}> => {
  try {
    const response = await fetchInstance<ApiTicketActivity[]>(
      `${supportEndpoint}/${id}/activities`,
    );

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching ticket activities:", error);
    throw error;
  }
};

// Assign ticket
export const assignTicket = async (
  id: string,
  data: AssignTicketRequest,
): Promise<{
  status: number;
  data: SupportTicket | null;
}> => {
  try {
    const response = await fetchInstance<ApiTicket>(`${supportEndpoint}/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (!response.data) {
      return {
        status: response.status,
        data: null,
      };
    }

    return {
      status: response.status,
      data: transformApiTicket(response.data),
    };
  } catch (error) {
    console.error("Error assigning ticket:", error);
    throw error;
  }
};

// Get ticket replies
export const getTicketReplies = async (
  id: string,
): Promise<{
  status: number;
  data: ApiTicketReply[] | null;
}> => {
  try {
    const response = await fetchInstance<ApiTicketReply[]>(`${supportEndpoint}/${id}/replies`);

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching ticket replies:", error);
    throw error;
  }
};

// Create ticket reply
export const createTicketReply = async (
  id: string,
  data: CreateReplyRequest,
): Promise<{
  status: number;
  data: ApiTicketReply | null;
}> => {
  try {
    const response = await fetchInstance<ApiTicketReply>(`${supportEndpoint}/${id}/replies`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating ticket reply:", error);
    throw error;
  }
};

