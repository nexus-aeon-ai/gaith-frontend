// Client Management Types

export interface Client {
  id: string;
  name: string;
  email: string;
  clientName: string;
  status: "Active" | "Inactive" | "Pending";
  agreementPeriod: {
    start: string;
    end: string;
  };
  marketRegion: string;
  industrySector: string;
  services: string;
  contactInfo: string;
  assignedTo: {
    name: string;
    initial: string;
    color: string;
  }[];
}

// Tab Component Props
export interface MainInformationTabProps {
  client: {
    agreementStartDate: string;
    agreementEndDate: string;
  };
}

export interface CampaignTasksTabProps {
  setShowPendingTasks: (show: boolean) => void;
  setShowCampaignOverview: (show: boolean) => void;
}

export interface HistoricalPerformanceTabProps {
  client: Client;
}

export interface IntegrationsTabProps {
  client: Client;
}

// Campaign and Task Types
export interface Campaign {
  id: string;
  name: string;
  type: string;
  endDate: string;
  status: "Inprogress" | "On Track" | "Completed";
  tasksRemaining: number;
  budget: {
    totalBudget: string;
    perDayBudget: string;
  };
  roi: string;
  lastUpdated: string;
  icon: string;
  iconColor: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  due: string;
  priority: "High Priority" | "Medium Priority" | "Low";
  time: string;
  icon: string;
  iconColor: string;
}

// Generic Paginated Response
export interface TGenericPaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string | null;
  previous?: string | null;
  page_count: number;
}
