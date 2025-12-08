import { Employee } from "../types";

export const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "John Smith",
    role: { name: "Software Engineer", level: "Mid Level" },
    status: "active",
    department: { name: "Engineering", team: "Digital Team" },
    contactInfo: {
      email: "john.smith@example.com",
      number: "+1 555-123-4567",
    },
    performance: "15%",
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
    role: { name: "Product Manager", level: "Senior" },
    status: "active",
    department: { name: "Product", team: "Growth Team" },
    contactInfo: {
      email: "sarah.johnson@example.com",
      number: "+1 555-987-6543",
    },
    performance: "92%",
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
    role: { name: "Designer", level: "Junior" },
    status: "inactive",
    department: { name: "Design", team: "UI/UX Team" },
    contactInfo: {
      email: "michael.brown@example.com",
      number: "+1 555-444-1212",
    },
    performance: "70%",
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
    role: { name: "Team Lead", level: "Senior" },
    status: "active",
    department: { name: "Engineering", team: "Backend Team" },
    contactInfo: {
      email: "emily.davis@example.com",
      number: "+1 555-222-3333",
    },
    performance: "95%",
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
    role: { name: "Developer", level: "Mid Level" },
    status: "active",
    department: { name: "Engineering", team: "Frontend Team" },
    contactInfo: {
      email: "david.wilson@example.com",
      number: "+1 555-777-8888",
    },
    performance: "80%",
    permissions: {
      delete: false,
      approve: false,
      edit: true,
      view: true,
    },
  },
];
