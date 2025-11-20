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

