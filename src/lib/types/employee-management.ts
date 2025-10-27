export interface Employee {
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
  performance: number; // 0-100 as percentage
  salary?: number;
  employmentType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  jobTitle?: string;
  skills?: string[];
}

// Backend API response structure
export interface BackendEmployee {
  id: string;
  employeeId: string;
  userId: string;
  organizationId: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  salary: string;
  performanceRating: number;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    jobTitle: string;
    profilePic: string | null;
  };
  skills: Array<{
    id: string;
    employeeId: string;
    skill: string;
    createdAt: string;
  }>;
}

export interface BackendEmployeeResponse {
  data: BackendEmployee[];
  total: number;
  skip: number;
  take: number;
}

export interface EmployeeFilters {
  departmentId?: string;
  status?: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  employmentType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  jobTitle?: string;
  minSalary?: number;
  maxSalary?: number;
  minPerformance?: number;
  maxPerformance?: number;
  searchTerm?: string;
  skillsToInclude?: string[];
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

