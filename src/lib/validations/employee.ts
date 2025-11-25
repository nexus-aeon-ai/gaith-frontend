import { z } from "zod";

export const departments = [
  "Sales",
  "Marketing",
  "Engineering",
  "HR",
  "Finance",
  "Operations",
  "IT",
  "Other",
] as const;

export const empRoles = ["Admin", "Manager", "Employee", "Viewer"] as const; // legacy defaults
export const empPerms = ["Create Users", "Edit Users", "Delete Users", "Manage Roles"] as const;
export const contentPerms = [
  "Create Content",
  "Edit Content",
  "Publish Content",
  "Delete Content",
] as const;
export const analyticsPerms = [
  "View Analytics",
  "Export Reports",
  "Custom Reports",
  "Advanced Analytics",
] as const;

export const employementTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary",
  "Volunteer",
  "Other",
] as const;

// Main User Form Validation Schema
export const createEmpSchema = z.object({
  // Basic Information
  profilePhoto: z.instanceof(File, { message: "Please upload a photo" }).optional(),
  profilePhotoURL: z.string().optional(),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  department: z.enum(departments, { required_error: "Department is required" }),

  // Accept dynamic roles from backend instead of fixed enum
  // empRole: z.string().min(1, "Employee role is required"),

  jobTitle: z
    .string()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Job title can only contain letters and spaces"),

  employeeID: z
    .string()
    .optional(),

  userRole: z.string().min(1, "User role is required"),

  // Employee Permissions (optional)
  userManagement: z.array(z.enum(empPerms)).min(1, "Select at least one option"),
  contentManagement: z.array(z.enum(contentPerms)).min(1, "Select at least one option"),
  analyticsAndReports: z.array(z.enum(analyticsPerms)).min(1, "Select at least one option"),

  //primary contact information
  primaryEmail: z.string().email(),
  primaryPhone: z
    .string()
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number")
    .optional(),
  salary: z.coerce.number().optional(),
  employementType: z.enum(employementTypes, {
    required_error: "Employment type is required",
  }),
  address: z.string().optional(),

  //Skills
  skills: z.string().optional(),

  //employee status
  employeeStatus: z.enum(["active", "inactive", "onleave"], {
    required_error: "Employee status is required",
    invalid_type_error: "Invalid employee status selected",
  }),

  accStartDate: z.date().optional(),

  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

// Type inference from schema
export type CreateEmpFormData = z.infer<typeof createEmpSchema>;

// Partial schema for updates (all fields optional)
export const updateEmpSchema = createEmpSchema.partial();

// Type for update operations
export type UpdateEmpFormData = z.infer<typeof updateEmpSchema>;

// Validation helper functions
export const validateEmpForm = (data: unknown) => {
  return createEmpSchema.safeParse(data);
};

export const validateEmpUpdate = (data: unknown) => {
  return updateEmpSchema.safeParse(data);
};

// Field-specific validation helpers
export const validateEmail = (email: string) => {
  return z.string().email().safeParse(email);
};

export const validatePhoneNumber = (phone: string) => {
  return z
    .string()
    .regex(/^[\+]?[0-9\s\-\(\)]+$/)
    .safeParse(phone);
};

export const validateUrl = (url: string) => {
  return z.string().url().safeParse(url);
};

export const defaultFormData: CreateEmpFormData = {
  // Basic Information
  profilePhoto: undefined,
  fullName: "",
  department: departments[0], // default first option
  // empRole: "",
  jobTitle: "",
  employeeID: "",

  userRole: "",

  // Empployee Permissions
  userManagement: [],
  contentManagement: [],
  analyticsAndReports: [],

  // Primary Contact Information
  primaryEmail: "",
  primaryPhone: "",
  salary: undefined,
  employementType: employementTypes[0], // default first option
  address: "",

  // Skills
  skills: "",

  // Employee Status
  employeeStatus: "active", // default to "active"

  accStartDate: undefined,
};
