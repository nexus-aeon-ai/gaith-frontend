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

// Base schema object (before refinements)
const baseEmpSchema = z.object({
  // Basic Information
  profilePhoto: z.instanceof(File, { message: "Please upload a photo" }).optional(),
  profilePhotoURL: z.string().optional(),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

    department: z.enum(departments, { required_error: "Department is required" }).optional(), // Legacy field, kept for backward compatibility
    departmentId: z
      .string()
      .refine(
        val => {
          // Allow empty string, undefined, or valid UUID
          if (!val || val === "") return true;
          return z.string().uuid().safeParse(val).success;
        },
        {
          message: "Invalid uuid",
        }
      )
      .optional(),

  // Accept dynamic roles from backend instead of fixed enum
  // empRole: z.string().min(1, "Employee role is required"),

  jobTitle: z
    .string()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Job title can only contain letters and spaces"),

  employeeID: z.string().optional(),

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

  // Password fields (required for create mode, optional for edit)
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters")
    .optional(),

  // Detailed address fields
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  fullAddress: z.string().optional(),

  //Skills
  skills: z.string().optional(),

  //employee status
  employeeStatus: z.enum(["active", "inactive", "onleave"], {
    required_error: "Employee status is required",
    invalid_type_error: "Invalid employee status selected",
  }),

  accStartDate: z.date().optional(),
  endDate: z.date().optional(),

  // Performance and department
  performanceRating: z.coerce.number().min(0).max(5).optional(),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

// Main User Form Validation Schema with refinements
export const createEmpSchema = baseEmpSchema
  .refine(
    data => {
      // Only validate password match if both passwords are provided
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  )
  .refine(
    data => {
      if (data.endDate && data.accStartDate) {
        return data.endDate > data.accStartDate;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

// Type inference from schema
export type CreateEmpFormData = z.infer<typeof createEmpSchema>;

// Partial schema for updates (all fields optional) with same refinements
export const updateEmpSchema = baseEmpSchema
  .partial()
  .refine(
    data => {
      // Only validate password match if both passwords are provided
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  )
  .refine(
    data => {
      if (data.endDate && data.accStartDate) {
        return data.endDate > data.accStartDate;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

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
  department: departments[0], // Legacy field, kept for backward compatibility
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

  // Password fields
  password: "",
  confirmPassword: "",

  // Detailed address fields
  street: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  fullAddress: "",

  // Skills
  skills: "",

  // Employee Status
  employeeStatus: "active", // default to "active"

  accStartDate: undefined,
  endDate: undefined,

  // Performance and department
  performanceRating: undefined,
  departmentId: "",

  notes: "",
};
