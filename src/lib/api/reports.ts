import { fetchInstance } from "../clients";

// Request payload types
export interface GenerateBlogRequest {
  platform: string;
  topic: string;
  company_website: string;
}

export interface GenerateCalendarRequest {
  start_date: string; // DD-MM-YYYY format
  end_date: string; // DD-MM-YYYY format
  post_per_week: number;
}

export interface GenerateMarketingPlanRequest {
  company_website: string;
}

export interface GenerateMediaBuyingRequest {
  platform: string;
}

// Response types (generic for now, can be refined based on actual API responses)
export interface GenerateBlogResponse {
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

export interface GenerateCalendarResponse {
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

export interface GenerateMarketingPlanResponse {
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

export interface GenerateMediaBuyingResponse {
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

/**
 * Generate blog post
 * POST /reports/generate/blog
 */
export const generateBlog = async (
  payload: GenerateBlogRequest,
): Promise<{ status: number; data: GenerateBlogResponse | null }> => {
  const response = await fetchInstance<GenerateBlogResponse>("/reports/generate/blog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: payload }),
  });

  return response;
};

/**
 * Generate social media calendar
 * POST /reports/generate/calendar
 */
export const generateCalendar = async (
  payload: GenerateCalendarRequest,
): Promise<{ status: number; data: GenerateCalendarResponse | null }> => {
  const response = await fetchInstance<GenerateCalendarResponse>("/reports/generate/calendar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: payload }),
  });

  return response;
};

/**
 * Generate marketing plan
 * POST /reports/generate/marketing-plan
 */
export const generateMarketingPlan = async (
  payload: GenerateMarketingPlanRequest,
): Promise<{ status: number; data: GenerateMarketingPlanResponse | null }> => {
  const response = await fetchInstance<GenerateMarketingPlanResponse>(
    "/reports/generate/marketing-plan",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: payload }),
    },
  );

  return response;
};

/**
 * Generate media buying plan
 * POST /reports/generate/media-buying
 */
export const generateMediaBuying = async (
  payload: GenerateMediaBuyingRequest,
): Promise<{ status: number; data: GenerateMediaBuyingResponse | null }> => {
  const response = await fetchInstance<GenerateMediaBuyingResponse>(
    "/reports/generate/media-buying",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: payload }),
    },
  );

  return response;
};

// GET endpoints for retrieving reports

/**
 * Marketing Plan Data Structure
 */
export interface MarketingPlanData {
  strategies: string[];
  review_process: string;
  target_audience: string;
  metrics_and_kpis: string[];
  executive_summary: string;
  situation_analysis: string;
  budget_and_resources: {
    "events/webinars": string;
    "content development": string;
    "digital advertising": string;
    "website optimization": string;
  };
  goals_and_objectives: string[];
  tactics_and_action_plan: string[];
}

export interface MarketingPlan {
  marketing_plan_id: number;
  marketing_plan_data: MarketingPlanData;
}

/**
 * Media Buying Data Structure
 */
export interface MediaBuyingItem {
  id: number;
  created_at: string;
  updated_at: string;
  status: "draft" | "completed" | "failed";
}

export interface MediaBuyingResponse {
  details: {
    message: MediaBuyingItem[];
  };
}

/**
 * Social Media Calendar Data Structure
 */
export interface CalendarEntry {
  date: string;
  content: string;
  platform: string;
  post_details: string;
}

export interface CalendarListItem {
  id: number;
  created_at: string;
  updated_at: string;
  status: "draft" | "completed" | "failed";
}

export interface SocialMediaCalendarData {
  calendar: {
    calendar: CalendarEntry[];
  };
  created_at: string;
  updated_at: string;
  status: "draft" | "completed" | "failed";
}

// Response for list of calendars
export interface SocialMediaCalendarListResponse {
  details: {
    message: CalendarListItem[];
  };
}

// Response for single calendar with data
export interface SocialMediaCalendarResponse {
  details: {
    message: SocialMediaCalendarData;
  };
}

/**
 * Get marketing plans
 * GET /reports/marketing-plan
 */
export const getMarketingPlans = async (
  marketing_plan_id?: number,
  page?: number,
): Promise<{ status: number; data: MarketingPlan | MarketingPlan[] | null }> => {
  let url = "/reports/marketing-plan";
  const params = new URLSearchParams();
  
  if (marketing_plan_id !== undefined) {
    params.append("marketing_plan_id", String(marketing_plan_id));
  }
  if (page !== undefined) {
    params.append("page", String(page));
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetchInstance<MarketingPlan | MarketingPlan[]>(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};

/**
 * Publish marketing plan
 * PUT /reports/marketing-plan
 */
export const publishMarketingPlan = async (
  id: number,
): Promise<{ status: number; data: unknown | null }> => {
  const response = await fetchInstance<unknown>("/reports/marketing-plan", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ marketing_plan_id: id }),
  });

  return response;
};

/**
 * Get media buying plans
 * GET /reports/media-buying
 */
export const getMediaBuyingPlans = async (
  page?: number,
): Promise<{ status: number; data: MediaBuyingResponse | null }> => {
  let url = "/reports/media-buying";
  
  if (page !== undefined) {
    url += `?page=${page}`;
  }

  const response = await fetchInstance<MediaBuyingResponse>(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};

/**
 * Publish media buying plan
 * PUT /reports/media-buying
 */
export const publishMediaBuyingPlan = async (
  id: number,
): Promise<{ status: number; data: unknown | null }> => {
  const response = await fetchInstance<unknown>("/reports/media-buying", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ media_buying_id: id }),
  });

  return response;
};

/**
 * Get social media calendars (list) or specific calendar by ID
 * GET /reports/social-media-calendar or GET /reports/social-media-calendar?calendar_id=X
 */
export const getSocialMediaCalendars = async (
  calendar_id?: number,
  page?: number,
): Promise<{ status: number; data: SocialMediaCalendarListResponse | SocialMediaCalendarResponse | null }> => {
  let url = "/reports/social-media-calendar";
  const params = new URLSearchParams();
  
  if (calendar_id !== undefined) {
    params.append("calendar_id", String(calendar_id));
  }
  if (page !== undefined) {
    params.append("page", String(page));
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetchInstance<SocialMediaCalendarListResponse | SocialMediaCalendarResponse>(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

/**
 * Update social media calendar
 * PUT /reports/social-media-calendar
 */
export const updateSocialMediaCalendar = async (
  calendar_id: number,
  calendar_data: { calendar: CalendarEntry[] },
): Promise<{ status: number; data: unknown | null }> => {
  const response = await fetchInstance<unknown>("/reports/social-media-calendar", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ calendar_id, calendar_data }),
  });

  return response;
};

/**
 * Publish social media calendar
 * PUT /reports/social-media-calendar
 */
export const publishSocialMediaCalendar = async (
  id: number,
): Promise<{ status: number; data: unknown | null }> => {
  const response = await fetchInstance<unknown>("/reports/social-media-calendar", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ calendar_id: id }),
  });

  return response;
};

/**
 * Publish blog post
 * PUT /reports/blog
 */
export const publishBlog = async (
  id: number,
): Promise<{ status: number; data: unknown | null }> => {
  const response = await fetchInstance<unknown>("/reports/blog", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ blog_id: id }),
  });

  return response;
};

/**
 * Get blog posts
 * GET /reports/blog
 */
export const getBlogs = async (
  page?: number,
): Promise<{ status: number; data: unknown | null }> => {
  let url = "/reports/blog";
  
  if (page !== undefined) {
    url += `?page=${page}`;
  }

  const response = await fetchInstance<unknown>(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};

