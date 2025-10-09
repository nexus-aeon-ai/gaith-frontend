"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import EyeIcon from "@/components/ui/icons/eye";
import EyeOffIcon from "@/components/ui/icons/eye-off";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  analyticsPerms,
  contentPerms,
  createEmpSchema,
  defaultFormData,
  departments,
  employementTypes,
  empPerms,
  empRoles,
  type CreateEmpFormData,
} from "@/lib/validations/employee";

import { CheckboxSquare } from "../ui/checkbox-square";
import { Switch } from "../ui/switch";

interface EmloyeeFormProps {
  initialData?: CreateEmpFormData;
  onSubmit: (data: CreateEmpFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

const EmloyeeForm = ({ initialData, onSubmit }: EmloyeeFormProps) => {
  const { theme } = useTheme();
  const [showTempPassword, setShowTempPassword] = useState(false);

  const form = useForm<CreateEmpFormData>({
    resolver: zodResolver(createEmpSchema),
    defaultValues: initialData || defaultFormData,
    mode: "onChange",
  });

  const handleExpiryDate = () => {
    const input = document.getElementById("date-start") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  return (
    <Form {...form}>
      <form
        id="user-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full mx-auto space-y-4"
      >
        {/* Basic Information */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-[16px] font-medium">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="flex flex-col lg:col-span-1 col-span-5 gap-2 justify-center items-center">
                <div className="rounded-full text-xl text-[#3072C0] sm:text-3xl bg-[#3072C014] h-24 w-24 flex items-center justify-center">
                  MA
                </div>
                <p className="text-[#3072C0] cursor-pointer hover:underline">Change Photo</p>
                <p className="text-[#687192] text-sm">JPG, PNG up to 2MB</p>
              </div>

              <div className="flex flex-col gap-4 lg:col-span-2 col-span-5">
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
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(option => (
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
              </div>

              <div className="flex flex-col gap-4 lg:col-span-2 col-span-5">
                <FormField
                  control={form.control}
                  name="email"
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
                <FormField
                  control={form.control}
                  name="empRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Role</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {empRoles.map(option => (
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
                <FormField
                  control={form.control}
                  name="employeeID"
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
                                    field.onChange([...field.value, perm]);
                                  } else {
                                    field.onChange(field.value.filter(v => v !== perm));
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
                                    field.onChange([...field.value, perm]);
                                  } else {
                                    field.onChange(field.value.filter(v => v !== perm));
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
                                    field.onChange([...field.value, perm]);
                                  } else {
                                    field.onChange(field.value.filter(v => v !== perm));
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
                  name="email"
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
            <CardTitle className="text-[16px] font-medium">Company Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
                  <div className="col-span-3 flex items-center justify-between border rounded-[12px] p-4">
                    <div className="flex flex-col ">
                      <p className="text-md font-[600] ">Account Active</p>
                      <p className="text-sm font-[400]">User can login and access the platform</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="accountActive"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
                  <div className="col-span-3 flex items-center justify-between border rounded-[12px] p-4">
                    <div className="flex flex-col ">
                      <p className="text-md font-[600] ">Email Verification Required</p>
                      <p className="text-sm font-[400]">
                        User must verify email before first login
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="emailVerification"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
                  <div className="col-span-3 flex items-center justify-between border rounded-[12px] p-4">
                    <div className="flex flex-col ">
                      <p className="text-md font-[600] ">Force Password Change</p>
                      <p className="text-sm font-[400]">User must change password on first login</p>
                    </div>
                    <FormField
                      control={form.control}
                      name="forcePassChange"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4 lg:col-span-2 col-span-5">
                <FormField
                  control={form.control}
                  name="accExpiryDate"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Account Expiry Date</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            id="date-expiry"
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
                            onClick={handleExpiryDate}
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
                  name="tempPassword"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Temporary Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              autoComplete="temp-password"
                              autoCorrect="off"
                              spellCheck={false}
                              type={showTempPassword ? "text" : "password"}
                              className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px] pr-12"
                              {...field}
                            />
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => setShowTempPassword(!showTempPassword)}
                              onKeyDown={e => {
                                if (e.key === "Enter" || e.key === " ") {
                                  setShowTempPassword(!showTempPassword);
                                }
                              }}
                              className="absolute cursor-pointer bg-transparent p-0 right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                              {showTempPassword ? (
                                <EyeIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                              ) : (
                                <EyeOffIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
                        placeholder="Add any additional notes about this employee..."
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
