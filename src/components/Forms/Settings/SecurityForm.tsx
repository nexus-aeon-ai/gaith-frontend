// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { ChevronRight } from "lucide-react";
// import { useTheme } from "next-themes";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import EyeIcon from "@/components/ui/icons/eye";
// import EyeOffIcon from "@/components/ui/icons/eye-off";
// import MobileScreenIcon from "@/components/ui/icons/mobile-screen";
// import PcScreenIcon from "@/components/ui/icons/pc-screen";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import { createSettingsSchema, defaultFormData, type CreateSettingsFormData } from "@/lib/validations/settings";

// import { cn } from "../../../lib/utils";
// import { Button } from "../../ui/button";

// interface ClientFormProps {
//   onSubmit: (data: CreateSettingsFormData) => void;
//   onCancel?: () => void;
//   isSubmitting?: boolean;
// }

// const SecurityForm = ({ onSubmit }: ClientFormProps) => {
//   const { theme } = useTheme();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const form = useForm<CreateSettingsFormData>({
//     resolver: zodResolver(createSettingsSchema),
//     defaultValues: defaultFormData,
//     mode: "onChange",
//   });

//   useEffect(() => {
//     // whenever theme changes (from nav, etc.), update form field
//     form.setValue("darkThemeStatus", theme === "dark");
//   }, [theme, form]);

//   return (
//     <Form {...form}>
//       <form
//         id="lead-form"
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="w-full mx-auto m-0 font-inter"
//       >
//         {/* User profile */}
//         <Card className="m-0 pt-3 rounded-none shadow-none">
//           <CardHeader className="px-3">
//             <CardTitle className="text-md font-bold">Account Security</CardTitle>
//           </CardHeader>
//           <CardContent className="p-4">
//             <div className="grid grid-cols-1 gap-6">
//               <FormField
//                 control={form.control}
//                 name="currentPassword"
//                 render={({ field }) => {
//                   return (
//                     <FormItem>
//                       <FormLabel>Current Password</FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <Input
//                             autoComplete="new-password"
//                             autoCorrect="off"
//                             spellCheck={false}
//                             type={showPassword ? "text" : "password"}
//                             className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px] pr-12"
//                             {...field}
//                           />
//                           <div
//                             role="button"
//                             tabIndex={0}
//                             onClick={() => setShowPassword(!showPassword)}
//                             onKeyDown={e => {
//                               if (e.key === "Enter" || e.key === " ") {
//                                 setShowPassword(!showPassword);
//                               }
//                             }}
//                             className="absolute cursor-pointer bg-transparent p-0 right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                           >
//                             {showPassword ? (
//                               <EyeIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
//                             ) : (
//                               <EyeOffIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
//                             )}
//                           </div>
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   );
//                 }}
//               />

//               <FormField
//                 control={form.control}
//                 name="newPassword"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>New Password</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Input
//                           autoComplete="new-password"
//                           autoCorrect="off"
//                           spellCheck={false}
//                           type={showNewPassword ? "text" : "password"}
//                           className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px] pr-12"
//                           {...field}
//                         />
//                         <div
//                           role="button"
//                           tabIndex={0}
//                           onClick={() => setShowNewPassword(!showNewPassword)}
//                           onKeyDown={e => {
//                             if (e.key === "Enter" || e.key === " ") {
//                               setShowNewPassword(!showNewPassword);
//                             }
//                           }}
//                           className="absolute cursor-pointer bg-transparent p-0 right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                         >
//                           {showNewPassword ? (
//                             <EyeIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
//                           ) : (
//                             <EyeOffIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
//                           )}
//                         </div>
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="confirmPassword"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Confirm Password</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Input
//                           autoComplete="new-password"
//                           autoCorrect="off"
//                           spellCheck={false}
//                           type={showConfirmPassword ? "text" : "password"}
//                           className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px] pr-12"
//                           {...field}
//                         />
//                         <div
//                           role="button"
//                           tabIndex={0}
//                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                           onKeyDown={e => {
//                             if (e.key === "Enter" || e.key === " ") {
//                               setShowConfirmPassword(!showConfirmPassword);
//                             }
//                           }}
//                           className="absolute cursor-pointer bg-transparent p-0 right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                         >
//                           {showConfirmPassword ? (
//                             <EyeIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
//                           ) : (
//                             <EyeOffIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
//                           )}
//                         </div>
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className=" flex items-center justify-between border rounded-[12px] p-4">
//                 <div className="flex flex-col ">
//                   <p className="text-md font-bold ">Two-Factor Authentication</p>
//                   <p className="text-sm font-[400]">
//                     Add an extra layer of security to your account
//                   </p>
//                 </div>

