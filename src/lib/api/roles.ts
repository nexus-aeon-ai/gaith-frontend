import { fetchInstance } from "../clients";

export interface BackendRole {
  id: string;
  code: string; // e.g. "admin", "employee", "super_admin"
}

export const RoleCode = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
  SUPER_ADMIN: "super_admin",
} as const;

export type RoleCode = typeof RoleCode[keyof typeof RoleCode];

const rolesEndpoint = "/utils/roles";

export const getRoles = async (): Promise<{
  status: number;
  data: BackendRole[] | null;
}> => {
  const response = await fetchInstance<BackendRole[]>(rolesEndpoint, {
    method: "GET",
  });
  return { status: response.status, data: response.data };
};


