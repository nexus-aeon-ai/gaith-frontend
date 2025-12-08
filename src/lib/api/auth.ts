import { fetchInstance } from "../clients";
import { IProfile } from "../types";
import type { IResponse } from "../types/general";

const authEndpoint = "/auth/";

export const login = async (email: string, password: string, organizationId: string): Promise<any> => {
  const response = (await fetchInstance(`${authEndpoint}login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, organizationId }),
    cache: "force-cache",
  })) as { data: any; status: number };
  return response;
};

export const getProfile = async (): Promise<IResponse<IProfile>> => {
  const response = await fetchInstance("/auth/profile");
  return response as IResponse<IProfile>;
};

export const forgetPassword = async (email: string): Promise<IResponse<unknown>> => {
  console.log("[forgetPassword] Sending email:", email);
  const response = await fetchInstance(`${authEndpoint}forgot-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  console.log("[forgetPassword] Received response:", response);
  return response as IResponse<unknown>;
};

export const verifyOtp = async (email: string, otp: string): Promise<IResponse<unknown>> => {
  const response = await fetchInstance(`${authEndpoint}verify-otp/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });
  return response as IResponse<unknown>;
};

export const resetPassword = async (
  email: string,
  otp: string,
  password: string,
  confirmPassword: string,
): Promise<IResponse<unknown>> => {
  const response = await fetchInstance(`${authEndpoint}reset-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp, password, confirmPassword }),
  });
  return response as IResponse<unknown>;
};
