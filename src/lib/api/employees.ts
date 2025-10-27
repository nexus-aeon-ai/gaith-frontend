import { fetchInstance } from "../clients";
import type { Employee, EmployeeFilters } from "../types";
import type { BackendEmployeeResponse } from "../types/employee-management";

const employeesEndpoint = "/employees";

// Transform backend employee to frontend employee
const transformEmployee = (backendEmployee: {
  id: string;
  employeeId: string;
  status: string;
  employmentType: string;
  salary: string;
  performanceRating: number;
  user?: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    jobTitle?: string;
  };
  skills?: Array<{ skill: string }>;
}): Employee => {
  return {
    id: backendEmployee.id,
    employeeId: backendEmployee.employeeId,
    fullName: backendEmployee.user?.fullName || "",
    email: backendEmployee.user?.email || "",
    phone: backendEmployee.user?.phoneNumber || "",
    department: {
      name: "General", // Backend doesn't provide department
      subTeam: undefined,
    },
    role: {
      title: backendEmployee.user?.jobTitle || "",
      level: "Mid Level", // Backend doesn't provide level
    },
    status:
      backendEmployee.status === "ACTIVE"
        ? "Active"
        : backendEmployee.status === "INACTIVE"
          ? "Inactive"
          : "On Leave",
    performance: Math.round((backendEmployee.performanceRating || 0) * 20),
    salary: parseFloat(backendEmployee.salary) || 0,
    employmentType: backendEmployee.employmentType as
      | "FULL_TIME"
      | "PART_TIME"
      | "CONTRACT"
      | "INTERN",
    jobTitle: backendEmployee.user?.jobTitle,
    skills: backendEmployee.skills?.map((s: { skill: string }) => s.skill) || [],
  };
};

export const getEmployees = async (filters: EmployeeFilters = {}): Promise<{
  status: number;
  data: {
    results: Employee[];
    count: number;
    next?: string | null;
    previous?: string | null;
    page_count: number;
  } | null;
}> => {
  // Build query string
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.append(key, String(value));
      }
    }
  });

  const queryString = params.toString();
  const url = queryString ? `${employeesEndpoint}?${queryString}` : employeesEndpoint;

  const response = await fetchInstance<BackendEmployeeResponse>(url);
  
  if (!response.data) {
    return {
      status: response.status,
      data: null,
    };
  }

  // Transform backend response to frontend format
  const transformedData = {
    results: response.data.data.map(transformEmployee),
    count: response.data.total,
    next: null,
    previous: null,
    page_count: Math.ceil(response.data.total / (response.data.take || 10)),
  };

  return {
    status: response.status,
    data: transformedData,
  };
};

export const getEmployeeById = async (id: string): Promise<{
  status: number;
  data: Employee | null;
}> => {
  const response = await fetchInstance<any>(`${employeesEndpoint}/${id}`);
  
  if (!response.data) {
    return { status: response.status, data: null };
  }
  
  return {
    status: response.status,
    data: transformEmployee(response.data as any),
  };
};

// Transform frontend form data to backend API format
const transformFormDataToBackend = (formData: any) => {
  return {
    fullName: formData.fullName,
    email: formData.email,
    phoneNumber: formData.phone,
    jobTitle: formData.jobTitle,
    employeeId: formData.employeeId,
    status:
      formData.status === "Active"
        ? "ACTIVE"
        : formData.status === "Inactive"
          ? "INACTIVE"
          : "ON_LEAVE",
    employmentType: formData.employmentType,
    salary: formData.salary || "0",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  };
};

export const createEmployee = async (formData: any): Promise<{
  status: number;
  data: Employee | null;
}> => {
  const backendData = transformFormDataToBackend(formData);
  
  const response = await fetchInstance<any>(employeesEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(backendData),
  });
  
  if (!response.data) {
    return { status: response.status, data: null };
  }
  
  return {
    status: response.status,
    data: transformEmployee(response.data as any),
  };
};

export const updateEmployee = async (
  id: string,
  formData: any,
): Promise<{
  status: number;
  data: Employee | null;
}> => {
  const backendData = transformFormDataToBackend(formData);
  
  const response = await fetchInstance<any>(`${employeesEndpoint}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(backendData),
  });
  
  if (!response.data) {
    return { status: response.status, data: null };
  }
  
  return {
    status: response.status,
    data: transformEmployee(response.data as any),
  };
};

export const deleteEmployee = async (id: string): Promise<{
  status: number;
  data: null;
}> => {
  const response = await fetchInstance(`${employeesEndpoint}/${id}`, {
    method: "DELETE",
  });
  return response as { status: number; data: null };
};

