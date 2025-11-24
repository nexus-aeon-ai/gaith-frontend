import { fetchInstance } from "../clients";

const employeesEndpoint = "/employees";

// Local types for API integration (scoped to this module)
type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";

export type Employee = {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  department: {
    name: string;
    subTeam?: string;
  };
  role: {
    title: string;
    level: string;
  };
  status: "Active" | "Inactive" | "On Leave";
  performance: number; // 0..100
  salary: number;
  employmentType: EmploymentType;
  jobTitle?: string;
  skills: string[];
  address?: string;
  notes?: string;
  profilePicture?: string;
  createdAt?: string;
};

export type EmployeeFilters = Record<string, string | number | string[] | undefined>;

export interface BackendEmployeeResponse {
  data: Array<{
    id: string;
    employeeId: string;
    status: string;
    employmentType: EmploymentType;
    salary: string;
    performanceRating: number;
    user?: {
      fullName?: string;
      email?: string;
      phoneNumber?: string;
      jobTitle?: string;
    };
    skills?: Array<{ skill: string }>;
  }>;
  total: number;
  take?: number;
}

export interface BackendEmployee {
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
  notes?: string;
  street?: string;
  fullAddress?: string;
  profilePicture?: string;
  createdAt?: string;
}

// Transform backend employee to frontend employee
const transformEmployee = (backendEmployee: BackendEmployee): Employee => {
  return {
    id: backendEmployee.id,
    employeeId: backendEmployee.employeeId,
    profilePicture: backendEmployee.profilePicture,
    fullName: backendEmployee.user?.fullName || "",
    email: backendEmployee.user?.email || "",
    phone: backendEmployee.user?.phoneNumber || "",
    department: {
      name: "General",
      subTeam: undefined,
    },
    role: {
      title: backendEmployee.user?.jobTitle || "",
      level: "Mid Level",
    },
    status:
      backendEmployee.status === "ACTIVE"
        ? "Active"
        : backendEmployee.status === "INACTIVE"
          ? "Inactive"
          : "On Leave",
    performance: Math.round((backendEmployee.performanceRating || 0) * 20),
    salary: parseFloat(backendEmployee.salary) || 0,
    employmentType: backendEmployee.employmentType as EmploymentType,
    jobTitle: backendEmployee.user?.jobTitle,
    skills: backendEmployee.skills?.map((s: { skill: string }) => s.skill) || [],
    address: backendEmployee.fullAddress || backendEmployee.street || "",
    notes: backendEmployee.notes || "",
      createdAt: backendEmployee.createdAt,
  };
};

export const getEmployees = async (
  filters: EmployeeFilters = {},
): Promise<{
  status: number;
  data: {
    results: Employee[];
    count: number;
    next?: string | null;
    previous?: string | null;
    page_count: number;
  } | null;
}> => {
  // Only pass supported query params to backend (e.g., status)
  const params = new URLSearchParams();
  const { status, dateFrom, dateTo, ...rest } = filters as Record<string, any>;
  if (status) {
    if (Array.isArray(status)) {
      status.forEach((s: string) => params.append("status", String(s)));
    } else {
      params.append("status", String(status));
    }
  }

  const queryString = params.toString();
  const url = queryString ? `${employeesEndpoint}?${queryString}` : employeesEndpoint;

  const response = await fetchInstance<BackendEmployeeResponse>(url);

  if (!response.data) {
    return {
      status: response.status,
      data: null,
    };
  }

  // Apply client-side date filtering (createdAt) if provided
  let backendList = response.data.data || [];
  try {
    const from = dateFrom ? new Date(String(dateFrom)) : null;
    const to = dateTo ? new Date(String(dateTo)) : null;
    if (from || to) {
      backendList = backendList.filter(be => {
        if (!be.createdAt) return false;
        const created = new Date(be.createdAt);
        if (from && created < from) return false;
        if (to && created > to) return false;
        return true;
      });
    }
  } catch (err) {
    // if date parsing fails, ignore date filter
    console.warn("Failed to parse date filters", err);
  }

  const transformedData = {
    results: backendList.map(transformEmployee),
    count: backendList.length,
    next: null,
    previous: null,
    page_count: Math.ceil((backendList.length || 0) / (response.data.take || 10)),
  };

  return {
    status: response.status,
    data: transformedData,
  };
};

export const getEmployeeById = async (
  id: string,
): Promise<{
  status: number;
  data: Employee | null;
}> => {
  const response = await fetchInstance<BackendEmployee>(`${employeesEndpoint}/${id}`);

  if (!response.data) {
    return { status: response.status, data: null };
  }

  return {
    status: response.status,
    data: transformEmployee(response.data as BackendEmployee),
  };
};

// Transform frontend form data to backend API format
export interface EmployeeFormData {
  fullName: string;
  primaryEmail: string;
  profilePhotoURL: string;
  phone: string;
  jobTitle?: string;
  employeeId: string | undefined;
  status: "Active" | "Inactive" | "On Leave";
  employmentType: EmploymentType;
  salary?: string | number;
  password?: string;
  accountRoleId?: string;
  languagePreference?: string;
  notes?: string;
  address?: string;
}

const transformFormDataToBackend = (formData: EmployeeFormData) => {
  return {
    fullName: formData.fullName,
    email: formData.primaryEmail,
    profilePicture: formData.profilePhotoURL,
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
    password: formData.password || "Temp1234",
    accountRoleId: formData.accountRoleId || "EMPLOYEE",
    languagePreference: formData.languagePreference || "EN",
    notes: formData.notes || "",
    street: formData.address || "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  };
};

export const createEmployee = async (
  formData: EmployeeFormData,
): Promise<{
  status: number;
  data: Employee | null;
}> => {
  const backendData = transformFormDataToBackend(formData);

  console.log("👤 Creating employee:", backendData);

  const response = await fetchInstance<BackendEmployee>(employeesEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(backendData),
  });

  if (!response.data) {
    return { status: response.status, data: null };
  }

  if (response.status !== 201) {
    throw new Error(
      JSON.stringify((response.data as unknown as { message: string }).message) || "Create failed",
    );
  }

  return {
    status: response.status,
    data: transformEmployee(response.data as BackendEmployee),
  };
};

export const updateEmployee = async (
  id: string,
  formData: EmployeeFormData,
): Promise<{
  status: number;
  data: Employee | null;
}> => {
  const backendData = transformFormDataToBackend(formData);

  const response = await fetchInstance<BackendEmployee>(`${employeesEndpoint}/${id}`, {
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
    data: transformEmployee(response.data as BackendEmployee),
  };
};

export const deleteEmployee = async (
  id: string,
): Promise<{
  status: number;
  data: null;
}> => {
  const response = await fetchInstance(`${employeesEndpoint}/${id}`, {
    method: "DELETE",
  });
  return response as { status: number; data: null };
};
