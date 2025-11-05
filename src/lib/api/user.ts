import { fetchInstance } from "../clients";
import type { IResponse } from "../types/general";

const usersEndpoint = "/users";

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  departmentId: string | null;
  role: "Admin" | "Manager" | "Employee" | "Viewer" | string;
  jobTitle: string;
  accountRoleId: string;
  languagePreference: string;
  profilePic: string | null;
  isActive: boolean;
  emailVerificationRequired: boolean;
  forcePasswordChange: boolean;
  accountExpirationDate: string | null;
  notes: string;
  isDeleted: boolean;
  isSuperuser: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  department: null;
  accountRole: {
    id: string;
    code: string;
  };
}

// Create user
export const createUser = async (
  user: Omit<IUser, "id" | "createdAt" | "updatedAt">,
): Promise<IResponse<IUser>> => {
  const response = await fetchInstance(usersEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response as IResponse<IUser>;
};

// Read - get all users
export const getUsers = async (): Promise<IResponse<IUser[]>> => {
  const response = await fetchInstance(usersEndpoint, {
    method: "GET",
  });
  return response as IResponse<IUser[]>;
};

// Read - get user by ID
export const getUserById = async (id: string): Promise<IResponse<IUser>> => {
  const response = await fetchInstance(`${usersEndpoint}/${id}`, {
    method: "GET",
  });
  return response as IResponse<IUser>;
};

// Update user (expects same payload shape as createUser)
export const updateUser = async (
  id: string,
  user: Omit<IUser, "id" | "createdAt" | "updatedAt">,
): Promise<IResponse<IUser>> => {
  const response = await fetchInstance(`${usersEndpoint}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response as IResponse<IUser>;
};

// Delete user
export const deleteUser = async (id: string): Promise<IResponse<unknown>> => {
  const response = await fetchInstance(`${usersEndpoint}/${id}`, {
    method: "DELETE",
  });
  return response as IResponse<unknown>;
};
