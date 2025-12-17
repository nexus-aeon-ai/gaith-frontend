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

// ***** GENERAL TAB SCHEMA *****
export const generalTabSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  email: z
    .string()
    .email("Please enter a valid email address"),

  jobTitle: z
    .string()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Job title can only contain letters and spaces"),

  department: z.enum(departments, { required_error: "Department is required" }),

  // Language and regional settings
  interfaceLang: z.enum(["English", "Arabic"]),

  // Theme preferences
  darkThemeStatus: z.boolean().optional(),

  // Data export settings
  defaultExport: z.enum(["XLSX", "PDF"]),
  includeMetaData: z.boolean(),
});

export const createSettingsSchema = z.object({
  // ***** GENERAL SECTION *****
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  email: z
    .string()
    .email("Please enter a valid email address"),

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

  // SMS notifications
  enableSMSAlerts: z.boolean(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number"),

  // In App notifications
  desktopNotifications: z.boolean(),
  soundAlerts: z.boolean(),

  notificationFrequency: z.enum(["5min", "15min", "1hr", "4hrs", "12hrs", "24hrs"]),

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
// Default values for general tab only
export const defaultGeneralFormData: GeneralTabFormData = {
  fullName: "",
  email: "",
  jobTitle: "",
  department: "Sales", // Ensure this is always a valid enum value
  interfaceLang: "English",
  darkThemeStatus: false,
  defaultExport: "XLSX",
  includeMetaData: false,
};

// Default values for notification tab only
export const defaultNotificationFormData: NotificationTabFormData = {
  // Email notifications
  newClientAdded: false,
  clientStatusChanged: false,
  weeklyReports: false,

  // SMS notifications
  enableSMSAlerts: false,
  playSoundOnSMS: false,
  phoneNumber: "",

  // In App notifications
  desktopNotifications: false,
  soundAlerts: false,
  notificationFrequency: "5min",
};

// Default values for security tab only
export const defaultSecurityFormData: SecurityTabFormData = {
  // Password fields
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",

  // Two-factor authentication
  twoFactorAuth: false,
};

// ***** NOTIFICATION TAB SCHEMA *****
export const notificationTabSchema = z.object({
  // Email notifications
  newClientAdded: z.boolean(),
  clientStatusChanged: z.boolean(),
  weeklyReports: z.boolean(),

  // SMS notifications
  enableSMSAlerts: z.boolean(),
  playSoundOnSMS: z.boolean(),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === "") return true; // Allow empty phone number
      return val.length >= 10 && val.length <= 15;
    }, "Phone number must be between 10-15 digits")
    .refine((val) => {
      if (!val || val.trim() === "") return true; // Allow empty phone number
      return /^[\+]?[0-9\s\-\(\)]+$/.test(val);
    }, "Please enter a valid phone number"),

  // In App notifications
  desktopNotifications: z.boolean(),
  soundAlerts: z.boolean(),
  notificationFrequency: z.enum(["5min", "15min", "1hr", "4hrs", "12hrs", "24hrs"]),
});

// ***** SECURITY TAB SCHEMA *****
export const securityTabSchema = z.object({
  // Password fields
  currentPassword: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === "") return true; // Allow empty current password
      return val.length >= 8;
    }, "Current password must be at least 8 characters"),
  
  newPassword: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === "") return true; // Allow empty new password
      return val.length >= 8;
    }, "New password must be at least 8 characters"),
  
  confirmPassword: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === "") return true; // Allow empty confirm password
      return val.length >= 8;
    }, "Confirm password must be at least 8 characters"),

  // Two-factor authentication
  twoFactorAuth: z.boolean(),
}).refine((data) => {
  // If any password field is filled, all should be filled
  const hasAnyPassword = data.currentPassword || data.newPassword || data.confirmPassword;
  if (hasAnyPassword) {
    return data.currentPassword && data.newPassword && data.confirmPassword;
  }
  return true;
}, {
  message: "All password fields must be filled when changing password",
  path: ["confirmPassword"], // Show error on confirm password field
}).refine((data) => {
  // If new password and confirm password are provided, they should match
  if (data.newPassword && data.confirmPassword) {
    return data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "New password and confirm password must match",
  path: ["confirmPassword"],
});

// Type inference from schemas
export type GeneralTabFormData = z.infer<typeof generalTabSchema>;
export type NotificationTabFormData = z.infer<typeof notificationTabSchema>;
export type SecurityTabFormData = z.infer<typeof securityTabSchema>;
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
