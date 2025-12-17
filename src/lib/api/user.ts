import { fetchInstance } from "../clients";
import type { IResponse } from "../types/general";

const usersEndpoint = "/users/";

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: "Admin" | "Manager" | "Employee" | string;
  status: "Active" | "Inactive" | "Suspended" | string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
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
  console.log("Create User Response:", response);
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
  const response = await fetchInstance(`${usersEndpoint}${id}`, {
    method: "GET",
  });
  return response as IResponse<IUser>;
};

// Update user
export const updateUser = async (
  id: string,
  user: Partial<Omit<IUser, "id" | "createdAt" | "updatedAt">>,
): Promise<IResponse<IUser>> => {
  const response = await fetchInstance(`${usersEndpoint}${id}`, {
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
  const response = await fetchInstance(`${usersEndpoint}${id}`, {
    method: "DELETE",
  });
  return response as IResponse<unknown>;
};
