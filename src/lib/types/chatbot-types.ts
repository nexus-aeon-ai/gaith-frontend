// ---------------------------
// Types
// ---------------------------

// Message within a conversation
export interface Message {
  id: string;
  organizationId?: string;
  conversationId?: string;
  text: string;
  sendBy?: "USER" | "AI";
  messageType?: "TEXT" | "IMAGE" | "VIDEO" | string;
  aiResponse?: {
    timestamp: string;
    responseType: string;
  } | null;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  attachments?: any[]; // You can replace `any[]` with a proper attachment type later if needed
  timestamp?: string; // Optional formatted timestamp (for UI)
}

// ---------------------------
// Assigned Employee Types
// ---------------------------

export interface AssignedEmployeeUser {
  id: string;
  fullName: string;
  email: string;
  profilePic: string | null;
}

export interface AssignedEmployeeDetails {
  id: string;
  employeeId?: string;
  userId?: string;
  organizationId?: string;
  employmentType?: string;
  status?: string;
  salary?: string;
  performanceRating?: number;
  profilePicture?: string | null;
  notes?: string | null;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  fullAddress?: string | null;
  startDate?: string;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: AssignedEmployeeUser;
}

export interface AssignedEmployee {
  id: string;
  organizationId?: string;
  conversationId?: string;
  employeeId?: string;
  assignedAt?: string;
  assignedBy?: string | null;
  isActive?: boolean;
  employee?: AssignedEmployeeDetails;
}

// ---------------------------
// Conversation Types
// ---------------------------

export interface Conversation {
  id: string;
  organizationId: string;
  title: string;
  clientId: string | null;
  lastMessageText: string;
  lastMessageDate: string;
  lastMessageSender: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;

  // Optional computed / client-side fields
  timestamp?: string; // e.g. "2h ago"
  client?: string; // e.g. "Acme Corp"
  messages?: Message[]; // Optional messages
  assignedEmployees?: AssignedEmployee[]; // Optional assigned employees
}

// ---------------------------
// Backend Types
// ---------------------------

export interface BackendConversation {
  id: string;
  organizationId: string;
  title: string;
  clientId: string | null;
  lastMessageText: string;
  lastMessageDate: string;
  lastMessageSender: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    messages: number;
  };

  // These can be absent from some responses
  assignedEmployees?: AssignedEmployee[];
  messages?: Message[];
}

export interface BackendConversationResponse {
  data: BackendConversation[];
  total?: number;
  skip?: number;
  take?: number;
}
