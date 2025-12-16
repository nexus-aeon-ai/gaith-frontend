import { fetchInstance } from "../clients";

// Request payload types
export interface GenerateBlogRequest {
  platform: string;
  topic: string;
  company_website: string;
  clientId?: string;
}

export interface GenerateCalendarRequest {
  start_date: string; // DD-MM-YYYY format
  end_date: string; // DD-MM-YYYY format
  post_per_week: number;
  clientId?: string;
}

export interface GenerateMarketingPlanRequest {
  company_website: string;
  clientId?: string;
}

export interface GenerateMediaBuyingRequest {
  platform: string;
  clientId?: string;
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
export interface MarketingPlanListItem {
  id: number;
  created_at: string;
  updated_at: string;
  status: "draft" | "completed" | "failed";
}

export interface MarketingPlanListResponse {
  details: {
    message: {
      count: number;
      num_pages: number;
      current_page: number;
      has_next: boolean;
      has_previous: boolean;
      next_page: number | null;
      previous_page: number | null;
      results: MarketingPlanListItem[];
    };
  };
}

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

export interface MarketingPlanDetails {
  marketing_plan: MarketingPlanData;
  created_at: string;
  updated_at: string;
  status: "draft" | "completed" | "failed";
}

export interface MarketingPlanSingleResponse {
  details: {
    message: MarketingPlanDetails;
  };
}

/**
 * Media Buying Data Structure
 */
export interface MediaBuyingListItem {
  id: number;
  created_at: string;
  updated_at: string;
  status: "draft" | "completed" | "failed";
}

export interface MediaBuyingListResponse {
  details: {
    message: {
      count: number;
      num_pages: number;
      current_page: number;
      has_next: boolean;
      has_previous: boolean;
      next_page: number | null;
      previous_page: number | null;
      results: MediaBuyingListItem[];
    };
  };
}

export interface MediaBuyingAudience {
  audience_name: string;
  interests: string[];
  pain_points: string[];
  demographics: string;
  platform_behavior: string;
}

export interface MediaBuyingBudgetMonth {
  month: string;
  amount: string;
  focus: string;
}

export interface MediaBuyingBudgetAllocation {
  amount: string;
  percentage: string;
  reasoning: string;
}

export interface MediaBuyingCampaignTypeAllocation {
  awareness_campaigns: { amount?: string; percentage?: string };
  consideration_campaigns: { amount?: string; percentage?: string };
  conversion_campaigns: { amount?: string; percentage?: string };
}

export interface MediaBuyingBudgetBreakdown {
  total_budget: string;
  monthly_breakdown: MediaBuyingBudgetMonth[];
  platform_allocation: MediaBuyingBudgetAllocation;
  campaign_type_allocation: MediaBuyingCampaignTypeAllocation;
}

export interface MediaBuyingPaidAdsRecommendation {
  budget_pacing: string;
  bidding_strategy: string;
  creative_rotation: string;
  optimization_goal: string;
  platform_specific_tips: string;
  audience_targeting_approach: string;
}

export interface MediaBuyingData {
  campaign_count: string;
  target_audiences: MediaBuyingAudience[];
  suggested_platforms: string;
  estimated_budget_breakdown: MediaBuyingBudgetBreakdown;
  paid_ads_algorithm_recommendation: MediaBuyingPaidAdsRecommendation;
}

export interface MediaBuyingDetails {
  media_buying: MediaBuyingData;
  created_at: string;
  updated_at: string;
  status: "draft" | "completed" | "failed";
}

export interface MediaBuyingSingleResponse {
  details: {
    message: MediaBuyingDetails;
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
    message: {
      count: number;
      num_pages: number;
      current_page: number;
      has_next: boolean;
      has_previous: boolean;
      next_page: number | null;
      previous_page: number | null;
      results: CalendarListItem[];
    };
  };
}

// Response for single calendar with data
export interface SocialMediaCalendarResponse {
  details: {
    message: SocialMediaCalendarData;
  };
}

/**
 * Get marketing plans list
 * GET /reports/marketing-plan
 */
export const getMarketingPlans = async (
  page?: number,
): Promise<{ status: number; data: MarketingPlanListResponse | null }> => {
  let url = "/reports/marketing-plan";
  const params = new URLSearchParams();

  if (page !== undefined) {
    params.append("page", String(page));
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetchInstance<MarketingPlanListResponse>(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};

/**
 * Get single marketing plan by ID
 * GET /reports/marketing-plan?marketing_plan_id={id}
 */
export const getMarketingPlan = async (
  marketing_plan_id: number,
): Promise<{ status: number; data: MarketingPlanSingleResponse | null }> => {
  const url = `/reports/marketing-plan?marketing_plan_id=${marketing_plan_id}`;

  const response = await fetchInstance<MarketingPlanSingleResponse>(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};

/**
 * Update marketing plan
 * PUT /reports/marketing-plan
 */
export const updateMarketingPlan = async (
  marketing_plan_id: number,
  marketing_plan_data: MarketingPlanData,
): Promise<{ status: number; data: unknown | null }> => {
  const response = await fetchInstance<unknown>("/reports/marketing-plan", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ marketing_plan_id, marketing_plan_data }),
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
): Promise<{ status: number; data: MediaBuyingListResponse | null }> => {
  let url = "/reports/media-buying";

  if (page !== undefined) {
    url += `?page=${page}`;
  }

  const response = await fetchInstance<MediaBuyingListResponse>(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};

/**
 * Get single media buying plan
 * GET /reports/media-buying?media_buying_id={id}
 */
export const getMediaBuyingPlan = async (
  media_buying_id: number,
): Promise<{ status: number; data: MediaBuyingSingleResponse | null }> => {
  const url = `/reports/media-buying?media_buying_id=${media_buying_id}`;

  const response = await fetchInstance<MediaBuyingSingleResponse>(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};

/**
 * Update media buying plan
 * PUT /reports/media-buying
 */
export const updateMediaBuyingPlan = async (
  media_buying_id: number,
  media_buying_data: MediaBuyingData,
): Promise<{ status: number; data: unknown | null }> => {
  const response = await fetchInstance<unknown>("/reports/media-buying", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ media_buying_id, media_buying_data }),
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

  console.log("calendar id:", calendar_id);
  console.log("calendar data:", calendar_data);
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

// Blog Post Types
export interface BlogPostListItem {
  id: number;
  title?: string;
  created_at: string;
  updated_at: string;
  status: "draft" | "completed" | "failed";
}

export interface BlogPostData {
  title: string;
  content: string;
  keywords: string[];
  reference_links?: string[];
}

export interface BlogPostResponse {
  blog_post: BlogPostData;
  created_at: string;
  updated_at: string;
  status: "draft" | "completed" | "failed";
}

export interface BlogPostListResponse {
  details: {
    message: {
      count: number;
      num_pages: number;
      current_page: number;
      has_next: boolean;
      has_previous: boolean;
      next_page: number | null;
      previous_page: number | null;
      results: BlogPostListItem[];
    };
  };
}

export interface BlogPostSingleResponse {
  details: {
    message: BlogPostResponse;
  };
}

/**
 * Get blog posts list
 * GET /reports/blog-post
 */
export const getBlogs = async (
  page?: number,
): Promise<{ status: number; data: BlogPostListResponse | null }> => {
  let url = "/reports/blog-post";
  const params = new URLSearchParams();
  
  if (page !== undefined) {
    params.append("page", String(page));
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetchInstance<BlogPostListResponse>(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

/**
 * Get single blog post by ID
 * GET /reports/blog-post?blog_post_id={id}
 */
export const getBlogPost = async (
  blog_post_id: number,
): Promise<{ status: number; data: BlogPostSingleResponse | null }> => {
  const url = `/reports/blog-post?blog_post_id=${blog_post_id}`;

  const response = await fetchInstance<BlogPostSingleResponse>(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};

/**
 * Update blog post
 * PUT /reports/blog-post?blog_post_id={id}
 */
export const updateBlogPost = async (
  blog_post_id: number,
  blog_post_data: BlogPostData,
): Promise<{ status: number; data: unknown | null }> => {
  const url = `/reports/blog-post?blog_post_id=${blog_post_id}`;

  const response = await fetchInstance<unknown>(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      blog_post_id,
      blog_post_data,
    }),
  });

  return response;
};

/**
 * Publish blog post
 * PUT /reports/blog-post?blog_post_id={id}
 *
 * The payload should include blog_post_id and blog_post_data with status 'published' and the rest of the original data.
 */
export const publishBlog = async (
  blog_post_id: number,
  blog_post_data: {
    title: string;
    content: string;
    keywords: string[];
    reference_links?: string[];
    status?: string;
  },
): Promise<{ status: number; data: unknown | null }> => {
  const url = `/reports/blog-post?blog_post_id=${blog_post_id}`;
  const response = await fetchInstance<unknown>(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      blog_post_id,
      blog_post_data: {
        ...blog_post_data,
        status: "published",
      },
    }),
  });
  return response;
};

