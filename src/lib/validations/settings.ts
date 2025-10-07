import { z } from "zod";

export const companySizeOptions = ["0-50", "50-200", "200-500", "500-1000", "1000+"] as const;

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

export const permissionsList = [
  "View Clients",
  "Edit Clients",
  "Add Clients",
  "Delete Clients",
  "Manage Users",
  "Create Content",
  "Edit Content",
  "Delete Content",
  "Approve Requests",
  "Reject Requests",
  "Access Reports",
  "Export Data",
  "Configure Settings",
] as const;

export const defaultExports = ["XLSX", "PDF"] as const;

export const createSettingsSchema = z.object({
  // ***** GENERAL SECTION *****
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  email: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country must be less than 50 characters"),

  jobTitle: z
    .string()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Job title can only contain letters and spaces"),

  department: z.enum(departments, { required_error: "Department is required" }),

  // Language and regional settings

  interfaceLang: z.enum(["English", "Arabic"]),
  textDirection: z.enum(["left-to-right", "right-to-left"]),

  // Theme preferences
  darkThemeStatus: z.boolean().optional(),

  // Data export settings
  defaultExport: z.enum(["XLSX", "PDF"]),
  includeMetaData: z.boolean(),

  // ***** NOTIFICATIONS SECTION *****

  // Email notifications
  newClientAdded: z.boolean(),
  clientStatusChanged: z.boolean(),
  weeklyReports: z.boolean(),

  // SMS notificaitons
  enableSMSAlerts: z.boolean(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number"),

  // In App notifications
  desktopNotifications: z.boolean(),
  soundAlerts: z.boolean(),

  notificationFrequency: z.enum(["5min", "15min", "1hr", "4hrs", "12hrs", " 24hrs"]),

  // ***** SECURITY SECTION *****
  // Account security
  currentPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),

  twoFactorAuth: z.boolean(),

  permissions: z.record(z.enum(permissionsList), z.enum(["superadmin", "admin", "employee"])),
});


export const defaultFormData: CreateSettingsFormData = {
  // ***** GENERAL SECTION *****
  fullName: "",
  email: "",
  jobTitle: "",
  department: "Sales", // default from departments enum

  // Language and regional settings
  interfaceLang: "English",
  textDirection: "left-to-right",

  // Data export settings
  defaultExport: "XLSX",
  includeMetaData: false,

  // ***** NOTIFICATIONS SECTION *****
  // Email notifications
  newClientAdded: false,
  clientStatusChanged: false,
  weeklyReports: false,

  // SMS notifications
  enableSMSAlerts: false,
  phoneNumber: "",

  // In App notifications
  desktopNotifications: false,
  soundAlerts: false,
  notificationFrequency: "5min",

  // ***** SECURITY SECTION *****
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  twoFactorAuth: false,

  permissions: {},
};
// Type inference from schema
export type CreateSettingsFormData = z.infer<typeof createSettingsSchema>;

// Partial schema for updates (all fields optional)
export const updateSettingsSchema = createSettingsSchema.partial();

// Type for update operations
export type UpdateSettingsFormData = z.infer<typeof updateSettingsSchema>;

// Validation helper functions
export const validateSettingsForm = (data: unknown) => {
  return createSettingsSchema.safeParse(data);
};

export const validateSettingsUpdate = (data: unknown) => {
  return updateSettingsSchema.safeParse(data);
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
