"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Monitor, Smartphone } from "lucide-react";
import { useTheme } from "next-themes";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { createSettings } from "@/lib/api/settings";
import {
  transformSecurityFormToSettingsAPI,
  transformSettingsAPIToSecurityFormData,
} from "@/lib/functions/settings-transformer";
import { cn } from "@/lib/utils";
import {
  defaultSecurityFormData,
  securityTabSchema,
  type SecurityTabFormData,
} from "@/lib/validations/settings";

// ✅ Define the type that parent can use
export type SecurityFormRef = {
  submitForm: () => Promise<boolean>;
  getValues: () => SecurityTabFormData;
  isDirty: () => boolean;
  hasData: () => boolean;
  isValid: () => boolean;
  resetToDefaults: () => void;
};

interface SecurityFormProps {
  onSubmit: (data: SecurityTabFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}
const sessions = [
  {
    id: 1,
    type: "Current Session",
    device: "Chrome On Windows",
    icon: <Monitor className="w-5 h-5 text-pink-500" />,
    lastActive: "Now",
    ip: "192.168.1.100",
    status: "Current",
  },
  {
    id: 2,
    type: "Mobile Session",
    device: "Safari On iPhone",
    icon: <Smartphone className="w-5 h-5 text-blue-500" />,
    lastActive: "2 hours ago",
    ip: "192.168.1.101",
    status: "Current",
  },
];

const SecurityForm = forwardRef<SecurityFormRef, SecurityFormProps>(({ onSubmit }, ref) => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SecurityTabFormData>({
    resolver: zodResolver(securityTabSchema),
    defaultValues: defaultSecurityFormData,
    mode: "onChange",
  });

  const { handleSubmit, getValues } = form;
  const queryClient = useQueryClient();

  // Fetch settings data from API
  const { data: settingsData } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await fetch("/api/settings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (formData: SecurityTabFormData) => {
      const settingsArray = transformSecurityFormToSettingsAPI(formData);
      const requestBody = { settings: settingsArray };

      console.log("🔒 SecurityForm - Sending to Settings API:", {
        endpoint: "/settings",
        method: "POST",
        body: requestBody,
        originalFormData: formData,
        transformedSettings: settingsArray,
      });

      console.log("🔒 SecurityForm - Form Data Details:", {
        passwordFields: {
          currentPassword: formData.currentPassword ? "***" : "",
          newPassword: formData.newPassword ? "***" : "",
          confirmPassword: formData.confirmPassword ? "***" : "",
        },
        twoFactorAuth: formData.twoFactorAuth,
      });

      console.log(
        "🔒 SecurityForm - Transformed Settings Array:",
        settingsArray.map(setting => ({
          key: setting.key,
          value: setting.key.includes("Password") ? "***" : setting.value,
          category: setting.category,
        })),
      );

      const response = await createSettings(settingsArray);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to save settings");
      }
      return response.data;
    },
    onSuccess: data => {
      console.log("🔒 SecurityForm - Settings saved successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: error => {
      console.error("🔒 SecurityForm - Error saving settings:", error);
    },
  });

  // Auto-populate form with API data
  useEffect(() => {
    if (settingsData && settingsData.length > 0) {
      console.log("🔒 SecurityForm - Received settings from API:", settingsData);
      const formData = transformSettingsAPIToSecurityFormData(settingsData);
      console.log("🔒 SecurityForm - Transformed to form data:", formData);

      console.log("🔒 SecurityForm - Auto-populating form fields:", {
        twoFactorAuth: formData.twoFactorAuth,
        passwordFields: {
          currentPassword: formData.currentPassword ? "***" : "",
          newPassword: formData.newPassword ? "***" : "",
          confirmPassword: formData.confirmPassword ? "***" : "",
        },
      });

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          console.log(
            `🔒 SecurityForm - Setting form field: ${key} = ${
              key.includes("Password") ? "***" : value
            }`,
          );
          form.setValue(key as keyof SecurityTabFormData, value);
        }
      });
    }
  }, [settingsData, form]);

  // Debug form values changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log("🔒 SecurityForm - Form field changed:", {
        name,
        type,
        value: name?.includes("Password") ? "***" : value,
      });
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleFormSubmit = async (data: SecurityTabFormData): Promise<void> => {
    console.log("🔒 SecurityForm - Form submission started with data:", {
      ...data,
      currentPassword: data.currentPassword ? "***" : "",
      newPassword: data.newPassword ? "***" : "",
      confirmPassword: data.confirmPassword ? "***" : "",
    });
    return new Promise((resolve, reject) => {
      saveSettingsMutation.mutate(data, {
        onSuccess: () => {
          console.log("🔒 SecurityForm - Form submission successful");
          onSubmit?.(data);
          resolve();
        },
        onError: error => {
          console.error("🔒 SecurityForm - Form submission failed:", error);
          reject(error);
        },
      });
    });
  };

  // ✅ Expose form methods to parent
  // Helper function to check if form has meaningful data
  const hasFormData = () => {
    const values = getValues();
    return (
      (values.currentPassword && values.currentPassword.trim() !== "") ||
      (values.newPassword && values.newPassword.trim() !== "") ||
      (values.confirmPassword && values.confirmPassword.trim() !== "") ||
      values.twoFactorAuth !== false
    );
  };

  useImperativeHandle(ref, () => ({
    submitForm: async (): Promise<boolean> => {
      console.log("🔒 SecurityForm - submitForm called");
      const isValid = await form.trigger();
      if (!isValid) {
        const errors = form.formState.errors;
        console.log("🔒 SecurityForm - Form validation failed with errors:", errors);
        console.log("🔒 SecurityForm - Current form values:", {
          ...form.getValues(),
          currentPassword: form.getValues().currentPassword ? "***" : "",
          newPassword: form.getValues().newPassword ? "***" : "",
          confirmPassword: form.getValues().confirmPassword ? "***" : "",
        });
        console.log("🔒 SecurityForm - Form state:", {
          isDirty: form.formState.isDirty,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          touchedFields: form.formState.touchedFields,
          dirtyFields: form.formState.dirtyFields,
        });
        toast.error("Please fix the validation errors before saving.");
        return false;
      }

      console.log("🔒 SecurityForm - Form validation passed, proceeding with submission");
      try {
        await new Promise<void>((resolve, reject) => {
          form.handleSubmit(
            async data => {
              console.log("🔒 SecurityForm - Form data validated, calling handleFormSubmit");
              await handleFormSubmit(data);
              resolve();
            },
            errors => {
              console.error("🔒 SecurityForm - Form validation errors in handleSubmit:", errors);
              console.error(
                "🔒 SecurityForm - Detailed validation errors:",
                JSON.stringify(errors, null, 2),
              );
              reject(new Error("Form validation failed"));
            },
          )();
        });
        console.log("🔒 SecurityForm - submitForm completed successfully");
        return true;
      } catch (error) {
        console.error("🔒 SecurityForm - submitForm error:", error);
        return false;
      }
    },
    getValues: () => getValues(),
    isDirty: () => form.formState.isDirty,
    hasData: () => hasFormData(),
    isValid: () => form.formState.isValid,
    resetToDefaults: () => {
      form.reset(defaultSecurityFormData);
      setShowPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    },
  }));

  return (
    <Form {...form}>
      <form
        id="security-form"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto m-0 font-inter"
      >
        {/* Account Security */}
        <Card className="m-0 pt-3 rounded-none shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-md font-bold">Account Security</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-6">
              {/* Current Password */}
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          autoComplete="new-password"
                          type={showPassword ? "text" : "password"}
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px] pr-12"
                          {...field}
                        />
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setShowPassword(!showPassword)}
                          onKeyDown={e =>
                            (e.key === "Enter" || e.key === " ") && setShowPassword(!showPassword)
                          }
                          className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? (
                            <EyeIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                          ) : (
                            <EyeOffIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          autoComplete="new-password"
                          type={showNewPassword ? "text" : "password"}
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px] pr-12"
                          {...field}
                        />
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          onKeyDown={e =>
                            (e.key === "Enter" || e.key === " ") &&
                            setShowNewPassword(!showNewPassword)
                          }
                          className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showNewPassword ? (
                            <EyeIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                          ) : (
                            <EyeOffIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          autoComplete="new-password"
                          type={showConfirmPassword ? "text" : "password"}
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px] pr-12"
                          {...field}
                        />
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          onKeyDown={e =>
                            (e.key === "Enter" || e.key === " ") &&
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                          ) : (
                            <EyeOffIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between border rounded-[12px] p-4">
                <div className="flex flex-col">
                  <p className="text-md font-bold">Two-Factor Authentication</p>
                  <p className="text-sm font-[400]">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="twoFactorAuth"
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

              {/* Submit */}
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className={cn(
                  "flex items-center gap-2 w-fit",
                  "rounded-2xl px-6 text-md h-14",
                  "bg-[#3072C0] hover:bg-[#3072c0]/80 border-[#3072C0] text-white",
                )}
              >
                Update Password
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
              <div className="border border-[#DCE0E4] dark:border-[#404663]  my-4"/>

            <div className="mt-4">
              <section className="mb-4">
                <h2 className="font-semibold mb-4 text-base">Session Management</h2>

                <div className="space-y-3">
                  {sessions.map(session => (
                    <div
                      key={session.id}
                      className="flex justify-between items-center p-4 rounded-xl border transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center  rounded-lg shadow-sm">
                          {session.icon}
                        </div>
                        <div>
                          <p className="font-semibold ">
                            {session.type} – {session.device}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Last active: {session.lastActive} • IP: {session.ip}
                          </p>
                        </div>
                      </div>

                      <span className="px-4 py-1 text-[12px] font-normal text-[#175E46] dark:text-[#68DAB3] dark:bg-[#2BAE8229] bg-[#2BAE8214] rounded-lg">
                        {session.status}
                      </span>
                    </div>
                  ))}
                </div>

                <button className="text-[#A81A10] font-medium mt-4 hover:underline">
                  Sign Out All Other Sessions
                </button>
              </section>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
});

SecurityForm.displayName = "SecurityForm";
export default SecurityForm;
