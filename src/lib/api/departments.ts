import { fetchInstance } from "../clients";

export interface BackendDepartment {
  id: string;
  name: string;
}

const departmentsEndpoint = "/utils/departments";

export const getDepartments = async (): Promise<{
  status: number;
  data: BackendDepartment[] | null;
}> => {
  const response = await fetchInstance<BackendDepartment[]>(departmentsEndpoint, {
    method: "GET",
  });
  return { status: response.status, data: response.data };
};

