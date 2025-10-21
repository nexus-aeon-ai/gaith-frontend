import { fetchInstance } from "../clients";
import type { IResponse } from "../types/general";

const settingsEndpoint = "/settings";

export interface IUserSetting {
  key: string;
  value: string;
  category: string;
}

//  Get all user settings
export const getSettings = async (): Promise<IResponse<IUserSetting[]>> => {
  const response = await fetchInstance(`${settingsEndpoint}`, {
    method: "GET",
  });
  return response as IResponse<IUserSetting[]>;
};

// Create / Save all user settings
// (Accepts an array of settings or a single object with key/value/category)
export const createSettings = async (
  settingsData: IUserSetting[] | Record<string, any>,
): Promise<IResponse<IUserSetting[]>> => {
  // Wrap the settings array in the expected format
  const requestBody = {
    settings: Array.isArray(settingsData) ? settingsData : [settingsData],
  };
  
  const response = await fetchInstance(`${settingsEndpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  return response as IResponse<IUserSetting[]>;
};

// Update specific setting by key
export const updateSettingByKey = async (
  key: string,
  value: string | boolean | number,
): Promise<IResponse<IUserSetting>> => {
  const response = await fetchInstance(`${settingsEndpoint}/${key}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });
  return response as IResponse<IUserSetting>;
};

// Get role permissions
export const getRolePermissions = async (): Promise<IResponse<any>> => {
  const response = await fetchInstance(`${settingsEndpoint}/role-permissions`, {
    method: "GET",
  });
  return response as IResponse<any>;
};

// Update role permissions
export const updateRolePermissions = async (
  permissionsData: Record<string, any>,
): Promise<IResponse<any>> => {
  const response = await fetchInstance(`${settingsEndpoint}/role-permissions`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(permissionsData),
  });
  return response as IResponse<any>;
};

// Get team members
export const getTeamMembers = async (): Promise<IResponse<any>> => {
  const response = await fetchInstance(`${settingsEndpoint}/team-members`, {
    method: "GET",
  });
  return response as IResponse<any>;
};
