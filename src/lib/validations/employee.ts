import { z } from "zod";

export const employeeSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  status: z.enum(["Active", "Inactive", "On Leave"]),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]),
  salary: z.string().optional(),
  address: z.string().optional(),
  skills: z.string().optional(),
  department: z.string().optional(),
  userRole: z.string().optional(),
  permissions: z.record(z.unknown()).optional(),
  companyProfile: z.object({
    accountActive: z.boolean().optional(),
    emailVerification: z.boolean().optional(),
    forcePasswordChange: z.boolean().optional(),
    expirationDate: z.string().optional(),
    tempPassword: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

