import React from "react";

import { SettingsTabs } from "./SettingTabs";

const Settings = () => {
  
  return (
    <div className="p-6 font-inter w-full">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-card-foreground text-sm">
        Configure system preferences and manage account settings
      </p>
      <SettingsTabs/>
    </div>
  );
};

export default Settings;
