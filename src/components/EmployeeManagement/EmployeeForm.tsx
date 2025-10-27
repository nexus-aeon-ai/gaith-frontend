"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Employee } from "@/lib/types";
import { employeeSchema, type EmployeeFormData } from "@/lib/validations/employee";

interface EmployeeFormProps {
  mode: "create" | "edit";
  employee?: Employee | null;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const EmployeeForm = ({
  mode: _mode,
  employee,
  onSubmit,
  onCancel: _onCancel,
  isSubmitting: _isSubmitting,
}: EmployeeFormProps) => {
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      fullName: employee?.fullName || "",
      email: employee?.email || "",
      phoneNumber: employee?.phone || "",
      jobTitle: employee?.jobTitle || "",
      employeeId: employee?.employeeId || "",
      status: employee?.status || "Active",
      employmentType: employee?.employmentType || "FULL_TIME",
      salary: employee?.salary?.toString() || "",
      address: "",
      skills: employee?.skills?.join(", ") || "",
      department: "",
      userRole: "",
      permissions: {},
      companyProfile: {
        accountActive: true,
        emailVerification: false,
        forcePasswordChange: false,
        expirationDate: "",
        tempPassword: "",
        notes: "",
      },
    },
  });

  const { control, watch } = form;
  const watchedValues = watch();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <form id="employee-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information Card */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-row items-center gap-2">
            <div className="flex flex-col items-center gap-2 flex-1">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" />
                <AvatarFallback>{getInitials(watchedValues.fullName || "MA")}</AvatarFallback>
              </Avatar>
              <button type="button" className="text-sm text-blue-600 hover:underline">
                Change Photo
              </button>
              <p className="text-xs text-muted-foreground">JPG, PNG up to 2MB</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-4 flex-4">
              <Controller
                name="fullName"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <Label htmlFor={field.name} className="py-3">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Full Name"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <Label htmlFor={field.name} className="py-3">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      placeholder="Enter email"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="department"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <Label htmlFor={field.name} className="py-3">
                      Department <span className="text-red-500">*</span>
                    </Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="border-black-0" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="userRole"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <Label htmlFor={field.name} className="py-3">
                      User Role <span className="text-red-500">*</span>
                    </Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="border-black-0" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="jobTitle"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <Label htmlFor={field.name} className="py-3">
                      Job Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Job Title"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="employeeId"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <Label htmlFor={field.name} className="py-3">
                      Employee ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Employee ID"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Permissions Card */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="pb-3">Permissions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-4">User Management</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="createUsers" />
                  <Label htmlFor="createUsers">Create Users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="editUsers" />
                  <Label htmlFor="editUsers">Edit Users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="deleteUsers" />
                  <Label htmlFor="deleteUsers">Delete Users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="manageRoles" />
                  <Label htmlFor="manageRoles">Manage Roles</Label>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Content Management</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="createContent" />
                  <Label htmlFor="createContent">Create Content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="editContent" />
                  <Label htmlFor="editContent">Edit Content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="publishContent" />
                  <Label htmlFor="publishContent">Publish Content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="deleteContent" />
                  <Label htmlFor="deleteContent">Delete Content</Label>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Analytics & Reports</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="viewAnalytics" />
                  <Label htmlFor="viewAnalytics">View Analytics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="exportReports" />
                  <Label htmlFor="exportReports">Export Reports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="customReports" />
                  <Label htmlFor="customReports">Custom Reports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="advancedAnalytics" />
                  <Label htmlFor="advancedAnalytics">Advanced Analytics</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Contact Information */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="pb-3">Primary Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Label htmlFor="email2" className="py-3">Email Address</Label>
                <Input
                  {...field}
                  id="email2"
                  type="email"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Label htmlFor={field.name} className="py-3">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...field}
                  id={field.name}
                  type="tel"
                  placeholder="Phone Number"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="salary"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Label htmlFor={field.name} className="py-3">Salary</Label>
                <Input
                  {...field}
                  id={field.name}
                  type="number"
                  placeholder="Salary"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="employmentType"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Label htmlFor={field.name} className="py-3">Employment Type</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="border-black-0" aria-invalid={fieldState.invalid}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERN">Intern</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Label htmlFor={field.name} className="py-3">Address</Label>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Address"
                  rows={3}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="skills"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Label htmlFor={field.name} className="py-3">Skills & Competencies</Label>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Skills & Competencies"
                  rows={3}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>
                )}
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Primary Contact Information */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="pb-3">Employee Status </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
        <div>
            <Label className="text-base font-medium mb-3 block">Employee Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-6 flex-col">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Active" id="active" />
                    <Label htmlFor="active">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Inactive" id="inactive" />
                    <Label htmlFor="inactive">Inactive</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="On Leave" id="onLeave" />
                    <Label htmlFor="onLeave">On Leave</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Employee Status & Company Profile */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="pb-3">Employee Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          

          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4 text-base">Company Profile</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Controller
                name="companyProfile"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <Label htmlFor={field.name} className="py-3">Account Expiration Date</Label>
                    <Input
                      {...field}
                      value={field.value?.expirationDate || ""}
                      onChange={(e) =>
                        field.onChange({ ...field.value, expirationDate: e.target.value })
                      }
                      id={field.name}
                      type="date"
                      className="border-black-0"
                      aria-invalid={fieldState.invalid}
                    />
                  </div>
                )}
              />

              <Controller
                name="companyProfile"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <Label htmlFor={field.name} className="py-3">Temporary Password</Label>
                    <Input
                      {...field}
                      value={field.value?.tempPassword || ""}
                      onChange={(e) =>
                        field.onChange({ ...field.value, tempPassword: e.target.value })
                      }
                      id={field.name}
                      type="text"
                      placeholder="Temporary Password"
                      className="border-black-0"
                      aria-invalid={fieldState.invalid}
                    />
                  </div>
                )}
              />
            </div>
          </div>

          <Controller
            name="companyProfile"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Label htmlFor={field.name} className="py-3">Notes</Label>
                <Textarea
                  {...field}
                  value={field.value?.notes || ""}
                  onChange={(e) =>
                    field.onChange({ ...field.value, notes: e.target.value })
                  }
                  id={field.name}
                  placeholder="Add any additional notes about this user..."
                  rows={4}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <p className="text-sm text-red-500 mt-1">{fieldState.error?.message}</p>
                )}
              </div>
            )}
          />
        </CardContent>
      </Card>
    </form>
  );
};

export default EmployeeForm;