//                 <FormField
//                   control={form.control}
//                   name="twoFactorAuth"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormControl>
//                         <Switch
//                           checked={field.value}
//                           onCheckedChange={field.onChange}
//                           className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 className={cn(
//                   "flex items-center gap-2 w-fit",
//                   "rounded-2xl px-6 text-md h-16",
//                   "bg-[#3072C0] hover:bg-[#3072c0]/80 border-[#3072C0] text-white",
//                 )}
//               >
//                 Update Password
//                 <ChevronRight className="w-4 h-4" />
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* session management */}
//         <Card className="pt-3 rounded-none shadow-none">
//           <CardHeader className="px-3">
//             <CardTitle className="text-md font-bold">Session Management</CardTitle>
//           </CardHeader>
//           <CardContent className="p-4">
//             <div className="grid grid-cols-1 gap-6">
//               <div className=" flex items-center justify-between border rounded-[12px] p-4">
//                 <div className="flex items-center gap-2">
//                   <div className="bg-[#EE4F8D14] p-1 rounded-full">
//                     <PcScreenIcon />
//                   </div>
//                   <div className="flex flex-col ">
//                     <p className="text-md font-[600] ">Current Session - Chrome on Windows</p>
//                     <p className="text-sm font-[400]">Last active: Now • IP: 192.168.1.100</p>
//                   </div>
//                 </div>
//                 <div className=" rounded-md bg-[#2BAE8214] text-[#175E46] dark:text-[#68DAB3] p-2 px-4">Current</div>
//               </div>

//               <div className=" flex items-center justify-between border rounded-[12px] p-4">
//                 <div className="flex items-center gap-2">
//                   <div className="bg-[#3072C014] p-1 rounded-full">
//                     <MobileScreenIcon />
//                   </div>
//                   <div className="flex flex-col ">
//                     <p className="text-md font-[600] ">Mobile Session - Safari on IPhone</p>
//                     <p className="text-sm font-[400]">
//                       Last active: 2 hours ago • IP: 192.168.1.101
//                     </p>
//                   </div>
//                 </div>
//                 <div className=" rounded-md bg-[#2BAE8214] text-[#175E46] dark:text-[#68DAB3] p-2 px-4">Current</div>
//               </div>
//               <p className="text-[16px] text-[#A81A10] font-[500] cursor-pointer">
//                 Sign Out All Other Sessions
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="pt-3 rounded-none rounded-b-[12px] shadow-none">
//           <CardHeader className="px-3">
//             <CardTitle className="text-md font-bold">System Information</CardTitle>
//           </CardHeader>
//           <CardContent className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className=" flex flex-col">
//                 <div className="flex flex-row justify-between items-center">
//                   <p className="text-md font-[400] text-[#687192]">System Version:</p>
//                   <p className="text-sm font-[400]">V2.1.4</p>
//                 </div>
//                 <div className="flex flex-row justify-between items-center">
//                   <p className="text-md font-[400] text-[#687192]">Last Updated:</p>
//                   <p className="text-sm font-[400]">Dec 15, 2024</p>
//                 </div>
//                 <div className="flex flex-row justify-between items-center">
//                   <p className="text-md font-[400] text-[#687192]">Data Size:</p>
//                   <p className="text-sm font-[400]">2.4 GB</p>
//                 </div>
//               </div>
//               <div className=" flex flex-col">
//                 <div className="flex flex-row justify-between items-center">
//                   <p className="text-md font-[400] text-[#687192]">Active Users:</p>
//                   <p className="text-sm font-[400]">12</p>
//                 </div>
//                 <div className="flex flex-row justify-between items-center">
//                   <p className="text-md font-[400] text-[#687192]">45.2 MB</p>
//                   <p className="text-sm font-[400]">Dec 15, 2024</p>
//                 </div>
//                 <div className="flex flex-row justify-between items-center">
//                   <p className="text-md font-[400] text-[#687192]">Backup Status:</p>
//                   <p className="text-sm  text-[#2BAE82] font-[700]">Up to date</p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </form>
//     </Form>
//   );
// };

// export default SecurityForm;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
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
};

interface SecurityFormProps {
  onSubmit: (data: SecurityTabFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const SecurityForm = forwardRef<SecurityFormRef, SecurityFormProps>(
  ({ onSubmit }, ref) => {
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
        
        console.log("🔒 SecurityForm - Transformed Settings Array:", settingsArray.map(setting => ({
          key: setting.key,
          value: setting.key.includes("Password") ? "***" : setting.value,
          category: setting.category,
        })));
        
        const response = await createSettings(settingsArray);
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Failed to save settings");
        }
        return response.data;
      },
      onSuccess: (data) => {
        console.log("🔒 SecurityForm - Settings saved successfully:", data);
        queryClient.invalidateQueries({ queryKey: ["settings"] });
      },
      onError: (error) => {
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
            console.log(`🔒 SecurityForm - Setting form field: ${key} = ${key.includes("Password") ? "***" : value}`);
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
          value: name?.includes("Password") ? "***" : value 
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
          onError: (error) => {
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
              async (data) => {
                console.log("🔒 SecurityForm - Form data validated, calling handleFormSubmit");
                await handleFormSubmit(data);
                resolve();
              },
              (errors) => {
                console.error("🔒 SecurityForm - Form validation errors in handleSubmit:", errors);
                console.error("🔒 SecurityForm - Detailed validation errors:", JSON.stringify(errors, null, 2));
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
                            onKeyDown={(e) =>
                              (e.key === "Enter" || e.key === " ") &&
                              setShowPassword(!showPassword)
                            }
                            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
                            onKeyDown={(e) =>
                              (e.key === "Enter" || e.key === " ") &&
                              setShowNewPassword(!showNewPassword)
                            }
                            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
                            onKeyDown={(e) =>
                              (e.key === "Enter" || e.key === " ") &&
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
                    "rounded-2xl px-6 text-md h-16",
                    "bg-[#3072C0] hover:bg-[#3072c0]/80 border-[#3072C0] text-white",
                  )}
                >
                  Update Password
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    );
  },
);

SecurityForm.displayName = "SecurityForm";
export default SecurityForm;
