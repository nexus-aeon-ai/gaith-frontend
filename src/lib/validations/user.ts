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

export const userRoles = ["Admin", "Manager", "Employee", "Viewer"] as const;
export const userPerms = ["Create Users", "Edit Users", "Delete Users", "Manage Roles"] as const;
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

// Main User Form Validation Schema
export const createUserSchema = z.object({
  // Basic Information
  userPhoto: z.instanceof(File, { message: "Please upload a photo" }).optional(),

  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  // Contact Information - Email is required
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),

  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number"),

  department: z.enum(departments, { required_error: "Department is required" }),

  userRole: z.enum(userRoles, { required_error: "User role is required" }),

  jobTitle: z
    .string()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Job title can only contain letters and spaces"),

  // Security Information
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),

  // User Permissions
  userManagement: z.array(z.enum(userPerms)).min(1, "Select at least one option"),
  contentManagement: z.array(z.enum(contentPerms)).min(1, "Select at least one option"),
  analyticsAndReports: z.array(z.enum(analyticsPerms)).min(1, "Select at least one option"),

  // Company Profile
  accountActive: z.boolean(),
  emailVerification: z.boolean(),
  forcePassChange: z.boolean(),
  accExpiryDate: z.date().optional(),
  tempPassword: z.string().min(8, "Password must be at least 8 characters").optional(),
  notes: z.string().max(2000, "Notes must be less than 2000 characters"),
});

// Type inference from schema
export type CreateUserFormData = z.infer<typeof createUserSchema>;

// Partial schema for updates (all fields optional)
export const updateUserSchema = createUserSchema.partial();

// Type for update operations
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

// Validation helper functions
export const validateUserForm = (data: unknown) => {
  return createUserSchema.safeParse(data);
};

export const validateUserUpdate = (data: unknown) => {
  return updateUserSchema.safeParse(data);
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

export const defaultFormData: CreateUserFormData = {
  // Basic Information
  userPhoto: undefined,
  fullName: "",
  email: "",
  phoneNumber: "",
  department: departments[0], // default first option
  userRole: userRoles[0], // default first option
  jobTitle: "",

  // Security Information
  password: "",
  confirmPassword: "",

  // User Permissions
  userManagement: [],
  contentManagement: [],
  analyticsAndReports: [],

  // Company Profile
  accountActive: true,
  emailVerification: false,
  forcePassChange: false,
  accExpiryDate: undefined,
  tempPassword: undefined,
  notes: "",
};
