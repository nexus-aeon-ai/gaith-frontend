"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { createSettings } from "@/lib/api/settings";
import {
  transformNotificationFormToSettingsAPI,
  transformSettingsAPIToNotificationFormData,
} from "@/lib/functions/settings-transformer";
import {
  defaultNotificationFormData,
  notificationTabSchema,
  type NotificationTabFormData,
} from "@/lib/validations/settings";

export type NotificationFormRef = {
  submitForm: () => Promise<boolean>;
  getValues: () => NotificationTabFormData;
  isDirty: () => boolean;
  hasData: () => boolean;
  isValid: () => boolean;
  resetToDefaults: () => void;
};

interface NotificationFormProps {
  onSubmit: (data: NotificationTabFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const NotificationForm = forwardRef<NotificationFormRef, NotificationFormProps>(
  ({ onSubmit }, ref) => {
    const form = useForm<NotificationTabFormData>({
      resolver: zodResolver(notificationTabSchema),
      defaultValues: defaultNotificationFormData,
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
      mutationFn: async (formData: NotificationTabFormData) => {
        const settingsArray = transformNotificationFormToSettingsAPI(formData);
        const requestBody = { settings: settingsArray };
        
        console.log("🔔 NotificationForm - Sending to Settings API:", {
          endpoint: "/settings",
          method: "POST",
          body: requestBody,
          originalFormData: formData,
          transformedSettings: settingsArray,
        });
        
        console.log("🔔 NotificationForm - Form Data Details:", {
          emailNotifications: {
            newClientAdded: formData.newClientAdded,
            clientStatusChanged: formData.clientStatusChanged,
            weeklyReports: formData.weeklyReports,
          },
          smsNotifications: {
            enableSMSAlerts: formData.enableSMSAlerts,
            playSoundOnSMS: formData.playSoundOnSMS,
            phoneNumber: formData.phoneNumber,
          },
          inAppNotifications: {
            desktopNotifications: formData.desktopNotifications,
            soundAlerts: formData.soundAlerts,
            notificationFrequency: formData.notificationFrequency,
          },
        });
        
        console.log("🔔 NotificationForm - Transformed Settings Array:", settingsArray.map(setting => ({
          key: setting.key,
          value: setting.value,
          category: setting.category,
        })));
        
        const response = await createSettings(settingsArray);
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Failed to save settings");
        }
        return response.data;
      },
      onSuccess: (data) => {
        console.log("🔔 NotificationForm - Settings saved successfully:", data);
        queryClient.invalidateQueries({ queryKey: ["settings"] });
      },
      onError: (error) => {
        console.error("🔔 NotificationForm - Error saving settings:", error);
      },
    });

    // Auto-populate form with API data
    useEffect(() => {
      if (settingsData && settingsData.length > 0) {
        console.log("🔔 NotificationForm - Received settings from API:", settingsData);
        const formData = transformSettingsAPIToNotificationFormData(settingsData);
        console.log("🔔 NotificationForm - Transformed to form data:", formData);
        
        console.log("🔔 NotificationForm - Auto-populating form fields:", {
          emailNotifications: {
            newClientAdded: formData.newClientAdded,
            clientStatusChanged: formData.clientStatusChanged,
            weeklyReports: formData.weeklyReports,
          },
          smsNotifications: {
            enableSMSAlerts: formData.enableSMSAlerts,
            playSoundOnSMS: formData.playSoundOnSMS,
            phoneNumber: formData.phoneNumber,
          },
          inAppNotifications: {
            desktopNotifications: formData.desktopNotifications,
            soundAlerts: formData.soundAlerts,
            notificationFrequency: formData.notificationFrequency,
          },
        });
        
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined) {
            console.log(`🔔 NotificationForm - Setting form field: ${key} = ${value}`);
            form.setValue(key as keyof NotificationTabFormData, value);
          }
        });
      }
    }, [settingsData, form]);

    // Debug form values changes
    useEffect(() => {
      const subscription = form.watch((value, { name, type }) => {
        console.log("🔔 NotificationForm - Form field changed:", { name, type, value });
      });
      return () => subscription.unsubscribe();
    }, [form]);

    const handleFormSubmit = async (data: NotificationTabFormData): Promise<void> => {
      console.log("🔔 NotificationForm - Form submission started with data:", data);
      return new Promise((resolve, reject) => {
        saveSettingsMutation.mutate(data, {
          onSuccess: () => {
            console.log("🔔 NotificationForm - Form submission successful");
            onSubmit?.(data);
            resolve();
          },
          onError: (error) => {
            console.error("🔔 NotificationForm - Form submission failed:", error);
            reject(error);
          },
        });
      });
    };

    // Helper function to check if form has meaningful data
    const hasFormData = () => {
      const values = getValues();
      return (
        values.newClientAdded !== false ||
        values.clientStatusChanged !== false ||
        values.weeklyReports !== false ||
        values.enableSMSAlerts !== false ||
        values.playSoundOnSMS !== false ||
        (values.phoneNumber && values.phoneNumber.trim() !== "") ||
        values.desktopNotifications !== false ||
        values.soundAlerts !== false ||
        values.notificationFrequency !== "5min"
      );
    };

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      submitForm: async (): Promise<boolean> => {
        console.log("🔔 NotificationForm - submitForm called");
        const isValid = await form.trigger();
        if (!isValid) {
          const errors = form.formState.errors;
          console.log("🔔 NotificationForm - Form validation failed with errors:", errors);
          console.log("🔔 NotificationForm - Current form values:", form.getValues());
          console.log("🔔 NotificationForm - Form state:", {
            isDirty: form.formState.isDirty,
            isValid: form.formState.isValid,
            isSubmitting: form.formState.isSubmitting,
            touchedFields: form.formState.touchedFields,
            dirtyFields: form.formState.dirtyFields,
          });
          toast.error("Please fix the validation errors before saving.");
          return false;
        }
        
        console.log("🔔 NotificationForm - Form validation passed, proceeding with submission");
        try {
          await new Promise<void>((resolve, reject) => {
            form.handleSubmit(
              async (data) => {
                console.log("🔔 NotificationForm - Form data validated, calling handleFormSubmit");
                await handleFormSubmit(data);
                resolve();
              },
              (errors) => {
                console.error("🔔 NotificationForm - Form validation errors in handleSubmit:", errors);
                console.error("🔔 NotificationForm - Detailed validation errors:", JSON.stringify(errors, null, 2));
                reject(new Error("Form validation failed"));
              },
            )();
          });
          console.log("🔔 NotificationForm - submitForm completed successfully");
          return true;
        } catch (error) {
          console.error("🔔 NotificationForm - submitForm error:", error);
          return false;
        }
      },
      getValues: () => getValues(),
      isDirty: () => form.formState.isDirty,
      hasData: () => hasFormData(),
      isValid: () => form.formState.isValid,
      resetToDefaults: () => {
        form.reset(defaultNotificationFormData);
      },
    }));

    return (
      <Form {...form}>
        <form
          id="notification-form"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full mx-auto m-0 font-inter"
        >
          {/* Email Notifications */}
          <Card className="m-0 pt-3 rounded-none shadow-none">
            <CardHeader className="px-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <CardTitle className="text-md font-bold">Email Notifications</CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-2">
              {[
                {
                  name: "newClientAdded" as keyof NotificationTabFormData,
                  title: "New Client Added",
                  desc: "Get notified when a new client is added to the system",
                },
                {
                  name: "clientStatusChanged" as keyof NotificationTabFormData,
                  title: "Client Status Changes",
                  desc: "Receive updates when client status is modified",
                },
                {
                  name: "weeklyReports" as keyof NotificationTabFormData,
                  title: "Weekly Reports",
                  desc: "Get weekly summary reports via email",
                },
              ].map(({ name, title, desc }) => (
                <div
                  key={name}
                  className="flex items-center justify-between border rounded-[12px] p-4"
                >
                  <div className="flex flex-col">
                    <p className="text-md font-[600]">{title}</p>
                    <p className="text-sm font-[400]">{desc}</p>
                  </div>
                  <FormField
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={Boolean(field.value)}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* SMS Notifications */}
          <Card className="m-0 pt-3 rounded-none shadow-none">
            <CardHeader className="px-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <CardTitle className="text-md font-bold">SMS Notifications</CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-2">
              {[
                {
                  name: "enableSMSAlerts" as keyof NotificationTabFormData,
                  title: "Enable SMS Alerts",
                  desc: "Show browser notifications for important updates",
                },
                {
                  name: "playSoundOnSMS" as keyof NotificationTabFormData,
                  title: "Play Sound on New Notification",
                  desc: "Play sound when a new notification is received",
                },
              ].map(({ name, title, desc }) => (
                <div
                  key={name}
                  className="flex items-center justify-between border rounded-[12px] p-4"
                >
                  <div className="flex flex-col">
                    <p className="text-md font-[600]">{title}</p>
                    <p className="text-sm font-[400]">{desc}</p>
                  </div>
                  <FormField
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={Boolean(field.value)}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              {/* Phone Number */}
              <div className="px-2 p-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0096777777777"
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

          {/* In-App Notifications */}
          <Card className="m-0 pt-3 rounded-none rounded-b-[12px] shadow-none">
            <CardHeader className="px-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <CardTitle className="text-md font-bold">In-App Notifications</CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-2">
              {[
                {
                  name: "desktopNotifications" as keyof NotificationTabFormData,
                  title: "Desktop Notifications",
                  desc: "Receive important notifications via SMS",
                },
                {
                  name: "soundAlerts" as keyof NotificationTabFormData,
                  title: "Sound Alerts",
                  desc: "Receive important notifications via SMS",
                },
              ].map(({ name, title, desc }) => (
                <div
                  key={name}
                  className="flex items-center justify-between border rounded-[12px] p-4"
                >
                  <div className="flex flex-col">
                    <p className="text-md font-[600]">{title}</p>
                    <p className="text-sm font-[400]">{desc}</p>
                  </div>
                  <FormField
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={Boolean(field.value)}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              {/* Frequency */}
              <div className="px-2 p-4">
                <FormField
                  control={form.control}
                  name="notificationFrequency"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Notifications Frequency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="5min">Every 5 minutes</SelectItem>
                          <SelectItem value="15min">Every 15 minutes</SelectItem>
                          <SelectItem value="1hr">Every 1 hour</SelectItem>
                          <SelectItem value="4hrs">Every 4 hours</SelectItem>
                          <SelectItem value="12hrs">Every 12 hours</SelectItem>
                          <SelectItem value="24hrs">Every 24 hours</SelectItem>
                        </SelectContent>
                      </Select>
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
  },
);

NotificationForm.displayName = "NotificationForm";
export default NotificationForm;
