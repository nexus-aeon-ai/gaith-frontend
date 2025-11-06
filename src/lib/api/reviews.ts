import { fetchInstance } from "../clients";
import type { IResponse } from "../types/general";

const reviewTypesEndpoint = "/review-types";
const reviewFocusAreaEndpoint = "/review-focus-areas";

export interface IReviewType {
  id: string;
  name: string;
  organizationId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IReviewFocusArea {
  id: string;
  name: string;
  organizationId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeReviewPayload {
  reviewTypeId: string;
  reviewerEmployeeId: string;
  meetingFormat: string;
  scheduledDate: string;
  scheduledTime: string;
  reviewPeriodStart?: string;
  reviewPeriodEnd?: string;
  locationOrLink?: string;
  focusAreaIds?: string[];
  notes?: string;
}

export const getReviewTypes = async (): Promise<IResponse<IReviewType[]>> => {
  const response = await fetchInstance(reviewTypesEndpoint, { method: "GET" });
  return response as IResponse<IReviewType[]>;
};

export const getReviewFocusAreas = async (): Promise<IResponse<IReviewFocusArea[]>> => {
  const response = await fetchInstance(reviewFocusAreaEndpoint, { method: "GET" });
  return response as IResponse<IReviewFocusArea[]>;
};

export const createEmployeeReview = async (
  employeeId: string,
  payload: CreateEmployeeReviewPayload,
): Promise<IResponse<unknown>> => {
  try {
    const response = await fetchInstance(`/employees/${employeeId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    if (response.status >= 400) {
      console.error("[createEmployeeReview] API Error - Status:", response.status);
      console.error("[createEmployeeReview] Request payload:", payload);
      console.error("[createEmployeeReview] Response data:", response.data);
    }
    
    return response as IResponse<unknown>;
  } catch (error) {
    console.error("[createEmployeeReview] Request failed:", error);
    console.error("[createEmployeeReview] Failed for employee:", employeeId);
    console.error("[createEmployeeReview] With payload:", payload);
    throw error;
  }
};
