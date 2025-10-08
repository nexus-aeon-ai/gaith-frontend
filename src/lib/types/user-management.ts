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
  id: number;
  name: string;
  role: Role;
  status: "active" | "inactive";
  department: Department;
  contactInfo: ContactInfo;
  performance: string; // keep % string
  permissions: Permissions;
}
