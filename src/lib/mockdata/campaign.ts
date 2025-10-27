import { CampaignSubmitted } from "@/lib/types";

export const mockCampaigns: CampaignSubmitted[] = [
  {
    id: "CMP-2024-001",
    campaign: {
      name: "Summer Sale Blast",
      submittedDate: "2025-06-15",
    },
    type: "Display",
    targetAudience: {
      group: "Adults 25-45",
      location: "US, CA - Both Genders",
    },
    budget: {
      totalBudget: "$15,000",
      perDayBudget: "$500",
    },
    duration: {
      mainDuration: "Dec 20 - Jan 15",
      noOfDays: "26 days",
    },
    platforms: ["linkedin", "google", "instagram", "facebook"],
    status: "active",
  },
  {
    id: "CMP-2024-002",
    campaign: {
      name: "Holiday Gift Guide",
      submittedDate: "2025-10-05",
    },
    type: "Video",
    targetAudience: {
      group: "Adults 30-55",
      location: "US, UK - Both Genders",
    },
    budget: {
      totalBudget: "$25,000",
      perDayBudget: "$750",
    },
    duration: {
      mainDuration: "Nov 01 - Dec 10",
      noOfDays: "40 days",
    },
    platforms: ["linkedin", "google", "instagram", "facebook"],

    status: "pending",
  },
  {
    id: "CMP-2024-003",
    campaign: {
      name: "Fitness Challenge 2025",
      submittedDate: "2025-09-20",
    },
    type: "Email",
    targetAudience: {
      group: "Young Adults 18-35",
      location: "US, CA, MX - Both Genders",
    },
    budget: {
      totalBudget: "$8,500",
      perDayBudget: "$425",
    },
    duration: {
      mainDuration: "Oct 15 - Nov 05",
      noOfDays: "22 days",
    },
    platforms: ["linkedin", "google", "instagram", "facebook"],

    status: "completed",
  },
  {
    id: "CMP-2024-004",
    campaign: {
      name: "Back to School Promo",
      submittedDate: "2025-07-10",
    },
    type: "Search",
    targetAudience: {
      group: "Parents 30-50",
      location: "US, CA - Both Genders",
    },
    budget: {
      totalBudget: "$12,000",
      perDayBudget: "$600",
    },
    duration: {
      mainDuration: "Aug 05 - Aug 25",
      noOfDays: "21 days",
    },
    platforms: ["linkedin", "google", "instagram", "facebook"],

    status: "completed",
  },
  {
    id: "CMP-2024-005",
    campaign: {
      name: "Tech Product Showcase",
      submittedDate: "2025-08-18",
    },
    type: "Display",
    targetAudience: {
      group: "Tech Enthusiasts 22-40",
      location: "US, CA, UK - Male",
    },
    budget: {
      totalBudget: "$20,000",
      perDayBudget: "$800",
    },
    duration: {
      mainDuration: "Sep 10 - Oct 05",
      noOfDays: "26 days",
    },
    platforms: ["linkedin", "google", "instagram", "facebook"],

    status: "approved",
  },
  {
    id: "CMP-2024-006",
    campaign: {
      name: "Spring Fashion Week",
      submittedDate: "2025-02-28",
    },
    type: "Email",
    targetAudience: {
      group: "Women 20-45",
      location: "US, UK - Female",
    },
    budget: {
      totalBudget: "$18,500",
      perDayBudget: "$650",
    },
    duration: {
      mainDuration: "Mar 15 - Apr 12",
      noOfDays: "29 days",
    },
    platforms: ["linkedin", "google", "instagram", "facebook"],

    status: "completed",
  },
  {
    id: "CMP-2024-007",
    campaign: {
      name: "Local Business Boost",
      submittedDate: "2025-09-05",
    },
    type: "Email",
    targetAudience: {
      group: "Adults 25-65",
      location: "US - Both Genders",
    },
    budget: {
      totalBudget: "$5,000",
      perDayBudget: "$250",
    },
    duration: {
      mainDuration: "Sep 20 - Oct 10",
      noOfDays: "21 days",
    },
    platforms: ["linkedin", "google", "instagram", "facebook"],

    status: "rejected",
  },
  {
    id: "CMP-2024-008",
    campaign: {
      name: "Black Friday Mega Sale",
      submittedDate: "2025-10-20",
    },
    type: "Video",
    targetAudience: {
      group: "Shoppers 18-60",
      location: "US, CA - Both Genders",
    },
    budget: {
      totalBudget: "$35,000",
      perDayBudget: "$1,250",
    },
    duration: {
      mainDuration: "Nov 22 - Dec 20",
      noOfDays: "29 days",
    },
    platforms: ["linkedin", "google", "instagram", "facebook"],

    status: "pending",
  },
];
