"use client";
import { useTheme } from "next-themes";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

import NotificationIcon from "@/components/ui/icons/notfication";
import NotificationFilledIcon from "@/components/ui/icons/notification-filled";
import SecurityIcon from "@/components/ui/icons/security";
import SecurityFilledIcon from "@/components/ui/icons/security-filled";
import {SettingsIcon} from "@/components/ui/icons/settings";
import SettingsFilledIcon from "@/components/ui/icons/settings-filled";
import UserIcon from "@/components/ui/icons/user";
import UserFilledIcon from "@/components/ui/icons/user-filled"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import GeneralTabForm, { GeneralTabFormRef } from "../Forms/Settings/GeneralTabForm";
import NotificationForm, { NotificationFormRef } from "../Forms/Settings/NotificationForm";
import SecurityForm, { SecurityFormRef } from "../Forms/Settings/SecurityForm";
import UserManagementForm, { UserManagementFormRef } from "../Forms/Settings/UserManagementForm";

export type SettingsTabsRef = {
  getAllFormData: () => Record<string, unknown>;
  submitAllForms: () => Promise<void>;
  submitModifiedForms: () => Promise<{ savedForms: string[]; skippedForms: string[] }>;
  resetAllForms: () => void;
};

export const SettingsTabs = forwardRef<SettingsTabsRef>((_, ref) => {
  const [activeTab, setActiveTab] = useState("general");
  const {theme} = useTheme();

  const generalRef = useRef<GeneralTabFormRef>(null);
  const userRef = useRef<UserManagementFormRef>(null);
  const notificationRef = useRef<NotificationFormRef>(null);
  const securityRef = useRef<SecurityFormRef>(null);

  // Smart submission function that only submits modified/filled forms
  const submitModifiedForms = async (): Promise<{
    savedForms: string[];
    skippedForms: string[];
  }> => {
    const savedForms: string[] = [];
    const skippedForms: string[] = [];

    const forms = [
      { name: "General", ref: generalRef, hasApi: true },
      { name: "User Management", ref: userRef, hasApi: false },
      { name: "Notifications", ref: notificationRef, hasApi: true },
      { name: "Security", ref: securityRef, hasApi: true },
    ];

    for (const form of forms) {
      const formRef = form.ref.current;
      if (formRef) {
        const isDirty = formRef.isDirty();
        const hasData = formRef.hasData();

        // Only submit if form is dirty (modified) OR has meaningful data AND has API integration
        if ((isDirty || hasData) && form.hasApi) {
          try {
            const success = await formRef.submitForm();
            if (success) {
              savedForms.push(form.name);
            } else {
              skippedForms.push(`${form.name} (validation failed)`);
            }
          } catch (error) {
            console.error(`Error saving ${form.name} form:`, error);
            skippedForms.push(`${form.name} (error)`);
          }
        } else if ((isDirty || hasData) && !form.hasApi) {
          skippedForms.push(`${form.name} (no API)`);
        } else {
          skippedForms.push(`${form.name} (no changes)`);
        }
      } else {
        skippedForms.push(`${form.name} (not loaded)`);
      }
    }

    return { savedForms, skippedForms };
  };

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getAllFormData: () => ({
      general: generalRef.current?.getValues(),
      users: userRef.current?.getValues(),
      notifications: notificationRef.current?.getValues(),
      security: securityRef.current?.getValues(),
    }),
    submitAllForms: async () => {
      await generalRef.current?.submitForm();
      await userRef.current?.submitForm();
      await notificationRef.current?.submitForm();
      await securityRef.current?.submitForm();
    },
    submitModifiedForms,
    resetAllForms: () => {
      generalRef.current?.resetToDefaults();
      userRef.current?.resetToDefaults();
      notificationRef.current?.resetToDefaults();
      securityRef.current?.resetToDefaults();
    },
  }));

  return (
    <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
      <TabsList
        className={cn(
          "w-full grid grid-cols-4 gap-0 p-0! h-auto rounded-t-xl rounded-b-none  data-[state=active]:bg-[#3072C014] rounded-e-none overflow-hidden border bg-card mt-3",
        )}
      >
        <TabsTrigger
          value="general"
          className="dark:data-[state=active]:text-[#3072C0] data-[state=active]:text-[#3072C0] dark:text-[#CCCFDB] text-[#303444] py-3 whitespace-nowrap rounded-b-none data-[state=active]:bg-[#3072C014] data-[state=active]:border-b data-[state=active]:border-b-[#3072C0] flex items-center justify-center gap-2"
        >
          {activeTab === "general" ? <SettingsFilledIcon color="#3072C0"/> : <SettingsIcon color={theme === "dark"? "#CCCFDB":"#303444"}/>}
          General
        </TabsTrigger>
        <TabsTrigger
          value="users"
          className="data-[state=active]:text-[#3072C0] py-3 whitespace-nowrap rounded-b-none data-[state=active]:bg-[#3072C014] data-[state=active]:border-b data-[state=active]:border-b-[#3072C0] flex items-center justify-center gap-2"
        >
          {activeTab === "users" ? <UserFilledIcon color="#3072C0"/> : <UserIcon />}
          User Management
        </TabsTrigger>
        <TabsTrigger
          value="notifications"
          className="data-[state=active]:text-[#3072C0] py-3 whitespace-nowrap rounded-b-none data-[state=active]:bg-[#3072C014] data-[state=active]:border-b data-[state=active]:border-b-[#3072C0] flex items-center justify-center gap-2"
        >
          {activeTab === "notifications" ? <NotificationFilledIcon color="#3072C0"/> : <NotificationIcon />}
          Notifications
        </TabsTrigger>
        <TabsTrigger
          value="security"
          className="data-[state=active]:text-[#3072C0] py-3 whitespace-nowrap rounded-b-none data-[state=active]:bg-[#3072C014] data-[state=active]:border-b data-[state=active]:border-b-[#3072C0] flex items-center justify-center gap-2"
        >
          {activeTab === "security" ? <SecurityFilledIcon color="#3072C0"/> : <SecurityIcon />}
          Security
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="mt-0">
        <GeneralTabForm ref={generalRef} />
      </TabsContent>
      <TabsContent value="users" className="mt-0">
        <UserManagementForm ref={userRef} onSubmit={d => console.log("Users:", d)} />
      </TabsContent>
      <TabsContent value="notifications" className="mt-0">
        <NotificationForm ref={notificationRef} onSubmit={d => console.log("Notifications:", d)} />
      </TabsContent>
      <TabsContent value="security" className="mt-0">
        <SecurityForm ref={securityRef} onSubmit={d => console.log("Security:", d)} />
      </TabsContent>
    </Tabs>
  );
});

SettingsTabs.displayName = "SettingsTabs";
