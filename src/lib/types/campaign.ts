export interface CampaignSubmitted {
  id: string;
  campaign: {
    name: string;
    submittedDate: string;
  };
  type: string;
  targetAudience: {
    group: string;
    location: string;
  };
  budget: {
    totalBudget: string;
    perDayBudget: string;
  };
  duration: {
    mainDuration: string;
    noOfDays: string;
  };
  platforms: ("facebook" | "instagram" | "twitter" | "linkedin" | "google")[];
  status: "pending" | "approved" | "active" | "completed" | "rejected";
}
