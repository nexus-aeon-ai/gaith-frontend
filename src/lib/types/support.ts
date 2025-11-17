export interface SupportTicket {
  id: string;
  ticketId: string; // Generated from id for display
  subject: string;
  description: string;
  issueCategoryId: string;
  issueCategory?: {
    id: string;
    name: string;
    description?: string;
  };
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Closed" | "Resolved";
  createdDate: string; // Formatted date
  lastUpdated: string; // Formatted date
  createdBy: string; // User fullName
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    fullName: string;
    email: string;
  }; // User fullName
  assignedToUserId?: string | null;
  attachments?: string[]; // URLs to attachments
  isDraft: boolean;
  organizationId?: string;
  userId?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface SubmitTicketForm {
  issueCategoryId: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  subject: string;
  description: string;
  attachments?: File[];
  isDraft: boolean;
  assignedToUserId?: string | null;
}

export interface IssueCategory {
  id: string;
  name: string;
  description?: string;
}

export interface TicketListFilters {
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

export interface TicketListResponse {
  data: SupportTicket[];
  total: number;
  skip: number;
  take: number;
}

export interface TicketReply {
  id: string;
  ticketId: string;
  author: string;
  role: "user" | "support";
  message: string;
  timestamp: string;
  attachments?: string[];
}

export interface TicketActivity {
  id: string;
  ticketId: string;
  activityType: string;
  description: string;
  timestamp: string;
  performedBy: string;
}

export interface FAQ {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface FaqListFilters {
  searchTerm?: string;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}
