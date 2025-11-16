import { fetchInstance } from "../../clients";

const faqsEndpoint = "/support/faqs";

// Query parameters for listing FAQs
export interface FaqListParams {
  searchTerm?: string;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

// API response types
export interface FAQ {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface FaqListResponse {
  data: FAQ[];
  total: number;
  skip: number;
  take: number;
}

// Build query string from parameters
const buildQueryString = (params: FaqListParams): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

// Get all FAQs with filters
export const getFaqs = async (
  params: FaqListParams = {},
): Promise<{
  status: number;
  data: FaqListResponse | null;
}> => {
  try {
    const queryString = buildQueryString(params);
    const response = await fetchInstance<FaqListResponse>(`${faqsEndpoint}${queryString}`);

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    throw error;
  }
};

