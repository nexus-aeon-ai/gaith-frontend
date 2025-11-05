"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";

import AddNewUser from "@/components/Settings/UserManagement/AddUser";
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
};

export const SettingsTabs = forwardRef<SettingsTabsRef>((_, ref) => {
  const [activeTab, setActiveTab] = useState("general");
  const [showAddUserForm, setShowAddUserForm] = useState(false);

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
  }));

  if (showAddUserForm) {
    return <AddNewUser closeNewUserForm={() => setShowAddUserForm(false)} />;
  }

  return (
    <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
      <TabsList
        className={cn("w-full grid grid-cols-4 gap-0 h-auto rounded-t-xl border bg-card mt-3")}
      >
        <TabsTrigger value="general" className="whitespace-nowrap">
          General
        </TabsTrigger>
        <TabsTrigger value="users" className="whitespace-nowrap">
          User Management
        </TabsTrigger>
        <TabsTrigger value="notifications" className="whitespace-nowrap">
          Notifications
        </TabsTrigger>
        <TabsTrigger value="security" className="whitespace-nowrap">
          Security
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <GeneralTabForm ref={generalRef} />
      </TabsContent>
      <TabsContent value="users">
        <UserManagementForm ref={userRef} onSubmit={d => console.log("Users:", d)}  setShowAddUserForm={setShowAddUserForm}/>
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationForm ref={notificationRef} onSubmit={d => console.log("Notifications:", d)} />
      </TabsContent>
      <TabsContent value="security">
        <SecurityForm ref={securityRef} onSubmit={d => console.log("Security:", d)} />
      </TabsContent>
    </Tabs>
  );
});

SettingsTabs.displayName = "SettingsTabs";
