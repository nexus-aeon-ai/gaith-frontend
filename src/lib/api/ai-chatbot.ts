import { formatTimeAgo } from "@/lib/functions";
import { BackendConversation, BackendConversationResponse, Conversation } from "@/lib/types";

import { fetchInstance } from "../clients";


// API endpoint base
const conversationsEndpoint = "/ai-chat";

// ---------------------------
// Transformers
// ---------------------------

const transformConversation = (backend: BackendConversation): Conversation => ({
  id: backend.id,
  organizationId: backend.organizationId,
  title: backend.title,
  clientId: backend.clientId,
  lastMessageText: backend.lastMessageText,
  lastMessageDate: backend.lastMessageDate,
  lastMessageSender: backend.lastMessageSender,
  isActive: backend.isActive,
  isDeleted: backend.isDeleted,
  createdAt: backend.createdAt,
  updatedAt: backend.updatedAt,
  timestamp: formatTimeAgo(backend.updatedAt),
  client: backend.clientId || "Unknown Client",
  // messageCount: backend._count?.messages || 0,
  // assignedEmployees:
  //   backend.assignedEmployees?.map(a => ({
  //     id: a.id,
  //     employeeId: a.employee.employeeId,
  //     fullName: a.employee.user.fullName,
  //     email: a.employee.user.email,
  //   })) || [],
});

// ---------------------------
// API Functions
// ---------------------------

// Fetch list of conversations
export const getConversations = async ({
  skip = 0,
  take = 10,
  orderBy = "lastMessageDate",
  orderDirection = "desc",
}: {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
} = {}): Promise<{
  status: number;
  data: Conversation[] | null;
}> => {
  const url = `${conversationsEndpoint}/conversations?skip=${skip}&take=${take}&orderBy=${orderBy}&orderDirection=${orderDirection}`;
  const response = await fetchInstance<BackendConversationResponse>(url);

  if (!response.data) {
    return { status: response.status, data: null };
  }

  const transformed = response.data.data.map(transformConversation);
  return { status: response.status, data: transformed };
};

// Fetch single conversation by ID
export const getConversationById = async (
  id: string,
): Promise<{ status: number; data: Conversation | null }> => {
  const response = await fetchInstance<BackendConversation>(`${conversationsEndpoint}/conversations/${id}`);

  if (!response.data) return { status: response.status, data: null };

  const backend = response.data;

  const conversation: Conversation = {
    id: backend.id,
    organizationId: backend.organizationId,
    title: backend.title,
    clientId: backend.clientId,
    lastMessageText: backend.lastMessageText,
    lastMessageDate: backend.lastMessageDate,
    lastMessageSender: backend.lastMessageSender,
    isActive: backend.isActive,
    isDeleted: backend.isDeleted,
    createdAt: backend.createdAt,
    updatedAt: backend.updatedAt,
    timestamp: formatTimeAgo(backend.updatedAt),
    client: backend.clientId || "Unknown Client",
    messages:
      backend.messages?.map(m => ({
        id: m.id,
        text: m.text,
        sender: m.sendBy === "USER" ? "user" : "assistant",
        timestamp: m.createdAt,
      })) ?? [],
    assignedEmployees:
      backend.assignedEmployees?.map(a => ({
        id: a.id,
        employeeId: a.employee.employeeId,
        fullName: a.employee.user.fullName,
        email: a.employee.user.email,
      })) ?? [],
  };

  return {
    status: response.status,
    data: conversation,
  };
};


// Send message to a conversation
export const sendMessageToConversation = async (
  conversationId: string,
  messageData: {
    text: string;
    attachmentUrls: string[];
  },
): Promise<{
  status: number;
  data: {
    id: string;
    text: string;
    sendBy: string;
    createdAt: string;
    attachmentUrls?: string[];
  } | null;
}> => {
  const url = `${conversationsEndpoint}/conversations/${conversationId}/messages`;

  const response = await fetchInstance<{
    id: string;
    text: string;
    sendBy: string;
    createdAt: string;
    attachmentUrls?: string[];
  }>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: messageData.text,
      attachmentUrls: messageData.attachmentUrls || [],
    }),
  });

  if (!response.data) {
    return { status: response.status, data: null };
  }

  if (response.status !== 201 && response.status !== 200) {
    throw new Error(
      (response.data as unknown as { message?: string })?.message || "Failed to send message",
    );
  }

  return {
    status: response.status,
    data: response.data,
  };
};
