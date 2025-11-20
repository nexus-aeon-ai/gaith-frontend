export interface Permissions {
  delete: boolean;
  approve: boolean;
  edit: boolean;
  view: boolean;
}

export interface ContactInfo {
  email: string;
  number: string;
}

export interface Department {
  name: string;
  team: string;
}

export interface Role {
  name: string;
  level: string; // e.g. "Junior", "Mid Level", "Senior"
}

export interface Employee {
  id: string; // Changed to string to match API
  fullName: string; // Changed from name to fullName to match API
  email: string; // Added email field from API
  role: string;
  roleLevel: string;
  status: "active" | "inactive";
  department: Department;
  contactInfo: ContactInfo;
  performance: string; // keep % string
  permissions: Permissions;
  profilePicture: string;
}

// API response type for team members
export interface TeamMemberApiResponse {
  id: string;
  fullName: string;
  email: string;
}

// Role permissions API types
export interface RolePermissionApiResponse {
  roles: string[];
  permissions: PermissionItem[];
}

export interface PermissionItem {
  permissionCode: string;
  permissionName: string;
  roles: Record<string, boolean>;
}

export interface RolePermissionUpdateRequest {
  permissions: RolePermissionUpdate[];
}

export interface RolePermissionUpdate {
  roleCode: string;
  permissionCode: string;
  hasPermission: boolean;
}
