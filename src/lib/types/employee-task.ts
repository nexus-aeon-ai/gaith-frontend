export interface EmployeeTask {
  id: string;
  title: string;
  description: string;
  assignee: {
    id: string;
    name: string;
    department?: string;
    email: string;
    avatar?: string;
  };
  client?: {
    id: string;
    name: string;
  };
  dueDate: string;
  createdDate: string;
  priority: "Urgent" | "High" | "Medium" | "Low";
  status: "Completed" | "InProgress" | "AwaitingFeedback" | "NotStarted";
  populationStatus?: "Draft" | "Review" | "SentToClient" | "ApprovedByClient";
  progress: number;
  category: {
    id: string;
    name: string;
  };
  estimatedHours?: number;
  actualHours?: number;
  additionalComments?: string;
  activityLog?: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  description: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  assignedTo: string;
  accountId?: string;
  dueDate: string;
  priority: "Urgent" | "High" | "Medium" | "Low";
  status: "Completed" | "InProgress" | "AwaitingFeedback" | "NotStarted";
  populationStatus?: "Draft" | "Review" | "SentToClient" | "ApprovedByClient";
  category: string;
  estimatedHours?: number;
  additionalComments?: string;
}

