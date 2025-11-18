import { fetchInstance } from "../../clients";

const issueCategoriesEndpoint = "/support/lookups/issue-categories";

export interface IssueCategory {
  id: string;
  name: string;
  description?: string;
}

export interface CreateIssueCategoryRequest {
  name: string;
  description?: string;
}

// Get all issue categories
export const getIssueCategories = async (): Promise<{
  status: number;
  data: IssueCategory[] | null;
}> => {
  try {
    const response = await fetchInstance<IssueCategory[]>(issueCategoriesEndpoint);

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching issue categories:", error);
    throw error;
  }
};

// Create new issue category
export const createIssueCategory = async (
  data: CreateIssueCategoryRequest,
): Promise<{
  status: number;
  data: IssueCategory | null;
}> => {
  try {
    const response = await fetchInstance<IssueCategory>(issueCategoriesEndpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating issue category:", error);
    throw error;
  }
};

