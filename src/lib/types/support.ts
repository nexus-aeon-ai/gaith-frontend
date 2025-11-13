export interface SupportTicket {
  id: string;
  ticketId: string;
  subject: string;
  description: string;
  category: "Technical" | "Billing" | "General" | "Feature Request";
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Closed" | "Resolved";
  createdDate: string;
  lastUpdated: string;
  createdBy: string;
  assignedTo?: string;
  attachments?: string[];
}

export interface SubmitTicketForm {
  category: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  subject: string;
  description: string;
  attachments?: File[];
}

