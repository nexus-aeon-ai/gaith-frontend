export interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  status: "Active" | "Inactive" | "Pending";
  agreementPeriod: {
    start: string;
    end: string;
  };
  marketRegion: string;
  services: string;
  contactInfo: string;
  assignedTo: {
    name: string;
    initial: string;
    color: string;
  }[];
  assignedUsers?: any[]; // Array of user IDs or names
  createdAt?: string; // ISO date string for filtering
}
