import { fetchInstance } from "../../clients";
import type {
  AddTeamMembersRequest,
  AssignEmployeesRequest,
  ChatMessage,
  Conversation,
  CreateConversationRequest,
  CreateTeamRequest,
  GetConversationsParams,
  RemoveTeamMembersRequest,
  SendMessageRequest,
  SendMessageResponse,
  Team,
  UpdateConversationRequest,
  UpdateTeamRequest,
} from "../../types/ai-chat";

const aiChatEndpoint = "/ai-chat";

// Helper to build query string from params
const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

// ============ Conversations ============

/**
 * List all conversations with optional filters and sorting
 */
export const getConversations = async (params?: GetConversationsParams): Promise<{
  status: number;
  data: Conversation[] | null;
}> => {
  const queryString = params ? buildQueryString(params) : "";
  const response = await fetchInstance<{ data: Conversation[]; total: number; skip: number; take: number }>(
    `${aiChatEndpoint}/conversations${queryString}`,
  );

  if (!response.data || !response.data.data) {
    return {
      status: response.status,
      data: null,
    };
  }

  return {
    status: response.status,
    data: response.data.data,
  };
};

/**
 * Get conversation by ID
 */
export const getConversationById = async (
  id: string,
): Promise<{
  status: number;
  data: Conversation | null;
}> => {
  const response = await fetchInstance<Conversation>(`${aiChatEndpoint}/conversations/${id}`);

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

/**
 * Create a new conversation
 */
export const createConversation = async (
  data: CreateConversationRequest,
): Promise<{
  status: number;
  data: Conversation | null;
}> => {
  try {
    const response = await fetchInstance<Conversation>(`${aiChatEndpoint}/conversations`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

/**
 * Partially update a conversation
 */
export const updateConversation = async (
  id: string,
  data: UpdateConversationRequest,
): Promise<{
  status: number;
  data: Conversation | null;
}> => {
  try {
    const response = await fetchInstance<Conversation>(`${aiChatEndpoint}/conversations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error updating conversation:", error);
    throw error;
  }
};

/**
 * Delete a conversation
 */
export const deleteConversation = async (
  id: string,
): Promise<{
  status: number;
  data: null;
}> => {
  try {
    const response = await fetchInstance(`${aiChatEndpoint}/conversations/${id}`, {
      method: "DELETE",
    });

    return response as { status: number; data: null };
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
};

/**
 * Assign employees to a conversation
 */
export const assignEmployeesToConversation = async (
  id: string,
  data: AssignEmployeesRequest,
): Promise<{
  status: number;
  data: Conversation | null;
}> => {
  try {
    const response = await fetchInstance<Conversation>(
      `${aiChatEndpoint}/conversations/${id}/assign-employees`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error assigning employees to conversation:", error);
    throw error;
  }
};

// ============ Messages ============

/**
 * List messages in a conversation
 */
export const getConversationMessages = async (
  conversationId: string,
): Promise<{
  status: number;
  data: ChatMessage[] | null;
}> => {
  const response = await fetchInstance<{ data: ChatMessage[]; total: number; skip: number; take: number }>(
    `${aiChatEndpoint}/conversations/${conversationId}/messages`,
  );

  if (!response.data || !response.data.data) {
    return {
      status: response.status,
      data: null,
    };
  }

  return {
    status: response.status,
    data: response.data.data,
  };
};

/**
 * Send a message to AI
 */
export const sendMessage = async (
  conversationId: string,
  data: SendMessageRequest,
): Promise<{
  status: number;
  data: SendMessageResponse | null;
}> => {
  try {
    const response = await fetchInstance<SendMessageResponse>(
      `${aiChatEndpoint}/conversations/${conversationId}/messages`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// ============ Teams ============

/**
 * List all teams
 */
export const getTeams = async (): Promise<{
  status: number;
  data: Team[] | null;
}> => {
  const response = await fetchInstance<Team[]>(`${aiChatEndpoint}/teams`);

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

/**
 * Get team by ID
 */
export const getTeamById = async (
  id: string,
): Promise<{
  status: number;
  data: Team | null;
}> => {
  const response = await fetchInstance<Team>(`${aiChatEndpoint}/teams/${id}`);

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

/**
 * Create a new team
 */
export const createTeam = async (
  data: CreateTeamRequest,
): Promise<{
  status: number;
  data: Team | null;
}> => {
  try {
    const response = await fetchInstance<Team>(`${aiChatEndpoint}/teams`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating team:", error);
    throw error;
  }
};

/**
 * Partially update a team
 */
export const updateTeam = async (
  id: string,
  data: UpdateTeamRequest,
): Promise<{
  status: number;
  data: Team | null;
}> => {
  try {
    const response = await fetchInstance<Team>(`${aiChatEndpoint}/teams/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error updating team:", error);
    throw error;
  }
};

/**
 * Delete a team
 */
export const deleteTeam = async (
  id: string,
): Promise<{
  status: number;
  data: null;
}> => {
  try {
    const response = await fetchInstance(`${aiChatEndpoint}/teams/${id}`, {
      method: "DELETE",
    });

    return response as { status: number; data: null };
  } catch (error) {
    console.error("Error deleting team:", error);
    throw error;
  }
};

/**
 * Add members to a team
 */
export const addTeamMembers = async (
  id: string,
  data: AddTeamMembersRequest,
): Promise<{
  status: number;
  data: Team | null;
}> => {
  try {
    const response = await fetchInstance<Team>(`${aiChatEndpoint}/teams/${id}/members`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error adding team members:", error);
    throw error;
  }
};

/**
 * Remove members from a team
 */
export const removeTeamMembers = async (
  id: string,
  data: RemoveTeamMembersRequest,
): Promise<{
  status: number;
  data: Team | null;
}> => {
  try {
    const response = await fetchInstance<Team>(`${aiChatEndpoint}/teams/${id}/members`, {
      method: "DELETE",
      body: JSON.stringify(data),
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error removing team members:", error);
    throw error;
  }
};

