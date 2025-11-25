"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
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
import { getUsers, type IUser } from "@/lib/api/user";
import {
  companySizeOptions,
  createClientSchema,
  industryOptions,
  type CreateClientFormData,
} from "@/lib/validations/client";

import Website from "../ui/icons/socials/website";

interface ClientFormProps {
  initialData?: CreateClientFormData;
  onSubmit: (data: CreateClientFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

const defaultFormData: CreateClientFormData = {
  // Basic Information
  fullName: "",
  industry: "technology",
  businessOverview: "",
  email: "",
  companySize: "0-50",
  // Contact
  contactName: "",
  jobTitle: "",
  phoneNumber: "",
  location: "",
  fullAddress: "",
  linkedinProfile: "",
  department: "",

  // Agreement information
  accountManager: "",
  clientSince: new Date(),
  agreementStartDate: new Date(),
  agreementEndDate: new Date(),
  contractDuration: "",

  clientStatus: "active", // default from enum: active | inactive | Pending | Suspended
  monthlyBudget: "0",
  priorityLevel: "low", // default from enum: low | medium | high

  // Website
  websiteUrl: "",

  // Notes
  internalNotes: "",
};

const ClientForm = ({ initialData, onSubmit }: ClientFormProps) => {
  const { theme } = useTheme();
  const form = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: initialData || defaultFormData,
    mode: "onChange",
  });

  // Fetch users for account manager dropdown
  const { data: users = [], isLoading: loadingUsers } = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getUsers();
      return response.data || [];
    },
  });

  const handleStartDateClick = () => {
    const input = document.getElementById("date-start") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  const handleEndDateClick = () => {
    const input = document.getElementById("date-end") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  const handleClientSinceDate = () => {
    const input = document.getElementById("date-client-since") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  return (
    <Form {...form}>
      <form
        id="lead-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full mx-auto space-y-4 font-inter"
      >
        {/* Basic Information */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Client Name"
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
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry Sector</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                          <SelectValue placeholder="Select campaign type" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                          <SelectValue placeholder="Select campaign type" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizeOptions.map(option => (
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

              {/* Website */}
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                        <div className="h-8 w-8 flex items-center justify-center">
                          {/* Website SVG */}
                          <Website />
                        </div>
                        <Input
                          placeholder="https://company.com"
                          required={false}
                          {...field}
                          className="border-none shadow-none rounded-[12px] focus:outline-none pl-0"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullAddress"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Street Address, City, State, Zip Code"
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

        {/* Contact Information */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Primary Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Michael Ro"
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
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Michael Ro"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email Address"
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+97655555"
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
                name="linkedinProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Linkedin Profile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="link"
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
                      <Input
                        placeholder="Marketing"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
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
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium mb-3">Agreement Information</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
              <FormField
                control={form.control}
                name="agreementStartDate"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          id="date-start"
                          type="date"
                          value={value ? new Date(value).toISOString().split("T")[0] : ""}
                          onChange={e => {
                            const date = new Date(e.target.value);
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
                          onClick={handleStartDateClick}
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
                name="agreementEndDate"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          id="date-end"
                          type="date"
                          value={value ? new Date(value).toISOString().split("T")[0] : ""}
                          onChange={e => {
                            const date = new Date(e.target.value);
                            onChange(date);
                          }}
                          min={
                            form.getValues().agreementStartDate
                              ? new Date(form.getValues().agreementStartDate)
                                .toISOString()
                                .split("T")[0]
                              : undefined
                          }
                          {...field}
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
                          onClick={handleEndDateClick}
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
                name="contractDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Duration</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10 Months"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
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

        {/* Account Management */}
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Account Management </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="accountManager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Manager</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || "none"}
                          onValueChange={(value) => {
                            field.onChange(value === "none" ? "" : value);
                          }}
                          disabled={loadingUsers}
                        >
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder={loadingUsers ? "Loading users..." : "Select account manager"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.fullName}
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
                  name="clientSince"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Client Since *</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            id="date-client-since"
                            type="date"
                            value={value ? new Date(value).toISOString().split("T")[0] : ""}
                            onChange={e => {
                              const date = new Date(e.target.value);
                              onChange(date);
                            }}
                            {...field}
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
                            onClick={handleClientSinceDate}
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
                  name="clientStatus"
                  render={({ field }) => (
                    <FormItem className="space-y-3 col-span-2">
                      <FormLabel>Client Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex sm:flex-row flex-col sm:px-5 md:px-6 px-3 sm:gap-12 gap-2"
                        >
                          <FormItem className="flex items-start space-x-2 space-y-0">
                            <FormControl className="mt-1">
                              <RadioGroupItem
                                value="active"
                                className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                              />
                            </FormControl>
                            <div className="font-normal flex flex-col">
                              <p>Active</p>
                            </div>
                          </FormItem>
                          <FormItem className="flex items-start space-x-2 space-y-0">
                            <FormControl className="mt-1">
                              <RadioGroupItem
                                value="inactive"
                                className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                              />
                            </FormControl>
                            <div className="font-normal flex flex-col">
                              <p>Inactive</p>
                            </div>
                          </FormItem>
                          <FormItem className="flex items-start space-x-2 space-y-0">
                            <FormControl className="mt-1">
                              <RadioGroupItem
                                value="pending"
                                className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                              />
                            </FormControl>
                            <div className="font-normal flex flex-col">
                              <p>Pending</p>
                            </div>
                          </FormItem>
                          <FormItem className="flex items-start space-x-2 space-y-0">
                            <FormControl className="mt-1">
                              <RadioGroupItem
                                value="suspended"
                                className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                              />
                            </FormControl>
                            <div className="font-normal flex flex-col">
                              <p>Suspended</p>
                            </div>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlyBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Budget</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="15000"
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
                  name="priorityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority Level</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select campaign type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High Priority</SelectItem>
                            <SelectItem value="medium">Medium Priority</SelectItem>
                            <SelectItem value="low">Low Priority</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="internalNotes"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Internal Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Key client with strong ROI performance. Prefers monthly reporting and quarterly strategy reviews. Very responsive to email communications."
                          className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
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
      </form>
    </Form>
  );
};

export default ClientForm;
