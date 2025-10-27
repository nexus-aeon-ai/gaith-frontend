import { Employee } from "../types";

export const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "John Smith",
    role: "Software Engineer",
    status: "active",
    permissions: {
      delete: true,
      approve: false,
      edit: true,
      view: true,
    },
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Product Manager",
    status: "active",
    permissions: {
      delete: true,
      approve: true,
      edit: true,
      view: true,
    },
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Designer",
    status: "inactive",
    permissions: {
      delete: false,
      approve: false,
      edit: true,
      view: true,
    },
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Team Lead",
    status: "active",
    permissions: {
      delete: true,
      approve: true,
      edit: true,
      view: true,
    },
  },
  {
    id: 5,
    name: "David Wilson",
    role: "Developer",
    status: "active",
    permissions: {
      delete: false,
      approve: false,
      edit: true,
      view: true,
    },
  },
];
