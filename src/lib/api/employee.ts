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
  data: BackendEmployee[];
  total: number;
  take?: number;
}

export interface BackendEmployee {
  id: string;
  employeeId: string;
  userId?: string;
  organizationId?: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";
  salary: string;
  performanceRating: number | null;
  profilePicture: string | null;
  notes: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  fullAddress: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    jobTitle: string;
    profilePic: string | null;
    departmentId: string | null;
    createdAt?: string;
  };
  skills?: Array<{
    id: string;
    employeeId: string;
    skill: string;
    createdAt: string;
  }>;
}

// Transform backend employee to frontend employee
const transformEmployee = (backendEmployee: BackendEmployee): Employee => {
  return {
    id: backendEmployee.id,
    employeeId: backendEmployee.employeeId,
    profilePicture: backendEmployee.profilePicture || "",
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
  const { status, dateFrom, dateTo } = filters;
  if (status) {
    if (Array.isArray(status)) {
      status.forEach((s: string) => params.append("status", String(s)));
    } else {
      params.append("status", String(status));
    }
  }
  params.append("take", "100");

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
        const createdAt = be.createdAt || be.user?.createdAt;
        if (!createdAt) return false;
        const created = new Date(createdAt);
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

// Server-side function to get raw backend employee data
export const getEmployeeByIdRaw = async (
  id: string,
): Promise<{
  status: number;
  data: BackendEmployee | null;
}> => {
  const response = await fetchInstance<BackendEmployee>(`${employeesEndpoint}/${id}`);

  if (!response.data) {
    return { status: response.status, data: null };
  }

  return {
    status: response.status,
    data: response.data as BackendEmployee,
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
  skills: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  fullAddress?: string;
  performanceRating?: number;
  endDate?: Date | string;
  departmentId?: string;
  startDate?: Date | string;
}

const transformFormDataToBackend = (
  formData: EmployeeFormData,
  isCreate: boolean = false,
): Record<string, unknown> => {
  const payload: Record<string, unknown> = {
    fullName: formData.fullName,
    email: formData.primaryEmail,
    phoneNumber: formData.phone,
    jobTitle: formData.jobTitle,
    status:
      formData.status === "Active"
        ? "ACTIVE"
        : formData.status === "Inactive"
          ? "INACTIVE"
          : "ON_LEAVE",
    employmentType: formData.employmentType,
    salary: String(formData.salary || "0"),
    password: formData.password,
    accountRoleId: formData.accountRoleId || "",
    languagePreference: formData.languagePreference || "EN",
    notes: formData.notes || "",
    skills:
      formData.skills
        ?.split(",")
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0) ||
      formData.skills
        ?.split(" ")
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0) ||
      [],
    street: formData.street || "",
    city: formData.city || "",
    state: formData.state || "",
    country: formData.country || "",
    zipCode: formData.zipCode || "",
    fullAddress: formData.fullAddress || "",
    performanceRating: formData.performanceRating || null,
    startDate: formData.startDate
      ? typeof formData.startDate === "string"
        ? formData.startDate
        : formData.startDate.toISOString()
      : null,
    endDate: formData.endDate
      ? typeof formData.endDate === "string"
        ? formData.endDate
        : formData.endDate.toISOString()
      : null,
    departmentId: formData.departmentId || null,
  };

  // Only include profilePicture if it's not empty
  if (formData.profilePhotoURL && formData.profilePhotoURL.trim() !== "") {
    payload.profilePicture = formData.profilePhotoURL;
  }

  // Only include employeeId for update operations, not create
  if (!isCreate && formData.employeeId) {
    payload.employeeId = formData.employeeId;
  }

  return payload;
};

export const createEmployee = async (
  formData: EmployeeFormData,
): Promise<{
  status: number;
  data: Employee | null;
}> => {
  const backendData = transformFormDataToBackend(formData, true);

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
    const err = new Error(
      (response.data as { message?: string }).message || "Create failed",
    ) as Error & { status?: number };
    err.status = response.status;
    throw err;
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
  console.log("👤 Updating employee:", backendData);
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
