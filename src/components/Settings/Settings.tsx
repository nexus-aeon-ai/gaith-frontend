"use client";
import { ChevronRight } from "lucide-react";
import React from "react";

import { useSettingsStore } from "../../lib/store/settingStore";
import { Button } from "../ui/button";

import { SettingsTabs } from "./SettingTabs";
import AddNewUser from "./UserManagement/AddUser";
import EditUser from "./UserManagement/EditUser";

const Settings = () => {
  const { showAddUserForm, toggleAddUserForm, showEditUserForm, toggleEditUserForm } =
    useSettingsStore();

  if (showAddUserForm) {
    return <AddNewUser closeNewUserForm={toggleAddUserForm} />;
  }
  if (showEditUserForm) {
    return <EditUser closeNewUserForm={toggleEditUserForm} />;
  }

  return (
    <div className="p-6 font-inter w-full">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-card-foreground text-sm">
        Configure system preferences and manage account settings
      </p>
      <SettingsTabs />
      <div className="flex justify-end gap-2 mt-4">
        <Button className="border border-[#687192] text-[#687192] p-4 px-6 h-16 text-md font-[400] bg-transparent dark:hover:bg-[#687192]/20 hover:bg-[#687192]/10 rounded-[16px]">
          Reset To Defaults
        </Button>
        <Button className="border-noen text-white p-4 px-6 h-16 text-md font-[400] bg-[#3072C0] hover:bg-[#3072C0]/80  rounded-[16px]">
          Save All Changes
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default Settings;
