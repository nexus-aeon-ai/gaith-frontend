"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { forwardRef, useEffect, useImperativeHandle } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createSettings, getSettings } from "@/lib/api/settings";
import { transformGeneralFormToSettingsAPI, transformSettingsAPIToFormData } from "@/lib/functions";
import {
  defaultExports,
  defaultGeneralFormData,
  departments,
  generalTabSchema,
  type GeneralTabFormData,
} from "@/lib/validations/settings";

import { cn } from "../../../lib/utils";

export type GeneralTabFormRef = {
  submitForm: () => Promise<boolean>;
  getValues: () => GeneralTabFormData;
  isDirty: () => boolean;
  hasData: () => boolean;
  isValid: () => boolean;
  resetToDefaults: () => void;
};

interface GeneralTabFormProps {
  onSubmit?: (data: GeneralTabFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

// Wrap in forwardRef so parent can control it
const GeneralTabForm = forwardRef<GeneralTabFormRef, GeneralTabFormProps>(({ onSubmit }, ref) => {
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();

  const form = useForm<GeneralTabFormData>({
    resolver: zodResolver(generalTabSchema),
    defaultValues: defaultGeneralFormData,
    mode: "onChange",
  });

  // Fetch existing settings
  const { data: settingsData, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await getSettings();
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return [];
    },
  });

  // Mutation for saving settings
  const saveSettingsMutation = useMutation({
    mutationFn: async (formData: GeneralTabFormData) => {
      const settingsArray = transformGeneralFormToSettingsAPI(formData);
      
      // 🔍 Console log the body being sent to settings API
      const requestBody = { settings: settingsArray };
      console.log("Sending to Settings API:", {
        endpoint: "/settings",
        method: "POST",
        body: requestBody,
        originalFormData: formData,
        transformedSettings: settingsArray,
      });
      
      const response = await createSettings(settingsArray);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to save settings");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => {
      console.error("Error saving settings:", error);
    },
  });

  // Handle form submission
  const handleFormSubmit = async (data: GeneralTabFormData): Promise<void> => {
    return new Promise((resolve, reject) => {
      saveSettingsMutation.mutate(data, {
        onSuccess: () => {
          onSubmit?.(data);
          resolve();
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  // Populate form with existing settings
  useEffect(() => {
    if (settingsData && settingsData.length > 0) {
      console.log("📥 Received settings from API:", settingsData);
      
      const formData = transformSettingsAPIToFormData(settingsData);
      console.log("🔄 Transformed to form data:", formData);
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          console.log(`📝 Setting form field: ${key} = ${value}`);
          form.setValue(key as keyof GeneralTabFormData, value);
          
          // Special handling for department field (Select component)
          if (key === "department") {
            console.log(`🏢 Department field set to: "${value}"`);
            
            // Ensure we never set an empty value
            const departmentValue = value || "Sales";
            console.log(`🏢 Using department value: "${departmentValue}"`);
            
            // Use setTimeout to ensure Select component is ready
            setTimeout(() => {
              form.setValue("department", departmentValue as any);
              // Clear any validation errors for the department field
              form.clearErrors("department");
              console.log("🏢 Department field re-set after timeout:", form.getValues().department);
            }, 100);
          }
        }
      });
    }
  }, [settingsData, form]);

  useEffect(() => {
    form.setValue("darkThemeStatus", theme === "dark");
  }, [theme, form]);

  // Helper function to check if form has meaningful data
  const hasFormData = () => {
    const values = form.getValues();
    return (
      (values.fullName && values.fullName.trim() !== "") ||
      (values.email && values.email.trim() !== "") ||
      (values.jobTitle && values.jobTitle.trim() !== "") ||
      values.department !== "Sales" || // Different from default
      values.interfaceLang !== "English" || // Different from default
      values.darkThemeStatus !== false || // Different from default
      values.defaultExport !== "XLSX" || // Different from default
      values.includeMetaData !== false // Different from default
    );
  };

  // Expose methods to parent (SettingsTabs)
  useImperativeHandle(ref, () => ({
    submitForm: async (): Promise<boolean> => {
      // First trigger validation
      const isValid = await form.trigger();
      
      if (!isValid) {
        // Show validation error toast
        toast.error("Please fix the validation errors before saving.");
        return false;
      }
      
      // If validation passes, submit the form
      try {
        await new Promise<void>((resolve, reject) => {
          form.handleSubmit(
            async (data) => {
              try {
                await handleFormSubmit(data);
                resolve();
              } catch (error) {
                reject(error);
              }
            },
            (_errors) => {
              reject(new Error("Form validation failed"));
            },
          )();
        });
        return true;
      } catch (error) {
        console.error("Form submission error:", error);
        return false;
      }
    },
    getValues: () => form.getValues(),
    isDirty: () => form.formState.isDirty,
    hasData: () => hasFormData(),
    isValid: () => form.formState.isValid,
    resetToDefaults: () => {
      form.reset(defaultGeneralFormData);
      setTheme("light"); // Reset theme to light
    },
  }));

  // Show loading state while fetching settings
  if (isLoadingSettings) {
    return (
      <div className="w-full mx-auto m-0 font-inter">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        id="general-settings-form"
        onSubmit={form.handleSubmit(handleFormSubmit)}
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
                          checked={theme==="dark"? true : false}
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
                  className={cn(
                    "border cursor-pointer w-full rounded-[12px] p-4 flex flex-col gap-3",
                    { "hover:border-blue-500": theme === "light" },
                    { "border-2 border-blue-500": theme === "light" },
                  )}
                >
                  <p className="text-sm font-light">Light Theme Preview</p>
                  <div className="flex flex-col gap-1 items-center p-2 justify-center bg-[#F3F5F7] rounded-[12px]">
                    <div className="flex items-center w-full justify-center bg-[#3072C0] rounded-[12px] h-3" />
                    <div className="flex items-center w-full justify-center bg-[#DCE0E4] rounded-[12px] h-2" />
                    <div className="flex items-center self-start w-[75%] justify-center bg-[#DCE0E4] rounded-[12px] h-2" />
                  </div>
                </div>
                <div
                  className={cn(
                    "border cursor-pointer w-full rounded-[12px] p-4 flex flex-col gap-3",
                    {
                      "border-2 border-blue-500": theme === "dark",
                    },
                  )}
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
                    <p className="text-sm font-[400]">Add creation date and user info to exports</p>
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
});

GeneralTabForm.displayName = "GeneralTabForm";

export default GeneralTabForm;
