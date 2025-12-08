// AI Chat Types

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant"; // UI format (lowercase)
  timestamp: string;
  attachmentUrls?: string[];
}

export interface Chat {
  id: string;
  title: string;
  client: string;
  clientId?: string | null;
  lastMessage: string;
  timestamp: string;
  messages: Message[];
  assignedEmployeeIds?: string[];
  assignedEmployees?: ChatEmployee[];
}

// API Request/Response Types

export interface ChatEmployee {
  id: string;
  employeeId: string;
  userId: string;
  fullName: string;
  organizationId: string;
  employmentType: string;
  status: string;
  salary: string;
  performanceRating: number | null;
  profilePicture: string | null;
  notes: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  fullAddress: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    profilePic: string | null;
  };
}

export interface AssignedEmployee {
  id: string;
  organizationId: string;
  conversationId: string;
  employeeId: string;
  assignedAt: string;
  assignedBy: string | null;
  isActive: boolean;
  employee: ChatEmployee;
}

export interface Conversation {
  id: string;
  organizationId: string;
  title: string;
  clientId: string | null;
  lastMessageText: string | null;
  lastMessageDate: string | null;
  lastMessageSender: "AI" | "USER" | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  client: any | null;
  assignedEmployees: AssignedEmployee[];
  _count: {
    messages: number;
  };
}

export interface CreateConversationRequest {
  title: string;
  clientId: string;
  assignedEmployeeIds?: string[];
}

export interface UpdateConversationRequest {
  title?: string;
  clientId?: string;
  assignedEmployeeIds?: string[];
}

export interface AssignEmployeesRequest {
  employeeIds: string[];
}

export interface MessageAttachment {
  id: string;
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface ChatMessage {
  id: string;
  organizationId: string;
  conversationId: string;
  text: string;
  sendBy: "USER" | "AI";
  messageType: "TEXT" | "STRUCTURED_AI_RESPONSE";
  aiResponse: {
    message: string;
    agent_id: string;
  } | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  attachments: MessageAttachment[];
}

export interface SendMessageRequest {
  text: string;
  attachmentUrls?: string[];
}

export interface SendMessageResponse {
  userMessage: ChatMessage;
  aiMessage: ChatMessage;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  employeeIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  employeeIds?: string[];
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
}

export interface AddTeamMembersRequest {
  employeeIds: string[];
}

export interface RemoveTeamMembersRequest {
  employeeIds: string[];
}

// Query parameters for filtering/sorting conversations
export interface GetConversationsParams {
  searchTerm?: string;
  clientId?: string;
  assignedEmployeeId?: string;
  skip?: number;
  take?: number;
  orderBy?: "title" | "lastMessageDate" | "createdAt" | "updatedAt";
  orderDirection?: "asc" | "desc";
}

// Response wrappers
export interface ConversationsResponse {
  data: Conversation[];
  total: number;
  skip: number;
  take: number;
}

export interface ConversationResponse {
  data: Conversation;
  status: number;
}

export interface MessagesResponse {
  data: ChatMessage[];
  status: number;
}

export interface MessageResponse {
  data: SendMessageResponse;
  status: number;
}

export interface TeamsResponse {
  data: Team[];
  status: number;
}

export interface TeamResponse {
  data: Team;
  status: number;
}

