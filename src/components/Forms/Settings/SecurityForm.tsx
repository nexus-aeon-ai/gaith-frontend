"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
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
import MobileScreenIcon from "@/components/ui/icons/mobile-screen";
import PcScreenIcon from "@/components/ui/icons/pc-screen";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { createSettingsSchema, defaultFormData, type CreateSettingsFormData } from "@/lib/validations/settings";

import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";

interface ClientFormProps {
  onSubmit: (data: CreateSettingsFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const SecurityForm = ({ onSubmit }: ClientFormProps) => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            <CardTitle className="text-md font-bold">Account Security</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            autoComplete="new-password"
                            autoCorrect="off"
                            spellCheck={false}
                            type={showPassword ? "text" : "password"}
                            className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px] pr-12"
                            {...field}
                          />
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setShowPassword(!showPassword)}
                            onKeyDown={e => {
                              if (e.key === "Enter" || e.key === " ") {
                                setShowPassword(!showPassword);
                              }
                            }}
                            className="absolute cursor-pointer bg-transparent p-0 right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
                  );
                }}
              />

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
                          autoCorrect="off"
                          spellCheck={false}
                          type={showNewPassword ? "text" : "password"}
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px] pr-12"
                          {...field}
                        />
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          onKeyDown={e => {
                            if (e.key === "Enter" || e.key === " ") {
                              setShowNewPassword(!showNewPassword);
                            }
                          }}
                          className="absolute cursor-pointer bg-transparent p-0 right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
                          autoCorrect="off"
                          spellCheck={false}
                          type={showNewPassword ? "text" : "password"}
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px] pr-12"
                          {...field}
                        />
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          onKeyDown={e => {
                            if (e.key === "Enter" || e.key === " ") {
                              setShowConfirmPassword(!showConfirmPassword);
                            }
                          }}
                          className="absolute cursor-pointer bg-transparent p-0 right-3 top-1/2 -translate-y-1/2 text-gray-500"
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

              <div className=" flex items-center justify-between border rounded-[12px] p-4">
                <div className="flex flex-col ">
                  <p className="text-md font-bold ">Two-Factor Authentication</p>
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

              <Button
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

        {/* session management */}
        <Card className="pt-3 rounded-none shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-md font-bold">Session Management</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-6">
              <div className=" flex items-center justify-between border rounded-[12px] p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-[#EE4F8D14] p-1 rounded-full">
                    <PcScreenIcon />
                  </div>
                  <div className="flex flex-col ">
                    <p className="text-md font-[600] ">Current Session - Chrome on Windows</p>
                    <p className="text-sm font-[400]">Last active: Now • IP: 192.168.1.100</p>
                  </div>
                </div>
                <div className=" rounded-md bg-[#2BAE8214] text-[#175E46] dark:text-[#68DAB3] p-2 px-4">Current</div>
              </div>

              <div className=" flex items-center justify-between border rounded-[12px] p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-[#3072C014] p-1 rounded-full">
                    <MobileScreenIcon />
                  </div>
                  <div className="flex flex-col ">
                    <p className="text-md font-[600] ">Mobile Session - Safari on IPhone</p>
                    <p className="text-sm font-[400]">
                      Last active: 2 hours ago • IP: 192.168.1.101
                    </p>
                  </div>
                </div>
                <div className=" rounded-md bg-[#2BAE8214] text-[#175E46] dark:text-[#68DAB3] p-2 px-4">Current</div>
              </div>
              <p className="text-[16px] text-[#A81A10] font-[500] cursor-pointer">
                Sign Out All Other Sessions
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="pt-3 rounded-none rounded-b-[12px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-md font-bold">System Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className=" flex flex-col">
                <div className="flex flex-row justify-between items-center">
                  <p className="text-md font-[400] text-[#687192]">System Version:</p>
                  <p className="text-sm font-[400]">V2.1.4</p>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-md font-[400] text-[#687192]">Last Updated:</p>
                  <p className="text-sm font-[400]">Dec 15, 2024</p>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-md font-[400] text-[#687192]">Data Size:</p>
                  <p className="text-sm font-[400]">2.4 GB</p>
                </div>
              </div>
              <div className=" flex flex-col">
                <div className="flex flex-row justify-between items-center">
                  <p className="text-md font-[400] text-[#687192]">Active Users:</p>
                  <p className="text-sm font-[400]">12</p>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-md font-[400] text-[#687192]">45.2 MB</p>
                  <p className="text-sm font-[400]">Dec 15, 2024</p>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-md font-[400] text-[#687192]">Backup Status:</p>
                  <p className="text-sm  text-[#2BAE82] font-[700]">Up to date</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default SecurityForm;
