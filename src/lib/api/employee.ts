import { fetchInstance } from "../clients";
import type { IResponse } from "../types/general";

const employeesEndpoint = "/employees";

export interface IEmployee {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  hireDate: string;
  status: "Active" | "Inactive" | "Terminated" | string;
  accountId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Create employee
export const createEmployee = async (
  employee: Omit<IEmployee, "id" | "createdAt" | "updatedAt">,
): Promise<IResponse<IEmployee>> => {
  const response = await fetchInstance(employeesEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });
  return response as IResponse<IEmployee>;
};

// Read - get all employees
export const getEmployees = async (): Promise<IResponse<IEmployee[]>> => {
  const response = await fetchInstance(employeesEndpoint, {
    method: "GET",
  });
  return response as IResponse<IEmployee[]>;
};

// Read - get employee by ID
export const getEmployeeById = async (id: string): Promise<IResponse<IEmployee>> => {
  const response = await fetchInstance(`${employeesEndpoint}${id}/`, {
    method: "GET",
  });
  return response as IResponse<IEmployee>;
};

// Update employee
export const updateEmployee = async (
  id: string,
  employee: Partial<Omit<IEmployee, "id" | "createdAt" | "updatedAt">>,
): Promise<IResponse<IEmployee>> => {
  const response = await fetchInstance(`${employeesEndpoint}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });
  return response as IResponse<IEmployee>;
};

// Delete employee
export const deleteEmployee = async (id: string): Promise<IResponse<unknown>> => {
  const response = await fetchInstance(`${employeesEndpoint}${id}/`, {
    method: "DELETE",
  });
  return response as IResponse<unknown>;
};
