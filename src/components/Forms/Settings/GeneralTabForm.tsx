"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  createSettingsSchema,
  defaultExports,
  departments,
  type CreateSettingsFormData,
} from "@/lib/validations/settings";

import { cn } from "../../../lib/utils";

interface ClientFormProps {
  onSubmit: (data: CreateSettingsFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const GeneralTabForm = ({ onSubmit }: ClientFormProps) => {
  const { theme, setTheme } = useTheme();

  const defaultFormData: CreateSettingsFormData = {
    // ***** GENERAL SECTION *****
    fullName: "",
    email: "",
    jobTitle: "",
    department: "Sales", // default from departments enum

    // Language and regional settings
    interfaceLang: "English",
    textDirection: "left-to-right",

    // Theme preferences
    darkThemeStatus: theme === "dark",

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

  const form = useForm<CreateSettingsFormData>({
    resolver: zodResolver(createSettingsSchema),
    defaultValues: defaultFormData,
    mode: "onChange",
  });

  useEffect(() => {
    // whenever theme changes (from nav, etc.), update form field
    form.setValue("darkThemeStatus", theme === "dark");
  }, [theme, form]);

  return (
    <Form {...form}>
      <form
        id="lead-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full mx-auto m-0 font-inter"
      >
        {/* User profile */}
        <Card className="m-0 pt-3 rounded-none shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">User Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Sara Johnson"
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
                        placeholder="sarah.johnson@company.com"
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
                        placeholder="Account Manager"
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
                          <SelectValue placeholder="Select campaign type" />
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
            </div>
          </CardContent>
        </Card>

        {/* Language and regional section */}
        <Card className="pt-3 rounded-none shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Language and Regional Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="interfaceLang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interface Language</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {["English", "Arabic"].map(option => (
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
                name="textDirection"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Text Direction</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex sm:flex-row flex-col  sm:gap-12 gap-2"
                      >
                        <FormItem className="flex items-start space-x-2 space-y-0">
                          <FormControl className="mt-[2px]">
                            <RadioGroupItem
                              value="left-to-right"
                              className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                            />
                          </FormControl>
                          <div className="font-normal text-sm flex flex-col">
                            <p>Left To Right</p>
                          </div>
                        </FormItem>
                        <FormItem className="flex items-start space-x-2 space-y-0">
                          <FormControl className="mt-[2px]">
                            <RadioGroupItem
                              value="right-to-left"
                              className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                            />
                          </FormControl>
                          <div className="font-normal text-sm flex flex-col">
                            <p>Right To Left</p>
                          </div>
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

        {/* Theme preference */}
        <Card className="pt-3 rounded-none shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium mb-3">Theme Preference</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
              <div className="col-span-3 flex items-center justify-between border rounded-[12px] p-4">
                <div className="flex flex-col ">
                  <p className="text-md font-[700] ">Dark Mode</p>
                  <p className="text-sm font-[400]">
                    Switch to dark theme for better night viewing
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="darkThemeStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={checked => {
                            field.onChange(checked);
                            setTheme(checked ? "dark" : "light");
                          }}
                          className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex col-span-3 flex-col lg:flex-row gap-3">
                <div
                  className={cn("border w-full rounded-[12px] p-4 flex flex-col gap-3", {
                    "border-2 border-blue-500": theme === "light",
                  })}
                >
                  <p className="text-sm font-light">Light Theme Preview</p>
                  <div className="flex flex-col gap-1 items-center p-2 justify-center bg-[#F3F5F7] rounded-[12px]">
                    <div className="flex items-center w-full justify-center bg-[#3072C0] rounded-[12px] h-3" />
                    <div className="flex items-center w-full justify-center bg-[#DCE0E4] rounded-[12px] h-2" />
                    <div className="flex items-center self-start w-[75%] justify-center bg-[#DCE0E4] rounded-[12px] h-2" />
                  </div>
                </div>
                <div
                  className={cn("border w-full rounded-[12px] p-4 flex flex-col gap-3", {
                    "border-2 border-blue-500": theme === "dark",
                  })}
                >
                  <p className="text-sm font-light">Dark Theme Preview</p>
                  <div className="flex flex-col gap-1 items-center p-2 justify-center bg-[#0F1B29] rounded-[12px]">
                    <div className="flex items-center w-full justify-center bg-[#3072C0] rounded-[12px] h-3" />
                    <div className="flex items-center w-full justify-center bg-[#DCE0E4] rounded-[12px] h-2" />
                    <div className="flex items-center self-start w-[75%] justify-center bg-[#DCE0E4] rounded-[12px] h-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Export Settings */}
        <Card className="pt-3 rounded-none shadow-none rounded-b-[12px]">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Data Export Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
                <div className="col-span-3 flex md:flex-row flex-col items-center justify-between border rounded-[12px] p-4">
                  <div className="flex flex-col ">
                    <p className="text-md font-[700] ">Default Export Format</p>
                    <p className="text-sm font-[400]">
                      Choose your preferred format for data exports
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="defaultExport"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="dark:bg-[#0F1B29] py-6 min-w-[200px] bg-[#F3F5F7] rounded-[12px]">
                              <SelectValue placeholder="Select campaign type" />
                            </SelectTrigger>
                            <SelectContent>
                              {defaultExports.map(option => (
                                <SelectItem key={option} value={option}>
                                  {option === "XLSX" ? "Excel (.xlsx)" : "PDF (.pdf)"}
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
              </div>
              <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
                <div className="col-span-3 flex items-center justify-between border rounded-[12px] p-4">
                  <div className="flex flex-col ">
                    <p className="text-md font-[700] ">Include Metadata</p>
                    <p className="text-sm font-[400]">
                      Add creation date and user info to exports
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="includeMetaData"
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
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default GeneralTabForm;
