"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getDepartments } from "@/lib/api/departments";
import { getRoles } from "@/lib/api/roles";
import {
  analyticsPerms,
  contentPerms,
  createEmpSchema,
  defaultFormData,
  departments,
  empPerms,
  employementTypes,
  type CreateEmpFormData,
} from "@/lib/validations/employee";

import { CheckboxSquare } from "../ui/checkbox-square";

interface EmloyeeFormProps {
  initialData?: CreateEmpFormData;
  onSubmit: (data: CreateEmpFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

const EmloyeeForm = ({ initialData, onSubmit, mode }: EmloyeeFormProps) => {
  const { theme } = useTheme();
  const [preview, setPreview] = useState<string | null>(null);

  const { data: rolesData } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await getRoles();
      return res.data ?? [];
    },
    initialData: [],
  });

  const { data: departmentsData } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      try {
        const res = await getDepartments();
        return res.data ?? [];
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        return [];
      }
    },
    initialData: [],
  });
  const form = useForm<CreateEmpFormData, unknown, CreateEmpFormData>({
    resolver: zodResolver(createEmpSchema),
    defaultValues: initialData || defaultFormData,
    mode: "onChange",
  });

  // Ensure form values update when initialData arrives/changes (e.g., on edit fetch)
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleStartDate = () => {
    const input = document.getElementById("date-start") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  const handleError = (error: unknown) => {
    console.error(error);
  };

  return (
    <Form {...form}>
      <form
        id="user-form"
        onSubmit={form.handleSubmit(onSubmit, handleError)}
        className="w-full mx-auto space-y-4"
      >
        {/* Basic Information */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-[16px] font-medium">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex lg:flex-row flex-col gap-4">
              <FormField
                control={form.control}
                name="profilePhoto"
                render={({ field }) => (
                  <FormItem className="lg:min-w-[20%] ">
                    <div className="flex  flex-col lg:col-span-1 col-span-5 gap-2 justify-center items-center">
                      {/* Circle for preview or initials */}
                      <div className="rounded-full text-xl text-[#3072C0] sm:text-3xl bg-[#3072C014] h-24 w-24 flex items-center justify-center overflow-hidden">
                        {preview ? (
                          <Image
                            src={preview}
                            alt="Profile preview"
                            width={96}
                            height={96}
                            className="object-cover h-full w-full"
                          />
                        ) : initialData?.profilePhotoURL ? (
                          <Image
                            src={initialData.profilePhotoURL}
                            alt="Profile preview"
                            width={96}
                            height={96}
                            className="object-cover h-full w-full"
                          />
                        ) : (
                          <span>MA</span>
                        )}
                      </div>
                      {/* Change Photo button (acts as label for hidden input) */}
                      <FormLabel
                        htmlFor="profilePhoto"
                        className="text-[#3072C0] cursor-pointer hover:underline"
                      >
                        Change Photo
                      </FormLabel>

                      {/* Hidden file input */}
                      <FormControl className="bg-red-400">
                        <Input
                          id="profilePhoto"
                          type="file"
                          accept="image/png, image/jpeg"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            // 2 MB limit (2 * 1024 * 1024 bytes)
                            const maxSize = 2 * 1024 * 1024;

                            if (file.size > maxSize) {
                              toast.error("File size exceeds 2MB limit.");
                              e.target.value = ""; // Clear file input
                              return;
                            }

                            field.onChange(file); // update form value
                            setPreview(URL.createObjectURL(file)); // preview image
                          }}
                        />
                      </FormControl>

                      <p className="text-[#687192] text-sm">JPG, PNG up to 2MB</p>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 w-full grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Full Name"
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value || ""} 
                          onValueChange={(value) => {
                            field.onChange(value === "" ? undefined : value);
                          }}
                        >
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departmentsData && departmentsData.length > 0 ? (
                              departmentsData.map(dept => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name}
                                </SelectItem>
                              ))
                            ) : (
                              departments.map(option => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Job Title"
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Role</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            {rolesData.map(option => (
                              <SelectItem className="capitalize" key={option.id} value={option.id}>
                                {option.code.replace("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {mode === "edit" && (
                  <FormField
                    control={form.control}
                    name="employeeID"
                    disabled
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Employee ID"
                            className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Permissions */}
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-[16px] font-medium">Permissions</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="userManagement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Management</FormLabel>
                      <div className="space-y-2 mt-4">
                        {empPerms.map(perm => (
                          <FormItem key={perm} className="flex items-center space-x-2">
                            <FormControl>
                              <CheckboxSquare
                                checked={field.value?.includes(perm)}
                                onCheckedChange={checked => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), perm]);
                                  } else {
                                    field.onChange((field.value || []).filter(v => v !== perm));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal -mt-2">{perm}</FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contentManagement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Management</FormLabel>
                      <div className="space-y-2 mt-4">
                        {contentPerms.map(perm => (
                          <FormItem key={perm} className="flex items-center space-x-2">
                            <FormControl>
                              <CheckboxSquare
                                checked={field.value?.includes(perm)}
                                onCheckedChange={checked => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), perm]);
                                  } else {
                                    field.onChange((field.value || []).filter(v => v !== perm));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal -mt-2">{perm}</FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="analyticsAndReports"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Analytics & Reports</FormLabel>
                      <div className="space-y-2 mt-4">
                        {analyticsPerms.map(perm => (
                          <FormItem key={perm} className="flex items-center space-x-2">
                            <FormControl>
                              <CheckboxSquare
                                checked={field.value?.includes(perm)}
                                onCheckedChange={checked => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), perm]);
                                  } else {
                                    field.onChange((field.value || []).filter(v => v !== perm));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal -mt-2">{perm}</FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Primary Information */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-[16px] font-medium">Primary Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4 lg:col-span-1 col-span-5">
                <FormField
                  control={form.control}
                  name="primaryEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Email"
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {mode === "create" && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Enter Password"
                            className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Salary"
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-4 lg:col-span-1 col-span-5">
                <FormField
                  control={form.control}
                  name="primaryPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Phone"
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {mode === "create" && (
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Confirm Password"
                            className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="employementType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select user role" />
                          </SelectTrigger>
                          <SelectContent>
                            {employementTypes.map(option => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Address"
                        className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-[16px] font-medium">Address Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Street Address"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="State"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Country"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Zip Code"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullAddress"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Full Address"
                        className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* skills and competencies */}
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-[16px] font-medium">Skills & Competencies</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Textarea
                        placeholder="Skills & Competencies"
                        className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Employee status */}
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-[16px] font-medium">Employee Status</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="employeeStatus"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Employee Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col mt-4 space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value="active"
                              className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Active</FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value="inactive"
                              className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Inactive</FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value="onleave"
                              className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">On Leave</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Company Profile */}
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-[16px] font-medium">Employee Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4 lg:col-span-2 col-span-5">
                <FormField
                  control={form.control}
                  name="accStartDate"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Account Start Date</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            id="date-start"
                            type="date"
                            value={
                              value instanceof Date && !isNaN(value.getTime())
                                ? value.toISOString().split("T")[0]
                                : ""
                            }
                            onChange={e => {
                              const dateString = e.target.value;
                              const date = dateString ? new Date(dateString) : undefined;
                              onChange(date);
                            }}
                            className="
                            dark:bg-[#0F1B29] bg-[#F3F5F7] p-6
                              pr-10
                              [&::-webkit-calendar-picker-indicator]:opacity-0 
                              [&::-webkit-calendar-picker-indicator]:absolute 
                              [&::-webkit-calendar-picker-indicator]:w-full 
                              [&::-webkit-calendar-picker-indicator]:h-full
                            "
                            min={new Date().toISOString().split("T")[0]}
                          />

                          <button
                            type="button"
                            onClick={handleStartDate}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>End Date (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            id="date-end"
                            type="date"
                            value={
                              value instanceof Date && !isNaN(value.getTime())
                                ? value.toISOString().split("T")[0]
                                : ""
                            }
                            onChange={e => {
                              const dateString = e.target.value;
                              const date = dateString ? new Date(dateString) : undefined;
                              onChange(date);
                            }}
                            className="
                            dark:bg-[#0F1B29] bg-[#F3F5F7] p-6
                              pr-10
                              [&::-webkit-calendar-picker-indicator]:opacity-0 
                              [&::-webkit-calendar-picker-indicator]:absolute 
                              [&::-webkit-calendar-picker-indicator]:w-full 
                              [&::-webkit-calendar-picker-indicator]:h-full
                            "
                          />

                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById("date-end") as HTMLInputElement & {
                                showPicker?: () => void;
                              };
                              input?.showPicker?.();
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4 lg:col-span-2 col-span-5">
                <FormField
                  control={form.control}
                  name="performanceRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Performance Rating (0-5)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          placeholder="0.0 - 5.0"
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                          value={field.value ?? ""}
                          onChange={e => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : parseFloat(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Notes</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder="Notes"
                        className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default EmloyeeForm;
