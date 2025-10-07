export interface Permissions {
  delete: boolean;
  approve: boolean;
  edit: boolean;
  view: boolean;
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  status: "active" | "inactive";
  permissions: Permissions;
}
